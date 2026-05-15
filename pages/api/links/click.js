import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const EARNINGS_PER_CLICK = 0.004

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { linkId } = req.body
  if (!linkId) return res.status(400).json({ error: 'linkId required' })

  // Hash de l'IP pour la déduplication (RGPD compliant)
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || ''
  const ipHash = crypto.createHash('sha256').update(ip + linkId).digest('hex')

  // Vérifie si ce visiteur a déjà cliqué dans les dernières 24h
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { data: existing } = await supabase
    .from('clicks')
    .select('id')
    .eq('link_id', linkId)
    .eq('ip_hash', ipHash)
    .gte('created_at', since)
    .single()

  if (existing) return res.status(200).json({ counted: false, message: 'Already counted' })

  // Enregistre le clic
  await supabase.from('clicks').insert({ link_id: linkId, ip_hash: ipHash, earnings: EARNINGS_PER_CLICK })

  // Met à jour le lien
  const { data: link } = await supabase.from('links').select('visits, earnings, user_id').eq('id', linkId).single()
  if (link) {
    await supabase.from('links').update({
      visits: (link.visits || 0) + 1,
      earnings: (link.earnings || 0) + EARNINGS_PER_CLICK
    }).eq('id', linkId)

    // Met à jour le solde du créateur
    await supabase.from('profiles').update({
      balance: supabase.rpc('increment', { x: EARNINGS_PER_CLICK }),
      total_earnings: supabase.rpc('increment', { x: EARNINGS_PER_CLICK }),
    }).eq('id', link.user_id)
  }

  return res.status(200).json({ counted: true, earnings: EARNINGS_PER_CLICK })
}
