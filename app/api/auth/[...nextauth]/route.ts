import NextAuth, { NextAuthOptions } from "next-auth";
// import WorldIDProvider from "next-auth/providers/worldid"; // Removed WorldIDProvider import

// The default export seems to be an older, unused configuration.
// It's better to remove it or comment it out to avoid confusion.
// For now, per instructions, focusing on removing WorldIdProvider from it.
export default NextAuth({
  providers: [
    // WorldIDProvider({  // Removed WorldIdProvider
    //   clientId: process.env.WORLD_ID_CLIENT_ID,
    //   clientSecret: process.env.WORLD_ID_CLIENT_SECRET,
    //   issuer: "https://id.worldcoin.org",
    //   redirectUri: process.env.NEXTAUTH_URL + "/api/auth/callback/worldid",
    //   authorization: {
    //     params: {
    //       scope: "openid profile",
    //     },
    //   },
    // }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
  },
});

const authOptions: NextAuthOptions = {
  providers: [
    // Removed the custom World ID provider object
    // {
    //   id: "worldcoin",
    //   name: "World ID",
    //   type: "oauth",
    //   version: "2.0",
    //   clientId: process.env.WORLDCOIN_CLIENT_ID!,
    //   clientSecret: process.env.WORLDCOIN_CLIENT_SECRET!,
    //   authorization: {
    //     url: "https://id.worldcoin.org/authorize",
    //     params: {
    //       scope: "openid profile email",
    //       response_type: "code",
    //     },
    //   },
    //   token: {
    //     url: "https://id.worldcoin.org/token",
    //   },
    //   userinfo: {
    //     url: "https://id.worldcoin.org/userinfo",
    //   },
    //   profile(profile) {
    //     return {
    //       id: profile.sub,
    //       name: profile.name || profile.preferred_username || "World ID User",
    //       email: profile.email,
    //       image: profile.picture,
    //       worldcoin_credential_type: profile["https://id.worldcoin.org/v1/credential_type"] || profile.credential_type,
    //     }
    //   },
    // },
  ],
  secret: process.env.NEXTAUTH_SECRET!,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token
        token.idToken = account.id_token
        // Remove World ID specific logic from jwt callback
        // if (profile) {
        //   token.worldcoin_credential_type =
        //     profile["https://id.worldcoin.org/v1/credential_type"] || profile.credential_type
        // }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string
        // Remove World ID specific logic from session callback
        // session.user.worldcoin_credential_type = token.worldcoin_credential_type as string
      }
      return session
    },
  },
  pages: {
    signIn: "/",
    error: "/auth-error",
  },
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
