import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import { Btn, Card, Navbar } from '../components/UI'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [links, setLinks] = useState([])
  const [profile, setProfile] = useState(null)
  const [newUrl, setNewUrl] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      const [{ data: profileData }, { data: linksData }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('links').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      ])
      setProfile(profileData)
      setLinks(linksData || [])
      setLoading(false)
    }
    init()
  }, [])

  const createLink = async () => {
    if (!newUrl.trim()) return
    const id = Math.random().toString(36).slice(2, 8)
    const { data, error } = await supabase.from('links').insert({ id, user_id: user.id, destination_url: newUrl }).select().single()
    if (!error) { setLinks(prev => [data, ...prev]); setNewUrl(''); setShowCreate(false) }
  }

  const deleteLink = async (id) => {
    await supabase.from('links').delete().eq('id', id)
    setLinks(prev => prev.filter(l => l.id !== id))
  }

  const copyLink = (id) => {
    navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_SITE_URL}/l/${id}`)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const totalVisits = links.reduce((s, l) => s + (l.visits || 0), 0)
  const totalEarnings = links.reduce((s, l) => s + (l.earnings || 0), 0)

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '88px 24px 40px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>Mon Dashboard</h1>
            <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4 }}>{user?.email}</p>
          </div>
          <Btn onClick={() => setShowCreate(!showCreate)}>+ Nouveau lien</Btn>
        </div>

        {/* Create link */}
        {showCreate && (
          <Card style={{ marginBottom: 24, border: '1px solid rgba(108,99,255,.4)' }}>
            <div style={{ fontWeight: 600, marginBottom: 12 }}>Créer un nouveau lien</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <input value={newUrl} onChange={e => setNewUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && createLink()}
                placeholder="https://ton-lien.com/fichier" style={{ flex: 1, minWidth: 200 }} />
              <Btn onClick={createLink}>Créer</Btn>
              <Btn variant="ghost" onClick={() => setShowCreate(false)}>Annuler</Btn>
            </div>
          </Card>
        )}

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Gains totaux', value: `€${totalEarnings.toFixed(2)}`, icon: '💰', color: 'var(--green)' },
            { label: 'Visites totales', value: totalVisits.toLocaleString(), icon: '👁️', color: 'var(--accent)' },
            { label: 'Liens actifs', value: links.length, icon: '🔗', color: 'var(--accent-light)' },
            { label: 'Solde dispo.', value: `€${(profile?.balance || 0).toFixed(2)}`, icon: '💳', color: 'var(--green)' },
          ].map(({ label, value, icon, color }) => (
            <Card key={label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 6 }}>{label}</div>
                  <div style={{ color, fontSize: 26, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>{value}</div>
                </div>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{icon}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Withdrawal */}
        <Card style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontWeight: 600 }}>Solde disponible : <span style={{ color: 'var(--green)' }}>€{(profile?.balance || 0).toFixed(2)}</span></div>
            <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>Seuil de retrait : €5.00</div>
            <div style={{ height: 4, background: 'var(--border)', borderRadius: 99, marginTop: 10, width: 240, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(((profile?.balance || 0) / 5) * 100, 100)}%`, background: 'linear-gradient(90deg, var(--accent), var(--green))', borderRadius: 99, transition: 'width .5s' }} />
            </div>
          </div>
          <Btn variant="ghost" disabled={(profile?.balance || 0) < 5}>💳 Retirer</Btn>
        </Card>

        {/* Links table */}
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontWeight: 600 }}>Mes liens ({links.length})</span>
          </div>
          {links.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center', color: 'var(--muted)' }}>
              Aucun lien créé.{' '}
              <button onClick={() => setShowCreate(true)} style={{ color: 'var(--accent-light)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: 14 }}>Crée ton premier lien ⚡</button>
            </div>
          ) : links.map((link, i) => (
            <div key={link.id} style={{ padding: '16px 24px', borderBottom: i < links.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 160 }}>
                <div style={{ color: 'var(--accent-light)', fontFamily: 'JetBrains Mono, monospace', fontSize: 13, marginBottom: 4 }}>
                  /l/{link.id}
                </div>
                <div style={{ color: 'var(--muted)', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 280 }}>
                  {link.destination_url}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>{(link.visits || 0).toLocaleString()}</div>
                  <div style={{ color: 'var(--muted)', fontSize: 11 }}>visites</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: 'var(--green)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>€{(link.earnings || 0).toFixed(2)}</div>
                  <div style={{ color: 'var(--muted)', fontSize: 11 }}>gains</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Btn variant="ghost" style={{ padding: '8px 12px', fontSize: 12 }} onClick={() => copyLink(link.id)}>
                  {copiedId === link.id ? '✓' : '📋'}
                </Btn>
                <Btn variant="ghost" style={{ padding: '8px 12px', fontSize: 12 }} href={`/l/${link.id}`}>▶</Btn>
                <Btn variant="danger" style={{ padding: '8px 12px', fontSize: 12 }} onClick={() => deleteLink(link.id)}>🗑</Btn>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}
