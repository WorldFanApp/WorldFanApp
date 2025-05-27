declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      worldcoin?: {
        verification_level: string
        nullifier_hash: string
      }
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    verificationLevel?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    worldcoin?: {
      verification_level: string
      nullifier_hash: string
    }
  }
}
