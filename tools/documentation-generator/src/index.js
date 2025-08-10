/**
 * Main entry point for the workflow documentation generator
 */

const ConfigurationManager = require('./config');
const CodeAnalyzer = require('./analyzer');
const PromptGenerator = require('./promptGenerator');

class WorkflowDocumentationGenerator {
  constructor() {
    this.configManager = new ConfigurationManager();
  }

  /**
   * Generate documentation prompt for a project
   */
  async generateDocumentation(projectPath, userConfig = {}) {
    try {
      // Merge configuration
      const config = this.configManager.mergeWithDefaults(userConfig);
      
      // Validate configuration
      const validation = this.configManager.validateConfig(config);
      if (!validation.isValid) {
        throw new Error(`Configuration validation failed: ${validation.errors.join(', ')}`);
      }

      // Analyze codebase
      const analyzer = new CodeAnalyzer(projectPath);
      const analysisResults = await analyzer.analyze();

      // Generate prompt
      const promptGenerator = new PromptGenerator(config, analysisResults);
      const prompt = promptGenerator.generateAnalysisAwarePrompt();

      return {
        success: true,
        prompt,
        config,
        analysisResults
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        stack: error.stack
      };
    }
  }

  /**
   * Generate prompt with auto-detected configuration
   */
  async generateWithAutoDetection(projectPath) {
    const defaultConfig = this.configManager.getDefaultConfig();
    return await this.generateDocumentation(projectPath, defaultConfig);
  }

  /**
   * Generate prompt with interactive configuration
   */
  async generateInteractive(projectPath) {
    const config = await this.configManager.createInteractiveConfig();
    return await this.generateDocumentation(projectPath, config);
  }

  /**
   * Get available configuration options
   */
  getConfigurationOptions() {
    return {
      PROJECT_TYPE: this.configManager.getValidValues('PROJECT_TYPE'),
      ENTRY_POINT: this.configManager.getValidValues('ENTRY_POINT'),
      PERSISTENCE_TYPE: this.configManager.getValidValues('PERSISTENCE_TYPE'),
      ARCHITECTURE_PATTERN: this.configManager.getValidValues('ARCHITECTURE_PATTERN'),
      WORKFLOW_COUNT: this.configManager.getValidValues('WORKFLOW_COUNT'),
      DETAIL_LEVEL: this.configManager.getValidValues('DETAIL_LEVEL'),
      INCLUDE_SEQUENCE_DIAGRAM: this.configManager.getValidValues('INCLUDE_SEQUENCE_DIAGRAM'),
      INCLUDE_TEST_PATTERNS: this.configManager.getValidValues('INCLUDE_TEST_PATTERNS')
    };
  }

  /**
   * Analyze project without generating documentation
   */
  async analyzeProject(projectPath) {
    try {
      const analyzer = new CodeAnalyzer(projectPath);
      return await analyzer.analyze();
    } catch (error) {
      throw new Error(`Project analysis failed: ${error.message}`);
    }
  }

  /**
   * Generate prompt from existing analysis
   */
  generatePromptFromAnalysis(analysisResults, userConfig = {}) {
    const config = this.configManager.mergeWithDefaults(userConfig);
    const validation = this.configManager.validateConfig(config);
    
    if (!validation.isValid) {
      throw new Error(`Configuration validation failed: ${validation.errors.join(', ')}`);
    }

    const promptGenerator = new PromptGenerator(config, analysisResults);
    return promptGenerator.generateAnalysisAwarePrompt();
  }
}

module.exports = WorkflowDocumentationGenerator;