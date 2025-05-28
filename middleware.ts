import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
  const token = await getToken({ req })
  const isAuthenticated = !!token

  // Get the pathname of the request
  const path = req.nextUrl.pathname

  // Allow access to public pages
  const publicPaths = ["/", "/api/auth", "/auth-error"]
  const isPublicPath = publicPaths.some((publicPath) => path.startsWith(publicPath))

  // Allow access to static files and images
  const isStaticFile =
    path.startsWith("/_next") || path.includes("/favicon.ico") || /\.(svg|png|jpg|jpeg|gif|webp)$/.test(path)

  // If it's a public path or a static file, allow the request
  if (isPublicPath || isStaticFile) {
    return NextResponse.next()
  }

  // Check if the user is authenticated
  if (!isAuthenticated) {
    // Redirect to the sign-in page
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
