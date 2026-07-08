import jwt from 'jsonwebtoken'
import connectToDatabase from './mongoose'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret'

export async function getUserFromRequest(req: Request) {
  // try cookie
  const cookie = req.headers.get('cookie') || ''
  const match = cookie.match(/(?:^|; )token=([^;]+)/)
  if (match) {
    try {
      // @ts-ignore
      const payload = jwt.verify(match[1], JWT_SECRET)
      const id = (payload as any).id
      try {
        await connectToDatabase()
        // dynamically import User model to avoid loading mongoose in edge runtime
        try {
          const mod = await import('../models/User')
          const User = mod.default
          const user = await User.findById(id).lean().exec() as { _id: any, email: string, name?: string } | null
          if (user) return { id: user._id.toString(), email: user.email, name: user.name }
        } catch (e) {
          // model import failed (possibly edge runtime) — fall back to in-memory below
        }
      } catch (e) {
        // fallback to in-memory
      }
      const mem = (globalThis as any).__inMemoryUsers || {}
      for (const k of Object.keys(mem)) {
        if (k === id || mem[k]._id === id) return { id: k, email: mem[k].email, name: mem[k].name }
      }
    } catch (e) {
      return null
    }
  }

  // no token and no valid user found
  return null
}

export default getUserFromRequest
