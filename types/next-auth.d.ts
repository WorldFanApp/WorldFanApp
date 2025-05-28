import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    accessToken?: string
    idToken?: string
    user: {
      /** The user's id from the provider */
      id?: string
      /** The user's credential type from World ID */
      worldcoin_credential_type?: string
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    idToken?: string
    /** Access Token */
    accessToken?: string
    /** User profile from OIDC provider */
    profile?: {
      sub: string
      worldcoin_credential_type?: string
      [key: string]: any
    }
  }
}
