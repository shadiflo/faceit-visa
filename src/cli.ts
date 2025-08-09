#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';

interface GenerateOptions {
  framework: 'nextjs-app-router' | 'express' | 'vanilla' | 'php';
  outputDir?: string;
}

class FaceitVisaCLI {
  private templatesPath = path.join(__dirname, '../templates');

  async generate(options: GenerateOptions): Promise<void> {
    const { framework, outputDir = process.cwd() } = options;
    
    console.log(`🚀 Generating ${framework} template files...`);
    
    const templatePath = path.join(this.templatesPath, framework);
    
    if (!fs.existsSync(templatePath)) {
      console.error(`❌ Template not found: ${framework}`);
      process.exit(1);
    }

    try {
      await this.copyTemplate(templatePath, outputDir);
      console.log('✅ Template files generated successfully!');
      console.log('\n📝 Next steps:');
      console.log('1. Install faceit-visa: npm install faceit-visa');
      console.log('2. Copy .env.example to .env.local and fill in your FACEIT credentials');
      console.log('3. Set up your FACEIT app redirect URI');
      console.log('4. Start your development server');
      console.log('\n📖 Check the generated README.md for detailed setup instructions.');
    } catch (error) {
      console.error('❌ Error generating template:', error);
      process.exit(1);
    }
  }

  private async copyTemplate(templatePath: string, outputDir: string): Promise<void> {
    const entries = fs.readdirSync(templatePath, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.join(templatePath, entry.name);
      const destPath = path.join(outputDir, entry.name);
      
      if (entry.isDirectory()) {
        // Create directory if it doesn't exist
        if (!fs.existsSync(destPath)) {
          fs.mkdirSync(destPath, { recursive: true });
        }
        // Recursively copy directory contents
        await this.copyTemplate(srcPath, destPath);
      } else {
        // Create destination directory if it doesn't exist
        const destDir = path.dirname(destPath);
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }
        
        // Copy file
        fs.copyFileSync(srcPath, destPath);
        console.log(`📄 Created: ${path.relative(outputDir, destPath)}`);
      }
    }
  }

  async listTemplates(): Promise<void> {
    console.log('📋 Available templates:');
    const templates = fs.readdirSync(this.templatesPath);
    templates.forEach(template => {
      console.log(`  • ${template}`);
    });
  }

  showHelp(): void {
    console.log(`
🎮 FaceitVisa CLI - Generate OAuth2 integration files

Usage:
  npx faceit-visa generate <framework> [options]
  npx faceit-visa list
  npx faceit-visa help

Commands:
  generate <framework>  Generate template files for the specified framework
  list                  List available templates
  help                  Show this help message

Frameworks:
  nextjs-app-router     Next.js App Router with TypeScript (HTTPS support)
  vanilla              HTML/CSS/JS with Express.js backend (universal)
  php                  Pure PHP implementation (no dependencies)
  express              Express.js template with TypeScript (coming soon)

Options:
  --output-dir, -o     Output directory (default: current directory)

Examples:
  npx faceit-visa generate nextjs-app-router
  npx faceit-visa generate vanilla --output-dir ./my-website
  npx faceit-visa generate php --output-dir ./php-site
  npx faceit-visa list
`);
  }
}

// Parse command line arguments
const cli = new FaceitVisaCLI();
const args = process.argv.slice(2);
const command = args[0];

async function main() {
  switch (command) {
    case 'generate':
      const framework = args[1] as 'nextjs-app-router' | 'express';
      const outputDirIndex = args.indexOf('--output-dir') || args.indexOf('-o');
      const outputDir = outputDirIndex !== -1 ? args[outputDirIndex + 1] : undefined;
      
      if (!framework) {
        console.error('❌ Please specify a framework. Use "npx faceit-visa help" for usage.');
        process.exit(1);
      }
      
      await cli.generate({ framework, outputDir });
      break;
      
    case 'list':
      await cli.listTemplates();
      break;
      
    case 'help':
    case '--help':
    case '-h':
      cli.showHelp();
      break;
      
    default:
      console.error('❌ Unknown command. Use "npx faceit-visa help" for usage.');
      process.exit(1);
  }
}

main().catch(console.error);