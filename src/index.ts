import { randomBytes, createHash } from 'crypto';
import axios, { AxiosResponse, AxiosError } from 'axios';
import * as qs from 'qs';

export interface FaceitVisaConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  apiEnv?: string;
  accountEnv?: string;
}

export interface FaceitUser {
  user_id: string;
  nickname: string;
  email?: string;
  avatar?: string;
  country?: string;
  [key: string]: any;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
}

export class FaceitVisa {
  private config: FaceitVisaConfig;
  private codeVerifierStore: Map<string, string> = new Map();

  constructor(config: FaceitVisaConfig) {
    this.config = {
      apiEnv: 'https://api.faceit.com',
      accountEnv: 'https://accounts.faceit.com',
      ...config
    };
  }

  /**
   * Generate authorization URL for OAuth2 flow
   */
  getAuthUrl(sessionId?: string): { url: string; codeVerifier: string } {
    const codeVerifier = this.base64URLEncode(randomBytes(32));
    const codeChallenge = this.base64URLEncode(createHash('sha256').update(codeVerifier).digest());
    
    if (sessionId) {
      this.codeVerifierStore.set(sessionId, codeVerifier);
    }

    const params = new URLSearchParams({
      redirect_popup: 'true',
      response_type: 'code',
      client_id: this.config.clientId,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      redirect_uri: this.config.redirectUri
    });

    const url = `${this.config.accountEnv}/accounts?${params.toString()}`;
    
    return { url, codeVerifier };
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCode(code: string, codeVerifier: string): Promise<TokenResponse | null> {
    try {
      const response: AxiosResponse<TokenResponse> = await axios.post(
        `${this.config.apiEnv}/auth/v1/oauth/token`,
        qs.stringify({
          grant_type: 'authorization_code',
          code: code,
          code_verifier: codeVerifier,
          code_challenge_method: 'S256'
        }),
        {
          headers: {
            'Authorization': `Basic ${this.base64Encode(`${this.config.clientId}:${this.config.clientSecret}`)}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('FaceitVisa: Token exchange failed:', error?.response?.data || error.message);
      return null;
    }
  }

  /**
   * Get user profile using access token
   */
  async getUserProfile(accessToken: string): Promise<FaceitUser | null> {
    try {
      const response: AxiosResponse<FaceitUser> = await axios.get(
        `${this.config.apiEnv}/auth/v1/resources/userinfo`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('FaceitVisa: User profile fetch failed:', error?.response?.data || error.message);
      return null;
    }
  }

  /**
   * Get code verifier by session ID
   */
  getCodeVerifier(sessionId: string): string | undefined {
    return this.codeVerifierStore.get(sessionId);
  }

  /**
   * Remove code verifier after use
   */
  clearCodeVerifier(sessionId: string): void {
    this.codeVerifierStore.delete(sessionId);
  }

  private base64URLEncode(buffer: Buffer): string {
    return buffer.toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  private base64Encode(str: string): string {
    return Buffer.from(str).toString('base64');
  }
}

export default FaceitVisa;