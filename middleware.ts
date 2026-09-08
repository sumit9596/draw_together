// Guards dashboard navigation before the page is rendered for an unauthenticated visitor.
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Use the auth cookie to protect /dashboard. The API routes still validate the JWT.
export async function middleware(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login?post_login_redirect_url=/dashboard', request.url))
    }
    return NextResponse.next()
  } catch (e) {
    return NextResponse.next()
  }
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/dashboard',
}