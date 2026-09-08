// Authenticates credentials and sets the session cookie for a returning user.
import connectToDatabase from '../../../../lib/mongoose'
import User from '../../../../models/User'
// @ts-ignore - bcryptjs has no bundled types in this project
import bcrypt from 'bcryptjs'
// @ts-ignore - jsonwebtoken has no bundled types in this project
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret'

function comparePassword(password: string, hashed: string) {
  return new Promise<boolean>((resolve, reject) => {
    bcrypt.compare(password, hashed, (err: any, same: boolean) => {
      if (err) return reject(err)
      resolve(!!same)
    })
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = body
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
      const u = mem[email]
      if (!u) return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 })
      const ok = await comparePassword(password, u.password)
      if (!ok) return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 })
      const token = jwt.sign({ id: email, email }, JWT_SECRET, { expiresIn: '7d' })
      const resHeaders = new Headers()
      const cookie = `token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
      resHeaders.append('Set-Cookie', cookie)
      resHeaders.append('Content-Type', 'application/json')
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers: resHeaders })
    }

    const user = await User.findOne({ email }).select('password email name').lean().exec() as {
      _id: any
      email: string
      password: string
      name?: string
    } | null
    if (!user) return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 })

    const ok = await comparePassword(password, user.password)
    if (!ok) return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 })

    const token = jwt.sign({ id: user._id.toString(), email: user.email }, JWT_SECRET, { expiresIn: '7d' })

    // set cookie
    const resHeaders = new Headers()
    const cookie = `token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
    resHeaders.append('Set-Cookie', cookie)
    resHeaders.append('Content-Type', 'application/json')

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: resHeaders })
  } catch (err: any) {
    console.error('login error', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 })
  }
}
