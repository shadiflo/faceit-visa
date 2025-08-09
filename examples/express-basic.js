const express = require('express');
const session = require('express-session');
const { FaceitVisa, FaceitVisaMiddleware } = require('../dist/index');

const app = express();

// Session configuration
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true in production with HTTPS
}));

// Initialize FaceitVisa
const visa = new FaceitVisa({
  clientId: process.env.FACEIT_CLIENT_ID,
  clientSecret: process.env.FACEIT_CLIENT_SECRET,
  redirectUri: 'http://localhost:3000/auth/faceit/callback'
});

// Initialize middleware
const authMiddleware = new FaceitVisaMiddleware(visa, {
  onSuccess: (req, res) => {
    res.redirect('/profile');
  },
  onError: (req, res, error) => {
    res.status(400).send(`Authentication error: ${error}`);
  }
});

// Use auth routes
app.use('/auth', authMiddleware.getRoutes());

// Public routes
app.get('/', (req, res) => {
  res.send(`
    <h1>Faceit Visa Example</h1>
    <a href="/auth/faceit">Login with FACEIT</a>
  `);
});

// Protected route
app.get('/profile', authMiddleware.requireAuth(), (req, res) => {
  res.json({
    message: 'Welcome to your profile!',
    user: req.user
  });
});

// Logout route
app.get('/logout', authMiddleware.logout());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Make sure to set FACEIT_CLIENT_ID and FACEIT_CLIENT_SECRET environment variables');
});