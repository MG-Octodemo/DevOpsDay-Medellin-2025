/**
 * Tests for the workflow documentation generator
 */

const WorkflowDocumentationGenerator = require('../src/index');
const ConfigurationManager = require('../src/config');
const path = require('path');

describe('WorkflowDocumentationGenerator', () => {
  let generator;
  
  beforeEach(() => {
    generator = new WorkflowDocumentationGenerator();
  });

  describe('Configuration Management', () => {
    test('should provide default configuration', () => {
      const configManager = new ConfigurationManager();
      const defaultConfig = configManager.getDefaultConfig();
      
      expect(defaultConfig).toHaveProperty('PROJECT_TYPE', 'Auto-detect');
      expect(defaultConfig).toHaveProperty('WORKFLOW_COUNT', 3);
      expect(defaultConfig).toHaveProperty('INCLUDE_TEST_PATTERNS', true);
    });

    test('should validate configuration correctly', () => {
      const configManager = new ConfigurationManager();
      
      const validConfig = {
        PROJECT_TYPE: 'Node.js',
        WORKFLOW_COUNT: 3
      };
      
      const invalidConfig = {
        PROJECT_TYPE: 'InvalidType',
        WORKFLOW_COUNT: 10
      };
      
      const validResult = configManager.validateConfig(validConfig);
      const invalidResult = configManager.validateConfig(invalidConfig);
      
      expect(validResult.isValid).toBe(true);
      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.errors.length).toBeGreaterThan(0);
    });

    test('should merge configuration with defaults', () => {
      const configManager = new ConfigurationManager();
      const userConfig = { PROJECT_TYPE: 'React' };
      
      const merged = configManager.mergeWithDefaults(userConfig);
      
      expect(merged.PROJECT_TYPE).toBe('React');
      expect(merged.WORKFLOW_COUNT).toBe(3); // Default value
    });
  });

  describe('Prompt Generation', () => {
    test('should generate basic prompt without analysis', async () => {
      const testProjectPath = path.join(__dirname, '..');
      
      const result = await generator.generateWithAutoDetection(testProjectPath);
      
      expect(result.success).toBe(true);
      expect(result.prompt).toContain('Project Workflow Documentation Generator');
      expect(result.prompt).toContain('Workflow Documentation Instructions');
      expect(result.config).toBeDefined();
      expect(result.analysisResults).toBeDefined();
    });

    test('should include technology-specific patterns', async () => {
      const testProjectPath = path.join(__dirname, '..');
      const customConfig = {
        PROJECT_TYPE: 'Node.js',
        INCLUDE_TEST_PATTERNS: true
      };
      
      const result = await generator.generateDocumentation(testProjectPath, customConfig);
      
      expect(result.success).toBe(true);
      expect(result.prompt).toContain('Node.js Implementation Patterns');
      expect(result.prompt).toContain('Testing Approach');
    });

    test('should handle different workflow counts', async () => {
      const testProjectPath = path.join(__dirname, '..');
      const customConfig = {
        WORKFLOW_COUNT: 5
      };
      
      const result = await generator.generateDocumentation(testProjectPath, customConfig);
      
      expect(result.success).toBe(true);
      expect(result.prompt).toContain('document 5 representative end-to-end workflows');
    });
  });

  describe('Analysis Features', () => {
    test('should analyze project structure', async () => {
      const testProjectPath = path.join(__dirname, '..');
      
      const analysisResults = await generator.analyzeProject(testProjectPath);
      
      expect(analysisResults).toHaveProperty('projectType');
      expect(analysisResults).toHaveProperty('entryPoints');
      expect(analysisResults).toHaveProperty('persistenceType');
      expect(analysisResults).toHaveProperty('architecturePattern');
      expect(analysisResults).toHaveProperty('technologies');
      expect(analysisResults).toHaveProperty('structure');
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid project path', async () => {
      const invalidPath = '/nonexistent/path';
      
      const result = await generator.generateWithAutoDetection(invalidPath);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    test('should handle invalid configuration', async () => {
      const testProjectPath = path.join(__dirname, '..');
      const invalidConfig = {
        PROJECT_TYPE: 'InvalidType'
      };
      
      const result = await generator.generateDocumentation(testProjectPath, invalidConfig);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Configuration validation failed');
    });
  });

  describe('Configuration Options', () => {
    test('should provide valid configuration options', () => {
      const options = generator.getConfigurationOptions();
      
      expect(options).toHaveProperty('PROJECT_TYPE');
      expect(options.PROJECT_TYPE).toContain('Auto-detect');
      expect(options.PROJECT_TYPE).toContain('Node.js');
      expect(options.PROJECT_TYPE).toContain('React');
      
      expect(options).toHaveProperty('ENTRY_POINT');
      expect(options.ENTRY_POINT).toContain('API');
      expect(options.ENTRY_POINT).toContain('Frontend');
    });
  });
});