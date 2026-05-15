import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { url, userId } = req.body
  if (!url || !userId) return res.status(400).json({ error: 'url and userId required' })

  const id = Math.random().toString(36).slice(2, 8)
  const { data, error } = await supabase
    .from('links')
    .insert({ id, user_id: userId, destination_url: url })
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json({ link: data })
}
