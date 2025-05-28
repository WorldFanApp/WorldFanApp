import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  // Allow access to authentication-related pages and API routes
  const publicPaths = ["/", "/api/auth", "/auth-error"]
  const isPublicPath = publicPaths.some((publicPath) => path.startsWith(publicPath))

  // Allow access to static files and images
  const isStaticFile =
    path.startsWith("/_next") || path.includes("/favicon.ico") || /\.(svg|png|jpg|jpeg|gif|webp)$/.test(path)

  // If it's a public path or a static file, allow the request
  if (isPublicPath || isStaticFile) {
    return NextResponse.next()
  }

  // Check if the user is authenticated with World ID
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const isAuthenticated = !!token

  // If not authenticated, redirect to the sign-in page
  if (!isAuthenticated) {
    const signInUrl = new URL("/", req.url)
    signInUrl.searchParams.set("callbackUrl", path)
    return NextResponse.redirect(signInUrl)
  }

  // If the user is authenticated, allow the request
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
