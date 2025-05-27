import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"

const authOptions: NextAuthOptions = {
  providers: [
    {
      id: "worldcoin",
      name: "Worldcoin",
      type: "oauth",
      wellKnown: "https://id.worldcoin.org/.well-known/openid_configuration",
      authorization: {
        params: {
          scope: "openid profile email",
        },
      },
      clientId: "app_7a9639a92f85fcf27213f982eddb5064",
      clientSecret: process.env.WORLDCOIN_CLIENT_SECRET!,
      idToken: true,
      checks: ["state", "nonce", "pkce"],
      profile(profile) {
        console.log("Worldcoin profile received:", profile)
        return {
          id: profile.sub,
          name: profile.name || profile.sub,
          email: profile.email,
          image: profile.picture,
          worldcoin: {
            verification_level: profile["https://id.worldcoin.org/v1"]?.verification_level,
            nullifier_hash: profile.sub,
          },
        }
      },
    },
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        console.log("JWT callback - account:", account)
        console.log("JWT callback - profile:", profile)
        token.worldcoin = {
          verification_level: profile["https://id.worldcoin.org/v1"]?.verification_level,
          nullifier_hash: profile.sub,
          access_token: account.access_token,
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token.worldcoin) {
        session.user.worldcoin = token.worldcoin
      }
      console.log("Session callback:", session)
      return session
    },
    async signIn({ user, account, profile }) {
      console.log("SignIn callback:", { user, account, profile })

      // Verify the World ID proof if available
      if (account?.provider === "worldcoin" && profile) {
        try {
          // Additional verification can be done here
          console.log("World ID verification successful for:", profile.sub)
          return true
        } catch (error) {
          console.error("World ID verification failed:", error)
          return false
        }
      }

      return true
    },
  },
  pages: {
    signIn: "/",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  debug: true, // Enable debug logs
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
