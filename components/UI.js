import Link from 'next/link'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'

export function Btn({ children, onClick, variant = 'primary', style = {}, disabled, href, type = 'button' }) {
  const base = {
    border: 'none', cursor: disabled ? 'not-allowed' : 'pointer', borderRadius: 10,
    fontFamily: 'var(--font)', fontWeight: 600, fontSize: 15, transition: 'all .2s',
    display: 'inline-flex', alignItems: 'center', gap: 8, opacity: disabled ? 0.5 : 1,
  }
  const variants = {
    primary: { background: 'linear-gradient(135deg, var(--accent), var(--accent-light))', color: '#fff', padding: '12px 24px', boxShadow: '0 4px 20px var(--accent-glow)' },
    ghost: { background: 'transparent', color: 'var(--muted)', padding: '12px 20px', border: '1px solid var(--border)' },
    green: { background: 'linear-gradient(135deg, var(--green), #00f5c0)', color: '#0a0a0f', padding: '12px 24px', boxShadow: '0 4px 20px var(--green-glow)' },
    danger: { background: 'transparent', color: 'var(--red)', padding: '10px 16px', border: '1px solid rgba(255,95,126,.2)' },
  }
  const s = { ...base, ...variants[variant], ...style }
  const handlers = {
    onMouseEnter: e => { if (!disabled) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.filter = 'brightness(1.1)' } },
    onMouseLeave: e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.filter = 'brightness(1)' },
  }
  if (href) return <Link href={href} style={s} {...handlers}>{children}</Link>
  return <button type={type} style={s} onClick={onClick} disabled={disabled} {...handlers}>{children}</button>
}

export function Card({ children, style = {} }) {
  return <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, ...style }}>{children}</div>
}

export function Badge({ children, color = 'var(--accent)' }) {
  return <span style={{ background: color + '22', color, fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20, border: `1px solid ${color}44`, display: 'inline-block' }}>{children}</span>
}

export function Input({ label, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ color: 'var(--muted)', fontSize: 13, fontWeight: 500 }}>{label}</label>}
      <input {...props} />
    </div>
  )
}

export function Navbar() {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(10,10,15,.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', height: 64, display: 'flex', alignItems: 'center', padding: '0 32px', justifyContent: 'space-between' }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, var(--accent), var(--green))', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>⚡</div>
        <span style={{ color: 'var(--text)', fontWeight: 700, fontSize: 18 }}>LinkPay</span>
      </Link>
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        {[['/', '🏠 Accueil'], ['/dashboard', '📊 Dashboard']].map(([href, label]) => (
          <Link key={href} href={href} style={{ background: router.pathname === href ? 'var(--accent-glow)' : 'transparent', color: router.pathname === href ? 'var(--accent-light)' : 'var(--muted)', border: `1px solid ${router.pathname === href ? 'rgba(108,99,255,.4)' : 'transparent'}`, borderRadius: 8, padding: '7px 16px', fontSize: 14, fontWeight: 500, transition: 'all .2s' }}>{label}</Link>
        ))}
        <Btn variant="ghost" style={{ padding: '7px 16px', fontSize: 14 }} onClick={handleLogout}>Déconnexion</Btn>
      </div>
    </nav>
  )
}
