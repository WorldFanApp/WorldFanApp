import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "World ID Credentials",
      credentials: {
        nullifier_hash: { label: "Nullifier Hash", type: "text" },
        // Potentially add credential_type if needed for display or logic later
        // credential_type: { label: "Credential Type", type: "text" }
      },
      async authorize(credentials, req) {
        console.log("[NextAuth CredentialsProvider] Authorize called (simplified). Credentials:", credentials);
        // For testing, always authorize if any credentials are provided
        if (credentials) {
          const user = {
            id: credentials.nullifier_hash || "hardcoded_test_user_id", // Use nullifier_hash if present, else fallback
            name: "Test User (Simplified Auth)",
            // Include worldcoin_credential_type if available and needed for session
            // worldcoin_credential_type: credentials.credential_type
          };
          console.log("[NextAuth CredentialsProvider] Simplified authorization successful. Returning user:", user);
          return user;
        }
        console.log("[NextAuth CredentialsProvider] Simplified authorization - no credentials provided. Returning null.");
        return null;
      }
    }),
    // Removed the old custom "worldcoin" OAuth provider
  ],
  secret: process.env.NEXTAUTH_SECRET!,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      console.log("[NextAuth JWT Callback] Called. Token:", JSON.stringify(token), "User:", JSON.stringify(user), "Account:", JSON.stringify(account), "Profile:", JSON.stringify(profile));
      try {
        // Initial sign in
        if (account && user && profile) { // OAuth specific logic (no longer used but kept for structure)
          token.accessToken = account.access_token;
          token.idToken = account.id_token;
          token.sub = profile.sub;
          token.name = profile.name || profile.preferred_username || "World ID User";
          token.email = profile.email;
          token.picture = profile.picture;
          token.worldcoin_credential_type =
            profile["https://id.worldcoin.org/v1/credential_type"] || profile.credential_type;
        } else if (user && !account) { // Credentials provider specific logic
          token.sub = user.id;
          token.name = user.name;
          // token.email = user.email; // if set in authorize
          // token.picture = user.image; // if set in authorize
          // token.worldcoin_credential_type = user.worldcoin_credential_type; // if set in authorize
        }
        console.log("[NextAuth JWT Callback] Returning token:", JSON.stringify(token));
        return token;
      } catch (error) {
        console.error("[NextAuth JWT Callback] Error:", error);
        // Return original token or throw error to prevent session creation
        return token; // or throw error;
      }
    },
    async session({ session, token }) {
      console.log("[NextAuth Session Callback] Called. Session:", JSON.stringify(session), "Token:", JSON.stringify(token));
      try {
        if (token.sub) {
          session.user.id = token.sub;
        }
        if (token.name) {
          session.user.name = token.name;
        }
        if (token.email) {
          session.user.email = token.email;
        }
        if (token.picture) {
          session.user.image = token.picture;
        }
        if (token.worldcoin_credential_type) {
          session.user.worldcoin_credential_type = token.worldcoin_credential_type as string;
        }
        console.log("[NextAuth Session Callback] Returning session:", JSON.stringify(session));
        return session;
      } catch (error) {
        console.error("[NextAuth Session Callback] Error:", error);
        // Return original session or throw error
        return session; // or throw error;
      }
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
