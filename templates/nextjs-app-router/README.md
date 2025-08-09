# Next.js App Router Template for FaceitVisa

This template provides ready-to-use files for integrating FACEIT OAuth2 authentication in your Next.js App Router project using the `faceit-visa` package.

## Quick Setup

1. **Copy the files to your Next.js project:**
   ```
   src/app/api/auth/faceit/route.ts
   src/app/api/auth/callback/faceit/route.ts
   src/app/api/auth/user/route.ts
   src/app/api/auth/logout/route.ts
   src/components/Navbar.tsx (optional)
   ```

2. **Install dependencies:**
   ```bash
   npm install faceit-visa
   ```

3. **Set up environment variables:**
   Copy `.env.example` to `.env.local` and fill in your FACEIT credentials:
   ```env
   FACEIT_CLIENT_ID=your_client_id_here
   FACEIT_CLIENT_SECRET=your_client_secret_here
   NEXTAUTH_URL=https://localhost:3000
   ```

4. **Configure FACEIT App:**
   In your FACEIT Developer Portal, set the redirect URI to:
   ```
   https://localhost:3000/api/auth/callback/faceit
   ```

5. **Use the Navbar component (optional):**
   ```tsx
   import Navbar from '@/components/Navbar';
   
   export default function Layout({ children }) {
     return (
       <div>
         <Navbar />
         {children}
       </div>
     );
   }
   ```

## API Routes

- **GET `/api/auth/faceit`** - Initiates OAuth2 flow
- **GET `/api/auth/callback/faceit`** - Handles OAuth2 callback
- **GET `/api/auth/user`** - Returns current user data
- **POST `/api/auth/logout`** - Clears user session

## Features

- ✅ **HTTPS Support** - Works with Next.js experimental HTTPS
- ✅ **TypeScript** - Full type safety
- ✅ **Secure Cookies** - HttpOnly cookies for security
- ✅ **Error Handling** - Comprehensive error handling
- ✅ **Ready Components** - Pre-built Navbar component

## Usage

After setup, users can:

1. Click "Login with FACEIT" button
2. Authorize with FACEIT
3. Get redirected back with user data
4. Access user info via `/api/auth/user`

The authentication state is automatically managed with secure cookies.

## Troubleshooting

- **404 on callback**: Make sure your FACEIT app redirect URI matches exactly
- **HTTPS errors**: Use `npm run dev -- --experimental-https` for development
- **Cookie issues**: Ensure `NEXTAUTH_URL` matches your actual domain

## Need Help?

Check the main [FaceitVisa documentation](https://github.com/shadiflo/faceit-visa) for more details.