# FaceitVisa

> **⚠️ Beta Software Notice**  
> This package is currently in testing phase. While it has been tested and is functional, you may encounter bugs or unexpected behavior. Please report any issues to help improve the package.

<img src="faceit.png" alt="FACEIT" width="64" height="64">

**The easiest way to add FACEIT OAuth2 authentication to any web application.**

Inspired by the simplicity of getting a visa - just the essentials you need to authenticate with FACEIT.

[![npm version](https://badge.fury.io/js/faceit-visa.svg)](https://www.npmjs.com/package/faceit-visa)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🚀 **One-Command Setup** - Auto-generates complete integration
- 🔒 **Secure by Default** - PKCE OAuth2 flow with security best practices
- 🌐 **Works Everywhere** - Next.js, PHP, Vanilla HTML/CSS/JS
- 🤖 **Smart Detection** - Automatically detects your project type
- 🎯 **TypeScript Ready** - Full type safety included
- 📦 **Zero Config** - Just add your FACEIT credentials

## 🚀 Quick Start

### Auto-Setup (Recommended)

```bash
npm install faceit-visa
```

That's it! We'll detect your project type and generate everything you need.

### Manual Setup

Choose your framework:

```bash
# Next.js App Router (TypeScript + HTTPS)
npx faceit-visa generate nextjs-app-router

# Vanilla HTML/CSS/JS (Universal)
npx faceit-visa generate vanilla

# Pure PHP (Zero dependencies)
npx faceit-visa generate php
```

## 📋 What Gets Generated

### Next.js App Router
```
src/app/api/auth/
├── faceit/route.ts           # OAuth initiation
├── callback/faceit/route.ts  # OAuth callback
├── user/route.ts            # Get current user
└── logout/route.ts          # Logout endpoint

src/components/
└── Navbar.tsx               # Ready-to-use auth navbar

.env.example                 # Environment template
```

### Vanilla HTML/CSS/JS
```
├── index.html              # Main page with auth
├── faceit-auth.js          # Authentication logic
├── server.js               # Express.js backend
├── styles.css              # Responsive styling
├── package.json            # Dependencies
└── .env.example            # Environment template
```

### PHP
```
├── index.php               # Homepage
├── login.php               # OAuth initiation
├── callback.php            # OAuth callback
├── logout.php              # Logout
├── profile.php             # User profile page
├── FaceitAuth.php          # OAuth class
├── config.php              # Configuration
├── styles.css              # Styling
└── .env.example            # Environment template
```

## 🎯 Examples

### Next.js Integration

After running `npx faceit-visa generate nextjs-app-router`:

**1. Add credentials to `.env.local`:**
```env
FACEIT_CLIENT_ID=your_client_id_here
FACEIT_CLIENT_SECRET=your_client_secret_here
NEXTAUTH_URL=https://localhost:3000
```

**2. Use the generated navbar:**
```tsx
// app/layout.tsx
import Navbar from '@/components/Navbar'

export default function Layout({ children }) {
  return (
    <html>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
```

**3. Start with HTTPS:**
```bash
npm run dev -- --experimental-https
```

**4. Set FACEIT redirect URI:**
```
https://localhost:3000/api/auth/callback/faceit
```

### PHP Integration

After running `npx faceit-visa generate php`:

**1. Add credentials to `.env`:**
```env
FACEIT_CLIENT_ID=your_client_id_here
FACEIT_CLIENT_SECRET=your_client_secret_here
BASE_URL=http://localhost:8000
```

**2. Start PHP server:**
```bash
php -S localhost:8000
```

**3. Set FACEIT redirect URI:**
```
http://localhost:8000/callback.php
```

### Vanilla HTML/JS Integration

After running `npx faceit-visa generate vanilla`:

**1. Install dependencies:**
```bash
npm install
```

**2. Add credentials to `.env`:**
```env
FACEIT_CLIENT_ID=your_client_id_here
FACEIT_CLIENT_SECRET=your_client_secret_here
BASE_URL=http://localhost:3000
```

**3. Start server:**
```bash
npm start
```

## 🔧 Manual Usage (Advanced)

For custom implementations:

```typescript
import { FaceitVisa } from 'faceit-visa'

const visa = new FaceitVisa({
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  redirectUri: 'https://yourapp.com/callback'
})

// Generate auth URL
const { url, codeVerifier } = visa.getAuthUrl()

// Exchange code for token
const token = await visa.exchangeCode(code, codeVerifier)

// Get user profile
const user = await visa.getUserProfile(token.access_token)
```

## 🎮 FACEIT Setup

1. Go to [FACEIT Developer Portal](https://developers.faceit.com/)
2. Create a new application
3. Set your redirect URI based on your template:
   - Next.js: `https://localhost:3000/api/auth/callback/faceit`
   - PHP: `http://localhost:8000/callback.php`
   - Vanilla: `http://localhost:3000/api/auth/callback/faceit`
4. Copy Client ID and Client Secret to your `.env` file

## 🛠️ CLI Commands

```bash
# Generate templates
npx faceit-visa generate nextjs-app-router
npx faceit-visa generate vanilla
npx faceit-visa generate php

# List available templates
npx faceit-visa list

# Get help
npx faceit-visa help
```

## 🔒 Security Features

- **PKCE Flow**: Proof Key for Code Exchange for maximum security
- **State Parameter**: CSRF protection during OAuth flow
- **Secure Cookies**: httpOnly, secure, SameSite settings
- **Input Sanitization**: All user inputs properly validated
- **Token Storage**: Secure server-side session management

## 🌟 User Flow

1. **Click "Login with FACEIT"** → Redirect to FACEIT OAuth
2. **User authorizes** → FACEIT redirects back with code
3. **Exchange code for token** → Get access token securely
4. **Fetch user profile** → Display user info and gaming stats
5. **Session management** → Maintain login state

## 📚 API Reference

### FaceitVisa Class

```typescript
interface FaceitUser {
  user_id: string
  player_id: string
  nickname: string
  avatar: string
  country: string
  level?: number
}

class FaceitVisa {
  getAuthUrl(): { url: string, codeVerifier: string }
  exchangeCode(code: string, codeVerifier: string): Promise<TokenResponse>
  getUserProfile(accessToken: string): Promise<FaceitUser>
}
```

## 🚨 Troubleshooting

| Issue | Solution |
|-------|----------|
| `404 on callback` | Check redirect URI matches exactly |
| `HTTPS required` | Use `--experimental-https` for Next.js dev |
| `Missing credentials` | Verify `.env` file has correct values |
| `CORS errors` | Ensure same origin for frontend/backend |

## 📦 Requirements

- **Next.js**: Node.js 18+, Next.js 13+
- **PHP**: PHP 7.4+, cURL extension
- **Vanilla**: Node.js 16+, Express.js

## 🤝 Contributing

Contributions welcome! Please check the [issues page](https://github.com/shadiflo/faceit-visa/issues).

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙋 Support

- 📖 **Documentation**: This README
- 🐛 **Issues**: [GitHub Issues](https://github.com/shadiflo/faceit-visa/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/shadiflo/faceit-visa/discussions)

---

Made with ❤️ for the gaming community
