import connectToDatabase from '../../../../lib/mongoose'
import User from '../../../../models/User'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, image } = body
    if (!email) return new Response(JSON.stringify({ error: 'Email required' }), { status: 400 })

    let useInMemory = false
    try { await connectToDatabase() } catch { useInMemory = true }

    if (useInMemory) {
      const mem = (globalThis as any).__inMemoryUsers = (globalThis as any).__inMemoryUsers || {}
      mem[email] = mem[email] || { email, name, image }
      return new Response(JSON.stringify({ ok: true, user: mem[email] }), { status: 200 })
    }

    let user = await User.findOne({ email }).exec()
    if (!user) user = await User.create({ email, name, password: 'dev' })
    return new Response(JSON.stringify({ ok: true, user }), { status: 200 })
  } catch (e) {
    console.error('POST /api/user/sync', e)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 })
  }
}
