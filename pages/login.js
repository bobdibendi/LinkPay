import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import { Btn, Card, Input } from '../components/UI'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else router.push('/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, var(--accent), var(--green))', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>⚡</div>
            <span style={{ color: 'var(--text)', fontWeight: 700, fontSize: 20 }}>LinkPay</span>
          </Link>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Connexion</h1>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Content de te revoir !</p>
        </div>

        <Card>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="toi@exemple.com" required />
            <Input label="Mot de passe" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
            {error && <div style={{ color: 'var(--red)', fontSize: 13, padding: '10px 14px', background: 'rgba(255,95,126,.1)', borderRadius: 8, border: '1px solid rgba(255,95,126,.2)' }}>{error}</div>}
            <Btn type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
              {loading ? 'Connexion…' : 'Se connecter →'}
            </Btn>
          </form>
        </Card>

        <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 14, marginTop: 20 }}>
          Pas encore de compte ?{' '}
          <Link href="/register" style={{ color: 'var(--accent-light)', fontWeight: 500 }}>Créer un compte</Link>
        </p>
      </div>
    </div>
  )
}
