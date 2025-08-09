# PHP FACEIT OAuth2 Integration

A complete PHP implementation of FACEIT OAuth2 authentication using the PKCE flow.

## Features

- ✅ **Pure PHP** - No frameworks required
- ✅ **PKCE OAuth2** - Secure authorization code flow
- ✅ **Session Management** - Server-side session handling
- ✅ **Responsive Design** - Mobile-friendly interface
- ✅ **Error Handling** - Comprehensive error management
- ✅ **Security** - CSRF protection with state parameter

## Requirements

- PHP 7.4 or higher
- cURL extension
- Session support

## Quick Start

1. **Setup Environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your FACEIT credentials
   ```

2. **Configure FACEIT App:**
   Set redirect URI in FACEIT Developer Portal:
   ```
   http://localhost:8000/callback.php
   ```

3. **Start PHP Server:**
   ```bash
   php -S localhost:8000
   ```

4. **Open Browser:**
   Visit http://localhost:8000

## File Structure

```
├── index.php          # Home page with login/logout
├── profile.php        # User profile page
├── login.php          # Initiates OAuth2 flow
├── callback.php       # Handles OAuth2 callback
├── logout.php         # Logs out user
├── FaceitAuth.php     # OAuth2 authentication class
├── config.php         # Configuration and setup
├── styles.css         # CSS styles
├── .env.example       # Environment template
└── README.md          # This file
```

## How It Works

### Authentication Flow

1. **Login Request** (`login.php`):
   - Generates PKCE code verifier and challenge
   - Stores verifier and state in session
   - Redirects to FACEIT OAuth2 URL

2. **FACEIT Authorization**:
   - User authorizes the application
   - FACEIT redirects back with authorization code

3. **Callback Handler** (`callback.php`):
   - Validates state parameter (CSRF protection)
   - Exchanges authorization code for access token
   - Fetches user profile with access token
   - Stores user data in session

4. **Protected Pages**:
   - Check session for authenticated user
   - Redirect to login if not authenticated

### Security Features

- **PKCE Flow**: Uses Proof Key for Code Exchange
- **State Parameter**: CSRF protection during OAuth2 flow
- **Secure Sessions**: httpOnly and secure cookie settings
- **Input Validation**: All user input is sanitized
- **Error Handling**: Graceful error management

## Configuration

### Environment Variables

```env
FACEIT_CLIENT_ID=your_client_id
FACEIT_CLIENT_SECRET=your_client_secret
BASE_URL=http://localhost:8000
APP_ENV=development
```

### Session Security

The application automatically configures secure session settings:
- `httpOnly` cookies
- `secure` flag in HTTPS environments
- `SameSite=Lax` for CSRF protection

## API Endpoints

- **GET `/`** - Home page with authentication status
- **GET `/profile.php`** - User profile (requires authentication)
- **GET `/login.php`** - Initiates OAuth2 flow
- **GET `/callback.php`** - OAuth2 callback handler
- **GET `/logout.php`** - Logs out user

## Customization

### Styling
Modify `styles.css` to customize the appearance.

### Authentication Logic
Extend `FaceitAuth.php` for additional functionality:

```php
$auth = new FaceitAuth();

// Check if user is authenticated
if ($auth->isAuthenticated()) {
    $user = $auth->getCurrentUser();
    // Your logic here
}

// Custom logout with redirect
$auth->logout();
header('Location: /custom-page.php');
```

### Error Handling
The application includes comprehensive error handling for:
- Missing authorization code
- Invalid state parameter
- Token exchange failures
- Profile fetch failures

## Deployment

### Production Checklist

1. **Environment**:
   - Set `APP_ENV=production`
   - Use HTTPS (`BASE_URL=https://yourdomain.com`)
   - Set secure session configuration

2. **Security**:
   - Generate unique session secrets
   - Enable error logging (disable display_errors)
   - Use secure cookie settings

3. **FACEIT Configuration**:
   - Update redirect URI to production URL
   - Verify client credentials are correct

### Web Server Configuration

For Apache, create `.htaccess`:
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php [QSA,L]
```

For Nginx:
```nginx
location / {
    try_files $uri $uri/ /index.php?$query_string;
}
```

## Troubleshooting

### Common Issues

1. **"Missing required environment variable"**
   - Check your `.env` file exists and contains all required variables

2. **"Invalid state parameter"**
   - Session issues or CSRF attack attempt
   - Clear browser cookies and try again

3. **cURL errors**
   - Check internet connectivity
   - Verify SSL certificates are valid

4. **OAuth2 callback 404**
   - Verify redirect URI matches exactly in FACEIT app settings
   - Check web server URL rewriting configuration

### Debug Mode

Enable debug mode by setting `APP_ENV=development` in `.env`:
- Shows detailed error messages
- Enables error reporting
- Displays stack traces

## Contributing

This template is part of the [faceit-visa](https://github.com/shadiflo/faceit-visa) project.

## License

MIT License - see the main project for details.