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
        console.log("[NextAuth CredentialsProvider] Authorize called with credentials:", credentials);

        if (!credentials || !credentials.nullifier_hash) {
          console.log("[NextAuth CredentialsProvider] Missing nullifier_hash.");
          return null;
        }

        // Here, you could potentially fetch user details from a DB if you store them
        // For now, just returning a basic user object.
        // The 'id' will be the nullifier_hash, 'name' can be generic or derived.
        // If you passed credential_type from the frontend, you could use it here.
        const user = {
          id: credentials.nullifier_hash,
          name: "Verified Fan", // Or construct name, e.g., `Verified ${credentials.credential_type || 'User'}`
          // email: null, // Credentials provider doesn't inherently provide email
          // image: null,
          // worldcoin_credential_type: credentials.credential_type || "orb", // Example if passed
        };
        console.log("[NextAuth CredentialsProvider] Authorized user:", user);
        return user;
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
      // Initial sign in
      if (account && user && profile) { // OAuth specific logic
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
        // Standardize user ID to token.sub for both OAuth and Credentials
        token.sub = profile.sub; // For OAuth, profile.sub is the user's unique ID from provider
        token.name = profile.name || profile.preferred_username || "World ID User";
        token.email = profile.email;
        token.picture = profile.picture;
        token.worldcoin_credential_type =
          profile["https://id.worldcoin.org/v1/credential_type"] || profile.credential_type;
      } else if (user && !account) { // Credentials provider specific logic (user exists, account does not)
        // The user object is the one returned from the authorize callback
        token.sub = user.id; // user.id from Credentials provider is nullifier_hash
        token.name = user.name;
        // token.email = user.email; // if you set it in authorize
        // token.picture = user.image; // if you set it in authorize
        // token.worldcoin_credential_type = user.worldcoin_credential_type; // if you set it
      }
      return token;
    },
    async session({ session, token }) {
      // token.sub will contain the user's unique ID (nullifier_hash for Credentials, profile.sub for OAuth)
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
      return session;
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
