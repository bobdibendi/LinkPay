import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import { Btn, Card, Badge } from '../components/UI'

export default function Home() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [generated, setGenerated] = useState(null)
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  const generate = async () => {
    if (!url.trim()) return
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const id = Math.random().toString(36).slice(2, 8)
    const { error } = await supabase.from('links').insert({ id, user_id: user.id, destination_url: url })
    if (!error) setGenerated({ id, url })
    setLoading(false)
  }

  const copy = () => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
    navigator.clipboard.writeText(`${siteUrl}/l/${generated.id}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', position: 'relative', overflow: 'hidden' }}>
      {/* Glow bg */}
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ textAlign: 'center', maxWidth: 640, position: 'relative', zIndex: 1 }}>
        <div className="fade-up">
          <Badge color="var(--green)">✨ Gagne de l'argent avec tes liens</Badge>
        </div>
        <h1 className="fade-up-2" style={{ fontSize: 'clamp(36px,6vw,56px)', fontWeight: 700, lineHeight: 1.15, margin: '20px 0 16px' }}>
          Monétise tes liens,<br />
          <span style={{ background: 'linear-gradient(135deg, var(--accent), var(--green))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>sans frustrer personne.</span>
        </h1>
        <p className="fade-up-3" style={{ color: 'var(--muted)', fontSize: 17, lineHeight: 1.6, marginBottom: 40 }}>
          1 pub courte, 8 secondes, et c'est tout.<br />Pas de délai 24h, pas de 5 étapes absurdes.
        </p>

        <Card style={{ padding: 8, background: 'var(--surface)' }} className="fade-up-3">
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && generate()}
              placeholder="Colle ton lien ici…  https://example.com/mon-fichier"
              style={{ flex: 1 }} />
            <Btn onClick={generate} disabled={loading}>{loading ? '…' : '⚡ Générer'}</Btn>
          </div>
          {generated && (
            <div style={{ marginTop: 8, padding: '12px 16px', background: 'var(--card)', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(0,212,170,.3)', flexWrap: 'wrap', gap: 8 }}>
              <span style={{ color: 'var(--green)', fontFamily: 'JetBrains Mono, monospace', fontSize: 14 }}>
                {(process.env.NEXT_PUBLIC_SITE_URL || '')}/l/{generated.id}
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                <Btn variant="ghost" style={{ padding: '8px 14px', fontSize: 13 }} onClick={copy}>{copied ? '✓ Copié !' : '📋 Copier'}</Btn>
                <Btn variant="green" style={{ padding: '8px 14px', fontSize: 13 }} href={`/l/${generated.id}`}>▶ Tester</Btn>
              </div>
            </div>
          )}
        </Card>

        <div style={{ display: 'flex', gap: 40, justifyContent: 'center', marginTop: 48, flexWrap: 'wrap' }}>
          {[['8 sec', 'Attente max'], ['1 pub', 'Par visite'], ['€0.004', 'Par clic moy.'], ['Gratuit', 'Pour commencer']].map(([v, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--text)', fontSize: 22, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>{v}</div>
              <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 40, flexWrap: 'wrap' }}>
          <Btn href="/register">Créer un compte gratuit →</Btn>
          <Btn variant="ghost" href="/login">Se connecter</Btn>
        </div>
      </div>

      {/* Feature cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, maxWidth: 880, width: '100%', marginTop: 64, position: 'relative', zIndex: 1 }}>
        {[
          ['⚡', 'Ultra rapide', '8 secondes chrono. Pas 10 minutes, pas 1 heure.'],
          ['🎯', '1 seule pub', 'Une bannière propre. Pas de popups ni redirections.'],
          ['💸', 'Paiement rapide', 'Retrait dès 5€ via PayPal. Chaque semaine.'],
          ['📊', 'Stats en direct', 'Clics et gains en temps réel dans ton dashboard.'],
        ].map(([icon, title, desc]) => (
          <Card key={title}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>{title}</div>
            <div style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.5 }}>{desc}</div>
          </Card>
        ))}
      </div>
    </div>
  )
}
