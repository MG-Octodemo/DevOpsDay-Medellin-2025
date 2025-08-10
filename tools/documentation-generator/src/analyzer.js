/**
 * Code analyzer to detect project patterns and technologies
 */

const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

class CodeAnalyzer {
  constructor(projectPath) {
    this.projectPath = projectPath;
    this.analysisResults = {};
  }

  /**
   * Analyze the entire project
   */
  async analyze() {
    console.log(`Analyzing project at: ${this.projectPath}`);
    
    // Check if project path exists
    if (!await fs.pathExists(this.projectPath)) {
      throw new Error(`Project path does not exist: ${this.projectPath}`);
    }
    
    this.analysisResults = {
      projectType: await this.detectProjectType(),
      entryPoints: await this.detectEntryPoints(),
      persistenceType: await this.detectPersistenceType(),
      architecturePattern: await this.detectArchitecturePattern(),
      technologies: await this.detectTechnologies(),
      structure: await this.analyzeProjectStructure()
    };

    return this.analysisResults;
  }

  /**
   * Detect primary project type based on files and dependencies
   */
  async detectProjectType() {
    const indicators = {
      '.NET': ['*.csproj', '*.sln', 'Program.cs', 'Startup.cs'],
      'Java': ['pom.xml', 'build.gradle', '*.java', 'src/main/java'],
      'Spring': ['application.properties', 'application.yml', '@SpringBootApplication'],
      'Node.js': ['package.json', 'server.js', 'index.js', 'app.js'],
      'React': ['src/App.js', 'src/index.js', 'react', 'react-dom'],
      'Angular': ['angular.json', 'src/app', '@angular/core'],
      'Python': ['requirements.txt', 'setup.py', '*.py', 'main.py'],
      'Microservices': ['docker-compose.yml', 'kubernetes', 'helm']
    };

    const detectedTypes = [];

    for (const [type, patterns] of Object.entries(indicators)) {
      let score = 0;
      
      for (const pattern of patterns) {
        if (pattern.startsWith('@') || pattern.includes('/')) {
          // Check file content or specific paths
          if (await this.checkFileContent(pattern)) {
            score += 2;
          }
        } else {
          // Check file existence
          const files = glob.sync(pattern, { cwd: this.projectPath });
          if (files.length > 0) {
            score += 1;
          }
        }
      }
      
      if (score > 0) {
        detectedTypes.push({ type, score });
      }
    }

    // Sort by score and return the highest
    detectedTypes.sort((a, b) => b.score - a.score);
    return detectedTypes.length > 0 ? detectedTypes[0].type : 'Other';
  }

  /**
   * Detect entry points in the application
   */
  async detectEntryPoints() {
    const entryPoints = [];

    // API endpoints
    const apiFiles = glob.sync('**/*{controller,route,api}*.{js,ts,cs,java}', { 
      cwd: this.projectPath,
      ignore: ['node_modules/**', 'dist/**', 'build/**']
    });
    
    if (apiFiles.length > 0) {
      entryPoints.push('API');
    }

    // GraphQL
    const graphqlFiles = glob.sync('**/*{graphql,gql}*.{js,ts}', { 
      cwd: this.projectPath,
      ignore: ['node_modules/**']
    });
    
    if (graphqlFiles.length > 0) {
      entryPoints.push('GraphQL');
    }

    // Frontend components
    const frontendFiles = glob.sync('**/{App,Index,Main}.{js,jsx,ts,tsx}', { 
      cwd: this.projectPath,
      ignore: ['node_modules/**']
    });
    
    if (frontendFiles.length > 0) {
      entryPoints.push('Frontend');
    }

    // CLI applications
    const cliFiles = glob.sync('**/{cli,command,console}*.{js,ts,cs,java,py}', { 
      cwd: this.projectPath,
      ignore: ['node_modules/**']
    });
    
    if (cliFiles.length > 0) {
      entryPoints.push('CLI');
    }

    return entryPoints.length > 0 ? entryPoints : ['Custom'];
  }

  /**
   * Detect persistence mechanisms
   */
  async detectPersistenceType() {
    const persistenceTypes = [];

    // Database connections
    const dbPatterns = {
      'SQL Database': ['connection', 'dbcontext', 'datasource', 'hibernate', 'entity framework', 'sequelize'],
      'NoSQL Database': ['mongodb', 'cosmos', 'dynamodb', 'firestore', 'mongoose'],
      'External API': ['httpclient', 'axios', 'fetch', 'resttemplate'],
      'Message Queue': ['rabbitmq', 'kafka', 'servicebus', 'sqs', 'activemq'],
      'Cache': ['redis', 'memcached', 'cache']
    };

    for (const [type, patterns] of Object.entries(dbPatterns)) {
      for (const pattern of patterns) {
        if (await this.searchInFiles(pattern)) {
          persistenceTypes.push(type);
          break;
        }
      }
    }

    // Check for file system operations
    if (await this.searchInFiles('fs\\.') || await this.searchInFiles('file')) {
      persistenceTypes.push('File System');
    }

    return persistenceTypes.length > 0 ? persistenceTypes[0] : 'None';
  }

