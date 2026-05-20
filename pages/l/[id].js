import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabase'
import { Btn, Card } from '../../components/UI'
import Head from 'next/head'

const TIMER = 8

export default function LinkPage({ link }) {
  const [seconds, setSeconds] = useState(TIMER)
  const [phase, setPhase] = useState('ad')
  const [adLoaded, setAdLoaded] = useState(false)
  const router = useRouter()
  const adsInjected = useRef(false)

  useEffect(() => {
    if (!adLoaded || adsInjected.current) return
    adsInjected.current = true

    // PUB 1 : 300x250 iframe — inject dans #ad-300x250
    const container300 = document.getElementById('ad-300x250')
    if (container300) {
      const iframe = document.createElement('iframe')
      iframe.src = `https://www.highperformanceformat.com/40ed4f97447d2c1270f9f30e826a80ac/invoke.js`
      iframe.width = 300
      iframe.height = 250
      iframe.frameBorder = '0'
      iframe.scrolling = 'no'
      // On passe par un script inline dans un iframe srcdoc
      const html = `<!DOCTYPE html><html><head></head><body style="margin:0">
        <script>
          atOptions = {
            key: '40ed4f97447d2c1270f9f30e826a80ac',
            format: 'iframe',
            height: 250,
            width: 300,
            params: {}
          };
        <\/script>
        <script src="https://www.highperformanceformat.com/40ed4f97447d2c1270f9f30e826a80ac/invoke.js"><\/script>
      </body></html>`
      const blob = new Blob([html], { type: 'text/html' })
      iframe.src = URL.createObjectURL(blob)
      container300.appendChild(iframe)
    }





  }, [adLoaded])

  useEffect(() => {
    if (!link) return
    setTimeout(() => setAdLoaded(true), 700)
    const interval = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) { clearInterval(interval); setPhase('unlocked'); return 0 }
        return s - 1
      })
    }, 1000)
    supabase.from('clicks').insert({ link_id: link.id, earnings: 0.004 })
    supabase.from('links').update({ visits: (link.visits || 0) + 1, earnings: (link.earnings || 0) + 0.004 }).eq('id', link.id)
    return () => clearInterval(interval)
  }, [link])

  if (router.isFallback) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  )

  if (!link) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, padding: 24 }}>
      <div style={{ fontSize: 48 }}>🔗</div>
      <h2 style={{ fontSize: 22, fontWeight: 700 }}>Lien introuvable</h2>
      <p style={{ color: 'var(--muted)', fontSize: 14 }}>Ce lien n'existe pas ou a été supprimé.</p>
      <Btn href="/">Retour à l'accueil</Btn>
    </div>
  )

  const progress = ((TIMER - seconds) / TIMER) * 100

  if (phase === 'unlocked') return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 24, padding: 24 }}>
      <Head><title>Lien déverrouillé — LinkPay</title></Head>
      <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, var(--green), #00f5c0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, boxShadow: '0 0 40px var(--green-glow)', animation: 'pop .4s ease' }}>✔</div>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8 }}>Lien déverrouillé !</h2>
        <p style={{ color: 'var(--muted)', fontSize: 15 }}>Tu vas être redirigé vers le contenu.</p>
      </div>
      <Card style={{ maxWidth: 420, width: '100%', textAlign: 'center' }}>
        <div style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 8 }}>Destination :</div>
        <div style={{ color: 'var(--accent-light)', fontFamily: 'JetBrains Mono, monospace', fontSize: 13, wordBreak: 'break-all' }}>{link.destination_url}</div>
        <a href={link.destination_url} style={{ display: 'block', marginTop: 16 }}>
          <Btn variant="green" style={{ width: '100%', justifyContent: 'center' }}>🚀 Accéder au contenu</Btn>
        </a>
      </Card>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20, padding: '40px 24px' }}>
      <Head><title>Accès au contenu — LinkPay</title></Head>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <div style={{ width: 24, height: 24, background: 'linear-gradient(135deg, var(--accent), var(--green))', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>⚡</div>
        <span style={{ color: 'var(--muted)', fontSize: 13, fontWeight: 600 }}>LinkPay</span>
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{ color: 'var(--muted)', fontSize: 13 }}>Tu accèdes à :</div>
        <div style={{ color: 'var(--text)', fontFamily: 'JetBrains Mono, monospace', fontSize: 13, marginTop: 4, maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {link.destination_url}
        </div>
      </div>

      {/* Zone pub */}
      <Card style={{ width: '100%', maxWidth: 680, minHeight: 280, position: 'relative', border: '1px solid rgba(108,99,255,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {!adLoaded ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <span style={{ color: 'var(--muted)', fontSize: 14 }}>Chargement de la publicité…</span>
          </div>
        ) : (
          <div style={{ width: '100%', padding: '16px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <div id="ad-300x250" style={{ width: 300, height: 250 }} />
          </div>
        )}
        <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(10,10,15,.8)', borderRadius: 6, padding: '3px 8px', fontSize: 11, color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace' }}>Pub</div>
      </Card>

      {/* Timer */}
      <Card style={{ width: '100%', maxWidth: 680, padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ color: 'var(--muted)', fontSize: 14 }}>Accès au contenu dans…</span>
          <div style={{ width: 44, height: 44, borderRadius: '50%', border: `3px solid ${seconds > 3 ? 'var(--accent)' : 'var(--green)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: 18, transition: 'border-color .3s' }}>
            {seconds}
          </div>
        </div>
        <div style={{ height: 6, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, var(--accent), var(--green))', borderRadius: 99, transition: 'width 1s linear' }} />
        </div>
        <div style={{ marginTop: 10, color: 'var(--muted)', fontSize: 12, textAlign: 'center' }}>
          Seulement 8 secondes · Pas d'étapes supplémentaires ✓
        </div>
      </Card>
    </div>
  )
}

export async function getServerSideProps({ params }) {
  const { data: link } = await supabase
    .from('links')
    .select('*')
    .eq('id', params.id)
    .eq('is_active', true)
    .single()

  return { props: { link: link || null } }
}
