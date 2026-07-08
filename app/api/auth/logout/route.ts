import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete('token')
  res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  return res
}

// allow GET for convenience in browser (dev use)
export async function GET(req: NextRequest) {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete('token')
  res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  return res
}
