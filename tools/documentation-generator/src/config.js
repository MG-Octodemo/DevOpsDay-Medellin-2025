/**
 * Configuration system for workflow documentation generator
 * Handles template variables and generation parameters
 */

class ConfigurationManager {
  constructor() {
    this.defaultConfig = {
      PROJECT_TYPE: "Auto-detect",
      ENTRY_POINT: "Auto-detect", 
      PERSISTENCE_TYPE: "Auto-detect",
      ARCHITECTURE_PATTERN: "Auto-detect",
      WORKFLOW_COUNT: 3,
      DETAIL_LEVEL: "Standard",
      INCLUDE_SEQUENCE_DIAGRAM: true,
      INCLUDE_TEST_PATTERNS: true
    };

    this.validValues = {
      PROJECT_TYPE: ["Auto-detect", ".NET", "Java", "Spring", "Node.js", "Python", "React", "Angular", "Microservices", "Other"],
      ENTRY_POINT: ["Auto-detect", "API", "GraphQL", "Frontend", "CLI", "Message Consumer", "Scheduled Job", "Custom"],
      PERSISTENCE_TYPE: ["Auto-detect", "SQL Database", "NoSQL Database", "File System", "External API", "Message Queue", "Cache", "None"],
      ARCHITECTURE_PATTERN: ["Auto-detect", "Layered", "Clean", "CQRS", "Microservices", "MVC", "MVVM", "Serverless", "Event-Driven", "Other"],
      WORKFLOW_COUNT: [1, 2, 3, 4, 5],
      DETAIL_LEVEL: ["Standard", "Implementation-Ready"],
      INCLUDE_SEQUENCE_DIAGRAM: [true, false],
      INCLUDE_TEST_PATTERNS: [true, false]
    };
  }

  /**
   * Get default configuration
   */
  getDefaultConfig() {
    return { ...this.defaultConfig };
  }

  /**
   * Validate configuration values
   */
  validateConfig(config) {
    const errors = [];
    
    for (const [key, value] of Object.entries(config)) {
      if (this.validValues[key] && !this.validValues[key].includes(value)) {
        errors.push(`Invalid value for ${key}: ${value}. Valid values: ${this.validValues[key].join(', ')}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Merge configuration with defaults
   */
  mergeWithDefaults(userConfig) {
    return {
      ...this.defaultConfig,
      ...userConfig
    };
  }

  /**
   * Get available options for a configuration key
   */
  getValidValues(key) {
    return this.validValues[key] || [];
  }

  /**
   * Create configuration from interactive prompt
   */
  async createInteractiveConfig() {
    const inquirer = require('inquirer');
    
    const questions = [
      {
        type: 'list',
        name: 'PROJECT_TYPE',
        message: 'Select the primary technology stack:',
        choices: this.validValues.PROJECT_TYPE,
        default: 'Auto-detect'
      },
      {
        type: 'list',
        name: 'ENTRY_POINT',
        message: 'Select the primary entry point type:',
        choices: this.validValues.ENTRY_POINT,
        default: 'Auto-detect'
      },
      {
        type: 'list',
        name: 'PERSISTENCE_TYPE',
        message: 'Select the persistence mechanism:',
        choices: this.validValues.PERSISTENCE_TYPE,
        default: 'Auto-detect'
      },
      {
        type: 'list',
        name: 'ARCHITECTURE_PATTERN',
        message: 'Select the architecture pattern:',
        choices: this.validValues.ARCHITECTURE_PATTERN,
        default: 'Auto-detect'
      },
      {
        type: 'list',
        name: 'WORKFLOW_COUNT',
        message: 'How many workflows to document:',
        choices: this.validValues.WORKFLOW_COUNT,
        default: 3
      },
      {
        type: 'list',
        name: 'DETAIL_LEVEL',
        message: 'Select detail level:',
        choices: this.validValues.DETAIL_LEVEL,
        default: 'Standard'
      },
      {
        type: 'confirm',
        name: 'INCLUDE_SEQUENCE_DIAGRAM',
        message: 'Include sequence diagram?',
        default: true
      },
      {
        type: 'confirm',
        name: 'INCLUDE_TEST_PATTERNS',
        message: 'Include testing patterns?',
        default: true
      }
    ];

    return await inquirer.prompt(questions);
  }
}

module.exports = ConfigurationManager;