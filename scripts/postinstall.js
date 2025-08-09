#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Detect project type
const detectProjectType = () => {
  try {
    // Check for package.json (Node.js projects)
    if (fs.existsSync('package.json')) {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      
      // Next.js project
      if (packageJson.dependencies?.next || packageJson.devDependencies?.next) {
        return 'nextjs-app-router';
      }
      
      // Express.js project
      if (packageJson.dependencies?.express || packageJson.devDependencies?.express) {
        return 'vanilla'; // Use vanilla template with Express backend
      }
      
      // Generic Node.js project
      return 'vanilla';
    }
    
    // Check for PHP files
    if (fs.existsSync('index.php') || fs.existsSync('composer.json') || 
        fs.readdirSync('.').some(file => file.endsWith('.php'))) {
      return 'php';
    }
    
    // Check for HTML files (vanilla project)
    if (fs.existsSync('index.html') || 
        fs.readdirSync('.').some(file => file.endsWith('.html'))) {
      return 'vanilla';
    }
    
    return null; // Unknown project type
  } catch {
    return null;
  }
};

// Check if integration already exists
const hasIntegration = (projectType) => {
  switch (projectType) {
    case 'nextjs-app-router':
      return fs.existsSync('src/app/api/auth/faceit') || fs.existsSync('app/api/auth/faceit');
    case 'php':
      return fs.existsSync('FaceitAuth.php') || fs.existsSync('login.php');
    case 'vanilla':
      return fs.existsSync('faceit-auth.js') || fs.existsSync('server.js');
    default:
      return false;
  }
};

// Interactive prompt
const askUser = (projectType) => {
  return new Promise((resolve) => {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const projectNames = {
      'nextjs-app-router': 'Next.js',
      'php': 'PHP',
      'vanilla': 'HTML/JavaScript'
    };

    const fileDescriptions = {
      'nextjs-app-router': [
        '- API routes for authentication',
        '- Navbar component with TypeScript',
        '- Environment template'
      ],
      'php': [
        '- OAuth2 authentication class',
        '- Login/logout pages',
        '- Profile page with user data',
        '- Environment template'
      ],
      'vanilla': [
        '- HTML/CSS/JS frontend',
        '- Express.js backend server',
        '- Authentication JavaScript class',
        '- Environment template'
      ]
    };

    console.log('\n🎮 Welcome to FaceitVisa!');
    console.log(`Detected ${projectNames[projectType]} project. Would you like to auto-generate OAuth2 files?`);
    console.log('\nThis will create:');
    fileDescriptions[projectType].forEach(desc => console.log(desc));
    
    rl.question('\nGenerate files? (y/n): ', (answer) => {
      rl.close();
      resolve(answer.toLowerCase().startsWith('y'));
    });
  });
};

async function postInstall() {
  // Only run in user projects, not when installing in our own package
  if (process.cwd().includes('faceit-visa') && fs.existsSync('src/cli.ts')) {
    console.log('📦 Skipping postinstall in package development');
    return;
  }

  // Detect project type
  const projectType = detectProjectType();
  
  if (!projectType) {
    console.log('\n🎮 FaceitVisa installed!');
    console.log('💡 Available templates:');
    console.log('   npx faceit-visa generate nextjs-app-router  # Next.js App Router');
    console.log('   npx faceit-visa generate vanilla            # HTML/CSS/JS + Express');
    console.log('   npx faceit-visa generate php                # Pure PHP');
    console.log('   npx faceit-visa list                        # Show all templates');
    return;
  }

  // Check if integration already exists
  if (hasIntegration(projectType)) {
    console.log('✅ FaceitVisa integration already exists. You\'re all set!');
    return;
  }

  try {
    const shouldGenerate = await askUser(projectType);
    
    if (shouldGenerate) {
      console.log('\n🚀 Generating FaceitVisa files...');
      
      exec(`npx faceit-visa generate ${projectType}`, (error, stdout, stderr) => {
        if (error) {
          console.error('❌ Error generating files:', error.message);
          console.log(`💡 You can run "npx faceit-visa generate ${projectType}" manually`);
          return;
        }
        
        if (stderr) {
          console.log(stderr);
        }
        
        console.log(stdout);
        
        // Project-specific instructions
        const instructions = {
          'nextjs-app-router': [
            '1. Add your FACEIT credentials to .env.local',
            '2. Set up redirect URI: https://localhost:3000/api/auth/callback/faceit',
            '3. Import the Navbar component in your layout',
            '4. Run: npm run dev -- --experimental-https'
          ],
          'php': [
            '1. Copy .env.example to .env and add your FACEIT credentials',
            '2. Set up redirect URI: http://localhost:8000/callback.php',
            '3. Start server: php -S localhost:8000',
            '4. Visit: http://localhost:8000'
          ],
          'vanilla': [
            '1. Copy .env.example to .env and add your FACEIT credentials',
            '2. Set up redirect URI: http://localhost:3000/api/auth/callback/faceit',
            '3. Install dependencies: npm install',
            '4. Start server: npm start'
          ]
        };
        
        console.log('\n✅ Setup complete! Next steps:');
        instructions[projectType].forEach((step, i) => console.log(`${i + 1}. ${step}`));
      });
    } else {
      console.log(`\n💡 No problem! Run "npx faceit-visa generate ${projectType}" when you\'re ready.`);
    }
  } catch (error) {
    console.log(`\n💡 Run "npx faceit-visa generate ${projectType}" when you\'re ready.`);
  }
}

postInstall();