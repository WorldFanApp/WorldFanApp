import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"

const authOptions: NextAuthOptions = {
  providers: [
    {
      id: "worldcoin",
      name: "Worldcoin",
      type: "oauth",
      wellKnown: "https://id.worldcoin.org/.well-known/openid_configuration",
      authorization: { params: { scope: "openid" } },
      clientId: process.env.WORLDCOIN_APP_ID!,
      clientSecret: process.env.WORLDCOIN_CLIENT_SECRET!,
      idToken: true,
      checks: ["state", "nonce", "pkce"],
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.sub,
          verificationLevel: profile["https://id.worldcoin.org/v1"].verification_level,
        }
      },
    },
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.worldcoin = {
          verification_level: profile["https://id.worldcoin.org/v1"]?.verification_level,
          nullifier_hash: profile.sub,
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token.worldcoin) {
        session.user.worldcoin = token.worldcoin
      }
      return session
    },
  },
  pages: {
    signIn: "/",
    error: "/auth/error",
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
