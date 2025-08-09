# FaceitVisa 🎮

A lightweight, TypeScript-first OAuth2 authentication library for FACEIT integration. Inspired by the simplicity of getting a visa - just the essentials you need to authenticate with FACEIT.

## Features

- 🚀 **Easy Setup** - Get started in minutes
- 🔒 **Secure** - Uses PKCE (Proof Key for Code Exchange) flow
- 🎯 **TypeScript First** - Full type safety out of the box
- 🔌 **Express Integration** - Ready-to-use middleware
- 🌐 **Framework Agnostic** - Core library works with any Node.js framework
- 📦 **Lightweight** - Minimal dependencies

## Installation

```bash
npm install faceit-visa
# or
yarn add faceit-visa
# or
pnpm add faceit-visa
```

## Quick Start

### 1. Basic Usage

```typescript
import { FaceitVisa } from 'faceit-visa';

const visa = new FaceitVisa({
  clientId: 'your-faceit-client-id',
  clientSecret: 'your-faceit-client-secret',
  redirectUri: 'http://localhost:3000/auth/callback'
});

// Generate auth URL
const { url, codeVerifier } = visa.getAuthUrl();
console.log('Visit:', url);

// After user authorizes, exchange code for token
const tokenResponse = await visa.exchangeCode(code, codeVerifier);
const user = await visa.getUserProfile(tokenResponse.access_token);
```

### 2. Express.js Integration

```typescript
import express from 'express';
import session from 'express-session';
import { FaceitVisa, FaceitVisaMiddleware } from 'faceit-visa';

const app = express();

// Setup session
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

// Initialize FaceitVisa
const visa = new FaceitVisa({
  clientId: process.env.FACEIT_CLIENT_ID,
  clientSecret: process.env.FACEIT_CLIENT_SECRET,
  redirectUri: 'http://localhost:3000/auth/faceit/callback'
});

// Setup middleware
const authMiddleware = new FaceitVisaMiddleware(visa);

// Mount auth routes
app.use('/auth', authMiddleware.getRoutes());

// Protected route
app.get('/profile', authMiddleware.requireAuth(), (req, res) => {
  res.json({ user: req.user });
});
```

### 3. Next.js App Router

```typescript
// app/auth/faceit/route.ts
import { FaceitVisa } from 'faceit-visa';

const visa = new FaceitVisa({
  clientId: process.env.FACEIT_CLIENT_ID!,
  clientSecret: process.env.FACEIT_CLIENT_SECRET!,
  redirectUri: `${process.env.NEXTAUTH_URL}/auth/faceit/callback`
});

export async function GET() {
  const { url } = visa.getAuthUrl();
  return Response.redirect(url);
}
```

## API Reference

### FaceitVisa

#### Constructor

```typescript
new FaceitVisa(config: FaceitVisaConfig)
```

**FaceitVisaConfig:**
- `clientId`: Your FACEIT application client ID
- `clientSecret`: Your FACEIT application client secret  
- `redirectUri`: Your application's callback URL
- `apiEnv?`: FACEIT API environment (defaults to production)
- `accountEnv?`: FACEIT accounts environment (defaults to production)

#### Methods

**`getAuthUrl(sessionId?: string)`**
- Generates authorization URL for OAuth2 flow
- Returns: `{ url: string, codeVerifier: string }`

**`exchangeCode(code: string, codeVerifier: string)`**  
- Exchanges authorization code for access token
- Returns: `Promise<TokenResponse | null>`

**`getUserProfile(accessToken: string)`**
- Fetches user profile using access token
- Returns: `Promise<FaceitUser | null>`

### FaceitVisaMiddleware

Express.js middleware for easy integration.

#### Constructor

```typescript
new FaceitVisaMiddleware(visa: FaceitVisa, options?: MiddlewareOptions)
```

**MiddlewareOptions:**
- `loginPath?`: Login route path (default: `/auth/faceit`)
- `callbackPath?`: Callback route path (default: `/auth/faceit/callback`)
- `onSuccess?`: Success callback function
- `onError?`: Error callback function

#### Methods

**`getRoutes()`**
- Returns Express router with login and callback routes

**`requireAuth()`**  
- Middleware that requires authentication
- Redirects unauthenticated users

**`optionalAuth()`**
- Middleware that optionally adds user to request
- Continues regardless of authentication status

**`logout()`**
- Middleware that clears user session

## Environment Variables

Create a `.env` file in your project root:

```env
FACEIT_CLIENT_ID=your_client_id_here
FACEIT_CLIENT_SECRET=your_client_secret_here
```

## Getting FACEIT Credentials

1. Go to [FACEIT Developer Portal](https://developers.faceit.com/)
2. Create a new application
3. Set your redirect URI (e.g., `http://localhost:3000/auth/faceit/callback`)
4. Copy your Client ID and Client Secret

## Examples

Check out the `/examples` directory for complete implementations:

- **Express.js**: Basic Express server with session management
- **Next.js App Router**: Modern Next.js integration

## TypeScript Support

FaceitVisa is built with TypeScript and provides full type definitions:

```typescript
import type { FaceitUser, TokenResponse, FaceitVisaConfig } from 'faceit-visa';
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/faceit-visa/issues)
- 📖 **Documentation**: This README and inline code documentation
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/faceit-visa/discussions)

---

Made with ❤️ for the gaming community