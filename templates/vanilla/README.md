# Vanilla HTML/CSS/JS FACEIT OAuth2 Integration

A complete vanilla web application with FACEIT OAuth2 authentication using the `faceit-visa` library.

## Features

- ✅ **Pure HTML/CSS/JS** - No frameworks required
- ✅ **Express.js Backend** - Simple API server for OAuth2 handling
- ✅ **Responsive Design** - Works on desktop and mobile
- ✅ **Session Management** - Secure server-side sessions
- ✅ **Error Handling** - Comprehensive error states

## Quick Start

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Setup Environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your FACEIT credentials
   ```

3. **Configure FACEIT App:**
   Set redirect URI in FACEIT Developer Portal:
   ```
   http://localhost:3000/api/auth/callback/faceit
   ```

4. **Run the Server:**
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

5. **Open Browser:**
   Visit http://localhost:3000

## File Structure

```
├── index.html         # Main HTML page
├── styles.css         # CSS styles
├── faceit-auth.js     # Frontend JavaScript
├── server.js          # Express.js server
├── package.json       # Dependencies
├── .env.example       # Environment template
└── README.md          # This file
```

## How It Works

1. **Frontend** (`index.html` + `faceit-auth.js`):
   - Responsive navbar with login/logout buttons
   - JavaScript class handles authentication state
   - Makes API calls to backend endpoints

2. **Backend** (`server.js`):
   - Express.js server with `faceit-visa` middleware
   - Handles OAuth2 flow automatically
   - Serves static files and API endpoints

3. **Authentication Flow**:
   - User clicks "Login with FACEIT"
   - Redirects to `/api/auth/faceit`
   - FACEIT OAuth2 flow completes
   - User data stored in server session
   - Frontend updates to show user info

## API Endpoints

- **GET `/api/auth/faceit`** - Start OAuth2 login
- **GET `/api/auth/callback/faceit`** - OAuth2 callback handler
- **GET `/api/auth/user`** - Get current user data
- **GET `/api/auth/logout`** - Logout and clear session

## Customization

- **Styling**: Modify `styles.css` for custom appearance
- **Layout**: Edit `index.html` for different structure
- **Behavior**: Update `faceit-auth.js` for custom functionality
- **Server**: Extend `server.js` for additional features

## Deployment

For production deployment:

1. Set `NODE_ENV=production` in your environment
2. Use a proper session store (Redis, MongoDB, etc.)
3. Set secure session secrets
4. Update `BASE_URL` to your domain
5. Configure HTTPS

## Troubleshooting

- **Login not working**: Check FACEIT app redirect URI
- **Session issues**: Verify session secret is set
- **CORS errors**: Ensure same origin for frontend/backend
- **Port conflicts**: Change port in `server.js`

Need help? Check the main [FaceitVisa documentation](https://github.com/shadiflo/faceit-visa).