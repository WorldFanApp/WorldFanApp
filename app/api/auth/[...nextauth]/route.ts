import NextAuth from "next-auth"
import { OIDCProvider } from "next-auth/providers"

// World ID OIDC configuration
const worldIdProvider = OIDCProvider({
  id: "worldcoin",
  name: "World ID",
  issuer: "https://id.worldcoin.org",
  clientId: "app_7a9639a92f85fcf27213f982eddb5064",
  clientSecret: "sk_880ebb28f438a0c430aa27b814b5334531e4736ed589ae82",
  authorization: {
    params: {
      scope: "openid profile email",
    },
  },
  checks: ["pkce", "state"],
  client: {
    token_endpoint_auth_method: "client_secret_post",
  },
  profile(profile) {
    return {
      id: profile.sub,
      name: profile.name || profile.preferred_username,
      email: profile.email,
      image: profile.picture,
      worldcoin_credential_type: profile.worldcoin_credential_type,
    }
  },
})

export const authOptions = {
  providers: [worldIdProvider],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token
        token.idToken = account.id_token
        token.profile = profile
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string
        session.accessToken = token.accessToken as string
        session.idToken = token.idToken as string

        if (token.profile) {
          session.user.worldcoin_credential_type = token.profile.worldcoin_credential_type as string
        }
      }
      return session
    },
  },
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/auth-error",
  },
  debug: process.env.NODE_ENV === "development",
  logger: {
    error(code, metadata) {
      console.error(`Auth Error: ${code}`, metadata)
    },
    warn(code) {
      console.warn(`Auth Warning: ${code}`)
    },
    debug(code, metadata) {
      console.log(`Auth Debug: ${code}`, metadata)
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