  /**
   * Detect architecture pattern
   */
  async detectArchitecturePattern() {
    const patterns = {
      'Clean': ['domain', 'application', 'infrastructure', 'usecase'],
      'CQRS': ['command', 'query', 'handler', 'mediatr'],
      'MVC': ['controller', 'model', 'view'],
      'MVVM': ['viewmodel', 'binding'],
      'Microservices': ['docker', 'kubernetes', 'service'],
      'Event-Driven': ['event', 'publisher', 'subscriber', 'eventbus'],
      'Serverless': ['function', 'lambda', 'azure functions'],
      'Layered': ['service', 'repository', 'data', 'business']
    };

    for (const [pattern, keywords] of Object.entries(patterns)) {
      let score = 0;
      for (const keyword of keywords) {
        if (await this.searchInFiles(keyword)) {
          score++;
        }
      }
      if (score >= 2) {
        return pattern;
      }
    }

    return 'Layered'; // Default fallback
  }

  /**
   * Detect technologies used
   */
  async detectTechnologies() {
    const technologies = [];
    
    // Check package.json for Node.js dependencies
    const packageJsonPath = path.join(this.projectPath, 'package.json');
    if (await fs.pathExists(packageJsonPath)) {
      const packageJson = await fs.readJson(packageJsonPath);
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      Object.keys(deps).forEach(dep => {
        if (dep.includes('react')) technologies.push('React');
        if (dep.includes('angular')) technologies.push('Angular');
        if (dep.includes('express')) technologies.push('Express');
        if (dep.includes('mongoose')) technologies.push('MongoDB');
        if (dep.includes('sequelize')) technologies.push('SQL');
      });
    }

    // Check for .NET project files
    const csprojFiles = glob.sync('**/*.csproj', { cwd: this.projectPath });
    if (csprojFiles.length > 0) {
      technologies.push('.NET');
    }

    // Check for Java/Maven
    const pomPath = path.join(this.projectPath, 'pom.xml');
    if (await fs.pathExists(pomPath)) {
      technologies.push('Java', 'Maven');
    }

    return technologies;
  }

  /**
   * Analyze project structure
   */
  async analyzeProjectStructure() {
    const structure = {
      directories: [],
      keyFiles: [],
      totalFiles: 0
    };

    try {
      const files = glob.sync('**/*', { 
        cwd: this.projectPath,
        ignore: ['node_modules/**', '.git/**', 'dist/**', 'build/**']
      });

      structure.totalFiles = files.length;
      
      files.forEach(file => {
        const fullPath = path.join(this.projectPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
          structure.directories.push(file);
        } else if (this.isKeyFile(file)) {
          structure.keyFiles.push(file);
        }
      });
    } catch (error) {
      console.warn('Error analyzing project structure:', error.message);
    }

    return structure;
  }

  /**
   * Check if a file contains specific content
   */
  async checkFileContent(pattern) {
    try {
      if (pattern.startsWith('@')) {
        // Search for annotation/decorator
        return await this.searchInFiles(pattern.substring(1));
      } else if (pattern.includes('/')) {
        // Check for specific path
        return fs.pathExists(path.join(this.projectPath, pattern));
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Search for pattern in files
   */
  async searchInFiles(pattern) {
    try {
      const files = glob.sync('**/*.{js,ts,cs,java,py,jsx,tsx}', { 
        cwd: this.projectPath,
        ignore: ['node_modules/**', 'dist/**', 'build/**']
      });

      for (const file of files.slice(0, 50)) { // Limit search to avoid performance issues
        const filePath = path.join(this.projectPath, file);
        const content = await fs.readFile(filePath, 'utf-8');
        if (content.toLowerCase().includes(pattern.toLowerCase())) {
          return true;
        }
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if file is a key project file
   */
  isKeyFile(filename) {
    const keyFiles = [
      'package.json', 'pom.xml', 'build.gradle', '*.csproj', '*.sln',
      'Dockerfile', 'docker-compose.yml', 
      'README.md', 'requirements.txt', 'setup.py',
      'tsconfig.json', 'angular.json', 'next.config.js'
    ];

    return keyFiles.some(pattern => {
      if (pattern.includes('*')) {
        const regex = new RegExp(pattern.replace('*', '.*'));
        return regex.test(filename);
      }
      return filename.endsWith(pattern);
    });
  }

  /**
   * Get analysis results
   */
  getResults() {
    return this.analysisResults;
  }
}

module.exports = CodeAnalyzer;