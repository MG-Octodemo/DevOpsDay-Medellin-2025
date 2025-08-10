#!/usr/bin/env node
/**
 * CLI interface for the workflow documentation generator
 */

const { Command } = require('commander');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');

const ConfigurationManager = require('./config');
const CodeAnalyzer = require('./analyzer');
const PromptGenerator = require('./promptGenerator');

const program = new Command();

program
  .name('doc-gen')
  .description('Generate comprehensive workflow documentation prompts for codebases')
  .version('1.0.0');

program
  .command('analyze')
  .description('Analyze codebase and generate documentation prompt')
  .option('-p, --path <path>', 'Path to the project to analyze', process.cwd())
  .option('-o, --output <file>', 'Output file for the generated prompt')
  .option('-c, --config <file>', 'Configuration file (JSON or YAML)')
  .option('-i, --interactive', 'Interactive configuration mode')
  .option('--project-type <type>', 'Override project type detection')
  .option('--entry-point <type>', 'Override entry point detection')
  .option('--persistence <type>', 'Override persistence type detection')
  .option('--architecture <pattern>', 'Override architecture pattern detection')
  .option('--workflows <count>', 'Number of workflows to document', '3')
  .option('--detail-level <level>', 'Detail level (Standard|Implementation-Ready)', 'Standard')
  .option('--no-sequence-diagram', 'Exclude sequence diagram generation')
  .option('--no-test-patterns', 'Exclude testing pattern documentation')
  .action(async (options) => {
    try {
      console.log(chalk.blue('\n🔍 Starting codebase analysis...\n'));

      // Load configuration
      const configManager = new ConfigurationManager();
      let config = configManager.getDefaultConfig();

      if (options.config) {
        const configFile = await loadConfigFile(options.config);
        config = configManager.mergeWithDefaults(configFile);
      }

      if (options.interactive) {
        console.log(chalk.yellow('📝 Interactive configuration mode...\n'));
        config = await configManager.createInteractiveConfig();
      }

      // Override with command line options
      if (options.projectType) config.PROJECT_TYPE = options.projectType;
      if (options.entryPoint) config.ENTRY_POINT = options.entryPoint;
      if (options.persistence) config.PERSISTENCE_TYPE = options.persistence;
      if (options.architecture) config.ARCHITECTURE_PATTERN = options.architecture;
      if (options.workflows) config.WORKFLOW_COUNT = parseInt(options.workflows);
      if (options.detailLevel) config.DETAIL_LEVEL = options.detailLevel;
      if (options.sequenceDiagram === false) config.INCLUDE_SEQUENCE_DIAGRAM = false;
      if (options.testPatterns === false) config.INCLUDE_TEST_PATTERNS = false;

      // Validate configuration
      const validation = configManager.validateConfig(config);
      if (!validation.isValid) {
        console.error(chalk.red('❌ Configuration validation failed:'));
        validation.errors.forEach(error => console.error(chalk.red(`  - ${error}`)));
        process.exit(1);
      }

      console.log(chalk.green('✅ Configuration validated'));
      console.log(chalk.gray(`   Project Path: ${options.path}`));
      console.log(chalk.gray(`   Project Type: ${config.PROJECT_TYPE}`));
      console.log(chalk.gray(`   Entry Point: ${config.ENTRY_POINT}`));
      console.log(chalk.gray(`   Workflows: ${config.WORKFLOW_COUNT}`));
      console.log();

      // Analyze codebase
      console.log(chalk.blue('🔬 Analyzing codebase...'));
      const analyzer = new CodeAnalyzer(options.path);
      const analysisResults = await analyzer.analyze();

      console.log(chalk.green('✅ Analysis complete'));
      console.log(chalk.gray(`   Detected Type: ${analysisResults.projectType}`));
      console.log(chalk.gray(`   Entry Points: ${analysisResults.entryPoints.join(', ')}`));
      console.log(chalk.gray(`   Persistence: ${analysisResults.persistenceType}`));
      console.log(chalk.gray(`   Architecture: ${analysisResults.architecturePattern}`));
      console.log();

      // Generate prompt
      console.log(chalk.blue('📄 Generating documentation prompt...'));
      const promptGenerator = new PromptGenerator(config, analysisResults);
      const prompt = promptGenerator.generateAnalysisAwarePrompt();

      // Output
      if (options.output) {
        await fs.writeFile(options.output, prompt, 'utf-8');
        console.log(chalk.green(`✅ Prompt saved to: ${options.output}`));
      } else {
        console.log(chalk.yellow('\n📋 Generated Documentation Prompt:'));
        console.log(chalk.gray('=' .repeat(80)));
        console.log(prompt);
        console.log(chalk.gray('=' .repeat(80)));
      }

      console.log(chalk.green('\n🎉 Documentation prompt generation complete!'));

    } catch (error) {
      console.error(chalk.red('❌ Error:'), error.message);
      if (process.env.DEBUG) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  });

program
  .command('config')
  .description('Generate a configuration file template')
  .option('-o, --output <file>', 'Output configuration file', 'doc-gen.config.json')
  .option('-f, --format <format>', 'Configuration format (json|yaml)', 'json')
  .action(async (options) => {
    try {
      const configManager = new ConfigurationManager();
      const defaultConfig = configManager.getDefaultConfig();

      if (options.format === 'yaml') {
        const yaml = require('yaml');
        const yamlContent = yaml.stringify(defaultConfig);
        await fs.writeFile(options.output, yamlContent, 'utf-8');
      } else {
        await fs.writeFile(options.output, JSON.stringify(defaultConfig, null, 2), 'utf-8');
      }

      console.log(chalk.green(`✅ Configuration template saved to: ${options.output}`));
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error.message);
      process.exit(1);
    }
  });

