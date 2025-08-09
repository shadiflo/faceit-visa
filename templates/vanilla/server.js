const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

// Import the faceit-visa library
const { FaceitVisa, FaceitVisaMiddleware } = require('faceit-visa');

const app = express();
const port = process.env.PORT || 3000;

// Setup session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
  }
}));

// Initialize FaceitVisa
const visa = new FaceitVisa({
  clientId: process.env.FACEIT_CLIENT_ID,
  clientSecret: process.env.FACEIT_CLIENT_SECRET,
  redirectUri: `${process.env.BASE_URL || 'http://localhost:3000'}/api/auth/callback/faceit`
});

// Setup FACEIT auth middleware
const authMiddleware = new FaceitVisaMiddleware(visa);

// Mount auth routes
app.use('/api/auth', authMiddleware.getRoutes());

// API endpoint to get current user
app.get('/api/auth/user', (req, res) => {
  res.json({ user: req.session.user || null });
});

// Serve static files
app.use(express.static(path.join(__dirname)));

// Serve index.html for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`🎮 FACEIT Auth server running at http://localhost:${port}`);
  console.log('📝 Make sure to set up your environment variables in .env');
  console.log('🔧 Visit http://localhost:3000 to test the authentication');
});