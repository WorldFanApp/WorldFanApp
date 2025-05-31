// lib/custom-worldid-provider.ts
import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers/oauth";

// Define the structure of the options expected by our custom provider function
interface CustomWorldIDProviderOptions {
  clientId: string;
  clientSecret: string;
  issuer: string; // e.g., "https://id.worldcoin.org"
  redirectUri: string;
  authorization?: {
    params?: Record<string, any>;
  };
}

// Define the structure of the World ID profile (adjust as needed based on actual World ID claims)
interface WorldIDProfile extends Record<string, any> {
  sub: string;
  name?: string;
  preferred_username?: string;
  email?: string;
  picture?: string;
  "https://id.worldcoin.org/v1/credential_type"?: string; // Or just credential_type
  credential_type?: string;
}

export function CustomWorldIDProvider(
  options: CustomWorldIDProviderOptions
): OAuthConfig<WorldIDProfile> {
  const issuer = options.issuer;

  return {
    id: "worldcoin", // Consistent ID for the provider
    name: "World ID",
    type: "oauth",
    version: "2.0", // Standard OAuth 2.0
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    // Attempt to use well-known OpenID Connect discovery if available
    // Otherwise, define endpoints explicitly based on World ID documentation
    wellKnown: `${issuer}/.well-known/openid-configuration`,
    authorization: {
      url: `${issuer}/authorize`, // Default if not overridden by wellKnown
      params: {
        scope: "openid profile email", // Default scopes, can be overridden by options.authorization.params
        response_type: "code",
        ...options.authorization?.params, // Allow overriding scopes and other params
      },
    },
    token: {
      url: `${issuer}/token`, // Default if not overridden by wellKnown
    },
    userinfo: {
      url: `${issuer}/userinfo`, // Default if not overridden by wellKnown
    },
    profile(profile: WorldIDProfile) {
      // Map World ID profile claims to NextAuth user object
      return {
        id: profile.sub,
        name: profile.name || profile.preferred_username || "World ID User",
        email: profile.email,
        image: profile.picture,
        // Include any custom fields you need in the NextAuth user object
        // These can then be accessed in JWT/session callbacks
        worldcoin_credential_type: profile["https://id.worldcoin.org/v1/credential_type"] || profile.credential_type,
      };
    },
    options, // Pass along the original options
  };
}
