import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '../../../../lib/auth'

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req as any)
  if (!user) {
    return NextResponse.json(
      { ok: false, user: null },
      { status: 200, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
    )
  }
  const uid = (user as any)._id || (user as any).id
  return NextResponse.json(
    { ok: true, user: { id: uid, name: (user as any).name, email: (user as any).email } },
    { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
  )
}
