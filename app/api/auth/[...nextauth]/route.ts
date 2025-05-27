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
      clientSecret: "sk_77c15b134e1acaa7ad22b381bd20547bfe6c104b50f45f",
      idToken: true,
      checks: ["state", "nonce", "pkce"],
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name || `WorldFan User`,
          email: profile.email,
          image: profile.picture,
          worldcoin: {
            verification_level: profile["https://id.worldcoin.org/v1"]?.verification_level || "device",
            nullifier_hash: profile.sub,
          },
        }
      },
    },
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.worldcoin = {
          verification_level: profile["https://id.worldcoin.org/v1"]?.verification_level || "device",
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
  },
  session: {
    strategy: "jwt",
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
