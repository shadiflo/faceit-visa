import { Request, Response, NextFunction, Router } from 'express';
import { FaceitVisa, FaceitUser, TokenResponse } from './index';

export interface AuthenticatedRequest extends Request {
  user?: FaceitUser;
  faceitToken?: TokenResponse;
}

export interface MiddlewareOptions {
  loginPath?: string;
  callbackPath?: string;
  sessionSecret?: string;
  onSuccess?: (req: AuthenticatedRequest, res: Response) => void;
  onError?: (req: Request, res: Response, error: string) => void;
}

export class FaceitVisaMiddleware {
  private visa: FaceitVisa;
  private options: MiddlewareOptions;

  constructor(visa: FaceitVisa, options: MiddlewareOptions = {}) {
    this.visa = visa;
    this.options = {
      loginPath: '/auth/faceit',
      callbackPath: '/auth/faceit/callback',
      ...options
    };
  }

  /**
   * Create authentication routes
   */
  getRoutes(): Router {
    const router = Router();

    // Login route
    router.get(this.options.loginPath!, (req: Request, res: Response) => {
      const { url, codeVerifier } = this.visa.getAuthUrl();
      
      // Store codeVerifier in session (like your original code)
      if (req.session) {
        (req.session as any).codeVerifier = codeVerifier;
      }
      
      return res.redirect(url);
    });

    // Callback route
    router.get(this.options.callbackPath!, async (req: Request, res: Response) => {
      const { code } = req.query;
      
      if (!code || typeof code !== 'string') {
        return this.handleError(req, res, 'no_code');
      }

      // Get codeVerifier from session (like your original code)
      const codeVerifier = req.session ? (req.session as any).codeVerifier : null;

      if (!codeVerifier) {
        return this.handleError(req, res, 'no_codeverifier');
      }

      try {
        // Exchange code for token
        const tokenResponse = await this.visa.exchangeCode(code, codeVerifier);
        if (!tokenResponse) {
          return this.handleError(req, res, 'token_exchange_failed');
        }

        // Get user profile
        const user = await this.visa.getUserProfile(tokenResponse.access_token);
        if (!user) {
          return this.handleError(req, res, 'user_profile_failed');
        }

        // Clean up code verifier from session
        if (req.session) {
          delete (req.session as any).codeVerifier;
        }

        // Store user in session
        if (req.session) {
          (req.session as any).user = user;
          (req.session as any).faceitToken = tokenResponse;
        }

        // Add to request
        (req as AuthenticatedRequest).user = user;
        (req as AuthenticatedRequest).faceitToken = tokenResponse;

        if (this.options.onSuccess) {
          this.options.onSuccess(req as AuthenticatedRequest, res);
        } else {
          res.json({ success: true, user });
        }

      } catch (error) {
        console.error('FaceitVisa Middleware: Callback error:', error);
        return this.handleError(req, res, 'internal_error');
      }
    });

    return router;
  }

  /**
   * Middleware to require authentication
   */
  requireAuth() {
    return (req: Request, res: Response, next: NextFunction) => {
      const authReq = req as AuthenticatedRequest;
      
      // Check session first
      if (req.session && (req.session as any).user) {
        authReq.user = (req.session as any).user;
        authReq.faceitToken = (req.session as any).faceitToken;
        return next();
      }

      // Not authenticated
      res.status(401).json({ 
        error: 'unauthorized',
        message: 'Authentication required',
        loginUrl: this.options.loginPath
      });
    };
  }

  /**
   * Optional authentication middleware
   */
  optionalAuth() {
    return (req: Request, res: Response, next: NextFunction) => {
      const authReq = req as AuthenticatedRequest;
      
      if (req.session && (req.session as any).user) {
        authReq.user = (req.session as any).user;
        authReq.faceitToken = (req.session as any).faceitToken;
      }

      next();
    };
  }

  /**
   * Logout middleware
   */
  logout() {
    return (req: Request, res: Response) => {
      if (req.session) {
        delete (req.session as any).user;
        delete (req.session as any).faceitToken;
      }

      res.json({ success: true, message: 'Logged out successfully' });
    };
  }

  private handleError(req: Request, res: Response, error: string) {
    if (this.options.onError) {
      this.options.onError(req, res, error);
    } else {
      const messages: Record<string, string> = {
        no_code: 'Authorization code not provided',
        no_codeverifier: 'Login session expired, try again',
        token_exchange_failed: 'Failed to exchange authorization code',
        user_profile_failed: 'Failed to fetch user profile',
        internal_error: 'Internal server error'
      };

      res.status(400).json({
        error,
        message: messages[error] || 'Unknown error'
      });
    }
  }
}

export default FaceitVisaMiddleware;