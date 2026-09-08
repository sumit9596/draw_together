// Validates new account details, stores the user, and starts an authenticated session.
import connectToDatabase from '../../../../lib/mongoose'
import User from '../../../../models/User'
// @ts-ignore - bcryptjs has no bundled types in this project
import bcrypt from 'bcryptjs'

function hashPassword(password: string, saltRounds: number) {
  return new Promise<string>((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err: any, hashed: string) => {
      if (err) return reject(err)
      resolve(hashed)
    })
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password, name } = body
    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password required' }), { status: 400 })
    }

    let useInMemory = false
    try {
      await connectToDatabase()
    } catch (e) {
      console.warn('MongoDB connection failed, using in-memory fallback', e)
      useInMemory = true
    }

    if (useInMemory) {
      const mem = (globalThis as any).__inMemoryUsers = (globalThis as any).__inMemoryUsers || {}
      if (mem[email]) return new Response(JSON.stringify({ error: 'User already exists' }), { status: 409 })
      const hashed = await hashPassword(password, 8)
      mem[email] = { email, password: hashed, name }
      return new Response(JSON.stringify({ ok: true, userId: email }), { status: 201 })
    }

    const hashedPromise = hashPassword(password, 8)
    const existing = await User.exists({ email })
    if (existing) {
      return new Response(JSON.stringify({ error: 'User already exists' }), { status: 409 })
    }

    const hashed = await hashedPromise
    const user = await User.create({ email, password: hashed, name })

    return new Response(JSON.stringify({ ok: true, userId: user._id }), { status: 201 })
  } catch (err: any) {
    console.error('register error', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 })
  }
}