program
  .command('interactive')
  .description('Interactive mode for generating documentation prompts')
  .option('-p, --path <path>', 'Path to the project to analyze', process.cwd())
  .action(async (options) => {
    try {
      console.log(chalk.blue('\n🚀 Welcome to Interactive Documentation Generator!\n'));

      const configManager = new ConfigurationManager();
      const config = await configManager.createInteractiveConfig();

      console.log(chalk.blue('\n🔬 Analyzing codebase...'));
      const analyzer = new CodeAnalyzer(options.path);
      const analysisResults = await analyzer.analyze();

      console.log(chalk.blue('\n📄 Generating documentation prompt...'));
      const promptGenerator = new PromptGenerator(config, analysisResults);
      const prompt = promptGenerator.generateAnalysisAwarePrompt();

      console.log(chalk.yellow('\n📋 Generated Documentation Prompt:'));
      console.log(chalk.gray('=' .repeat(80)));
      console.log(prompt);
      console.log(chalk.gray('=' .repeat(80)));

      const inquirer = require('inquirer');
      const { saveToFile } = await inquirer.prompt([{
        type: 'confirm',
        name: 'saveToFile',
        message: 'Would you like to save this prompt to a file?',
        default: true
      }]);

      if (saveToFile) {
        const { filename } = await inquirer.prompt([{
          type: 'input',
          name: 'filename',
          message: 'Enter filename:',
          default: 'documentation-prompt.md'
        }]);

        await fs.writeFile(filename, prompt, 'utf-8');
        console.log(chalk.green(`✅ Prompt saved to: ${filename}`));
      }

      console.log(chalk.green('\n🎉 Complete! You can now use this prompt with your preferred AI assistant.'));

    } catch (error) {
      console.error(chalk.red('❌ Error:'), error.message);
      process.exit(1);
    }
  });

/**
 * Load configuration from file
 */
async function loadConfigFile(configPath) {
  try {
    const content = await fs.readFile(configPath, 'utf-8');
    
    if (configPath.endsWith('.yaml') || configPath.endsWith('.yml')) {
      const yaml = require('yaml');
      return yaml.parse(content);
    } else {
      return JSON.parse(content);
    }
  } catch (error) {
    throw new Error(`Failed to load configuration file: ${error.message}`);
  }
}

// Error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error(chalk.red('❌ Unhandled Promise Rejection:'), reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error(chalk.red('❌ Uncaught Exception:'), error.message);
  process.exit(1);
});

program.parse();