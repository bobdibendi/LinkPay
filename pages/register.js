import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import { Btn, Card, Input } from '../components/UI'
import Link from 'next/link'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else { setSuccess(true); setLoading(false) }
  }

  if (success) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Card style={{ maxWidth: 400, width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Vérifie tes emails !</h2>
        <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6 }}>On t'a envoyé un lien de confirmation à <strong style={{ color: 'var(--text)' }}>{email}</strong>. Clique dessus pour activer ton compte.</p>
        <Btn href="/login" style={{ marginTop: 20, width: '100%', justifyContent: 'center' }}>Aller à la connexion</Btn>
      </Card>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, var(--accent), var(--green))', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>⚡</div>
            <span style={{ color: 'var(--text)', fontWeight: 700, fontSize: 20 }}>LinkPay</span>
          </Link>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Créer un compte</h1>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Gratuit. Toujours.</p>
        </div>

        <Card>
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="toi@exemple.com" required />
            <Input label="Mot de passe" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="8 caractères minimum" minLength={8} required />
            {error && <div style={{ color: 'var(--red)', fontSize: 13, padding: '10px 14px', background: 'rgba(255,95,126,.1)', borderRadius: 8, border: '1px solid rgba(255,95,126,.2)' }}>{error}</div>}
            <Btn type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
              {loading ? 'Création…' : 'Créer mon compte →'}
            </Btn>
          </form>
        </Card>

        <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 14, marginTop: 20 }}>
          Déjà un compte ?{' '}
          <Link href="/login" style={{ color: 'var(--accent-light)', fontWeight: 500 }}>Se connecter</Link>
        </p>
      </div>
    </div>
  )
}
