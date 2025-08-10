/**
 * Prompt generator that creates comprehensive documentation prompts
 * based on configuration and code analysis
 */

class PromptGenerator {
  constructor(config, analysisResults) {
    this.config = config;
    this.analysisResults = analysisResults || {};
  }

  /**
   * Generate the main documentation prompt
   */
  generatePrompt() {
    const sections = [
      this.generateHeader(),
      this.generateDetectionPhase(),
      this.generateWorkflowInstructions(),
      this.generateTechnologySpecificPatterns(),
      this.generateImplementationGuidelines(),
      this.generateConclusion()
    ];

    return sections.join('\n\n');
  }

  /**
   * Generate prompt header
   */
  generateHeader() {
    return `# Project Workflow Documentation Generator

Analyze the codebase and document ${this.config.WORKFLOW_COUNT} representative end-to-end workflows that can serve as implementation templates for similar features. Use the following approach:`;
  }

  /**
   * Generate initial detection phase instructions
   */
  generateDetectionPhase() {
    let detection = '## Initial Detection Phase\n\n';

    // Project type detection
    if (this.config.PROJECT_TYPE === "Auto-detect") {
      detection += `### Technology Stack Detection
Begin by examining the codebase structure to identify technologies:
- Check for .NET solutions/projects, Spring configurations, Node.js/Express files, etc.
- Identify the primary programming language(s) and frameworks in use
- Determine the architectural patterns based on folder structure and key components
`;
    } else {
      detection += `### Technology Stack Analysis
Focus on ${this.config.PROJECT_TYPE} patterns and conventions specific to this technology stack.
`;
    }

    // Entry point detection
    if (this.config.ENTRY_POINT === "Auto-detect") {
      detection += `
### Entry Point Identification
Identify typical entry points by looking for:
- API controllers or route definitions
- GraphQL resolvers
- UI components that initiate network requests
- Message handlers or event subscribers
- Scheduled job definitions
`;
    } else {
      detection += `
### Entry Point Analysis
Focus on ${this.config.ENTRY_POINT} entry points and their specific implementation patterns.
`;
    }

    // Persistence detection
    if (this.config.PERSISTENCE_TYPE === "Auto-detect") {
      detection += `
### Persistence Mechanism Detection
Determine persistence mechanisms by examining:
- Database context/connection configurations
- Repository implementations
- ORM mappings
- External API clients
- File system interactions
`;
    } else {
      detection += `
### Persistence Analysis
Focus on ${this.config.PERSISTENCE_TYPE} interactions and their implementation patterns.
`;
    }

    return detection;
  }

  /**
   * Generate workflow documentation instructions
   */
  generateWorkflowInstructions() {
    return `## Workflow Documentation Instructions

For each of the ${this.config.WORKFLOW_COUNT} most representative workflow(s) in the system:

### 1. Workflow Overview
- Provide a name and brief description of the workflow
- Explain the business purpose it serves
- Identify the triggering action or event
- List all files/classes involved in the complete workflow

### 2. Entry Point Implementation

${this.generateEntryPointInstructions()}

### 3. Service Layer Implementation
- Document each service class involved with their dependencies
- Show the complete method signatures with parameters and return types
- Include actual method implementations with key business logic
- Document interface definitions where applicable
- Show dependency injection registration patterns

${this.generateArchitectureSpecificInstructions()}

### 4. Data Mapping Patterns
- Document DTO to domain model mapping code
- Show object mapper configurations or manual mapping methods
- Include validation logic during mapping
- Document any domain events created during mapping

### 5. Data Access Implementation
- Document repository interfaces and their implementations
- Show complete method signatures with parameters and return types
- Include actual query implementations
- Document entity/model class definitions with all properties
- Show transaction handling patterns

${this.generatePersistenceInstructions()}

### 6. Response Construction
- Document response DTO/model class definitions
- Show mapping from domain/entity models to response models
- Include status code selection logic
- Document error response structure and generation

### 7. Error Handling Patterns
- Document exception types used in the workflow
- Show try/catch patterns at each layer
- Include global exception handler configurations
- Document error logging implementations
- Show retry policies or circuit breaker patterns
- Include compensating actions for failure scenarios

### 8. Asynchronous Processing Patterns
- Document background job scheduling code
- Show event publication implementations
- Include message queue sending patterns
- Document callback or webhook implementations
- Show how async operations are tracked and monitored

${this.generateTestingSection()}

${this.generateSequenceDiagramSection()}

### ${this.getNextSectionNumber()}. Naming Conventions
Document consistent patterns for:
- Controller naming (e.g., \`EntityNameController\`)
- Service naming (e.g., \`EntityNameService\`)
- Repository naming (e.g., \`IEntityNameRepository\`)
- DTO naming (e.g., \`EntityNameRequest\`, \`EntityNameResponse\`)
- Method naming patterns for CRUD operations
- Variable naming conventions
- File organization patterns

### ${this.getNextSectionNumber()}. Implementation Templates
Provide reusable code templates for:
- Creating a new API endpoint following the pattern
- Implementing a new service method
- Adding a new repository method
- Creating new domain model classes
- Implementing proper error handling`;
  }

  /**
   * Generate entry point specific instructions
   */
  generateEntryPointInstructions() {
    let instructions = '';

    if (this.config.ENTRY_POINT === "API" || this.config.ENTRY_POINT === "Auto-detect") {
      instructions += `**API Entry Points:**
- Document the API controller class and method that receives the request
- Show the complete method signature including attributes/annotations
- Include the full request DTO/model class definition
- Document validation attributes and custom validators
- Show authentication/authorization attributes and checks

`;
    }

    if (this.config.ENTRY_POINT === "GraphQL" || this.config.ENTRY_POINT === "Auto-detect") {
      instructions += `**GraphQL Entry Points:**
- Document the GraphQL resolver class and method
- Show the complete schema definition for the query/mutation
- Include input type definitions
- Show resolver method implementation with parameter handling

`;
    }

    if (this.config.ENTRY_POINT === "Frontend" || this.config.ENTRY_POINT === "Auto-detect") {
      instructions += `**Frontend Entry Points:**
- Document the component that initiates the API call
- Show the event handler that triggers the request
- Include the API client service method
- Show state management code related to the request

`;
    }

    if (this.config.ENTRY_POINT === "Message Consumer" || this.config.ENTRY_POINT === "Auto-detect") {
      instructions += `**Message Consumer Entry Points:**
- Document the message handler class and method
- Show message subscription configuration
- Include the complete message model definition
- Show deserialization and validation logic

`;
    }

    return instructions;
  }

  /**
   * Generate architecture-specific instructions
   */
  generateArchitectureSpecificInstructions() {
    let instructions = '';

    if (this.config.ARCHITECTURE_PATTERN === "CQRS" || this.config.ARCHITECTURE_PATTERN === "Auto-detect") {
      instructions += `**CQRS Patterns:**
- Include complete command/query handler implementations
- Document command/query models and their validation
- Show how commands and queries are dispatched

`;
    }

    if (this.config.ARCHITECTURE_PATTERN === "Clean" || this.config.ARCHITECTURE_PATTERN === "Auto-detect") {
      instructions += `**Clean Architecture Patterns:**
- Show use case/interactor implementations
- Document domain entities and value objects
- Show dependency inversion implementations

`;
    }

    return instructions;
  }

  /**
   * Generate persistence-specific instructions
   */
  generatePersistenceInstructions() {
    let instructions = '';

    if (this.config.PERSISTENCE_TYPE === "SQL Database" || this.config.PERSISTENCE_TYPE === "Auto-detect") {
      instructions += `**SQL Database Patterns:**
- Include ORM configurations, annotations, or Fluent API usage
- Show actual SQL queries or ORM statements
- Document database schema and relationships
- Show migration scripts or database setup

`;
    }

    if (this.config.PERSISTENCE_TYPE === "NoSQL Database" || this.config.PERSISTENCE_TYPE === "Auto-detect") {
      instructions += `**NoSQL Database Patterns:**
- Show document structure definitions
- Include document query/update operations
- Document indexing strategies
- Show data modeling approaches

`;
    }

    if (this.config.PERSISTENCE_TYPE === "External API" || this.config.PERSISTENCE_TYPE === "Auto-detect") {
      instructions += `**External API Patterns:**
- Document HTTP client configurations
- Show request/response models
- Include authentication and retry logic
- Document rate limiting and circuit breaker patterns

`;
    }

    return instructions;
  }

  /**
   * Generate testing section if enabled
   */
  generateTestingSection() {
    if (!this.config.INCLUDE_TEST_PATTERNS) {
      return '';
    }

    const sectionNumber = this.getNextSectionNumber();
    return `
### ${sectionNumber}. Testing Approach
- Document unit test implementations for each layer
- Show mocking patterns and test fixture setup
- Include integration test implementations
- Document test data generation approaches
- Show API/controller test implementations
- Include end-to-end test scenarios
- Document test organization and naming conventions`;
  }

  /**
   * Generate sequence diagram section if enabled
   */
  generateSequenceDiagramSection() {
    if (!this.config.INCLUDE_SEQUENCE_DIAGRAM) {
      return '';
    }

    const sectionNumber = this.getNextSectionNumber();
    return `
### ${sectionNumber}. Sequence Diagram
- Generate a detailed sequence diagram showing all components
- Include method calls with parameter types
- Show return values between components
- Document conditional flows and error paths
- Use standard UML sequence diagram notation`;
  }

  /**
   * Generate technology-specific patterns
   */
  generateTechnologySpecificPatterns() {
    return `## Technology-Specific Implementation Patterns

${this.generateDotNetPatterns()}

${this.generateSpringPatterns()}

${this.generateReactPatterns()}

${this.generateNodeJsPatterns()}`;
  }

  /**
   * Generate .NET specific patterns
   */
  generateDotNetPatterns() {
    if (this.config.PROJECT_TYPE !== ".NET" && this.config.PROJECT_TYPE !== "Auto-detect") {
      return '';
    }

    return `### .NET Implementation Patterns
- Complete controller class with attributes, filters, and dependency injection
- Service registration in Startup.cs or Program.cs
- Entity Framework DbContext configuration
- Repository implementation with EF Core or Dapper
- AutoMapper profile configurations
- Middleware implementations for cross-cutting concerns
- Extension method patterns
- Options pattern implementation for configuration
- Logging implementation with ILogger
- Authentication/authorization filter or policy implementations
- Minimal API patterns (if using .NET 6+)
- Global exception handling middleware`;
  }

  /**
   * Generate Spring specific patterns
   */
  generateSpringPatterns() {
    if (!["Java", "Spring", "Auto-detect"].includes(this.config.PROJECT_TYPE)) {
      return '';
    }

    return `### Spring Implementation Patterns
- Complete controller class with annotations and dependency injection
- Service implementation with transaction boundaries (@Transactional)
- Repository interface and implementation
- JPA entity definitions with relationships
- DTO class implementations with validation annotations
- Bean configuration and component scanning
- Exception handler implementations (@ControllerAdvice)
- Custom validator implementations
- Security configuration for authentication/authorization
- AOP implementations for cross-cutting concerns
- Configuration properties classes (@ConfigurationProperties)`;
  }

  /**
   * Generate React specific patterns
   */
  generateReactPatterns() {
    if (this.config.PROJECT_TYPE !== "React" && this.config.PROJECT_TYPE !== "Auto-detect") {
      return '';
    }

    return `### React Implementation Patterns
- Component structure with props and state management
- Hook implementation patterns (useState, useEffect, custom hooks)
- API service implementation with error handling
- State management patterns (Context API, Redux, Zustand)
- Form handling implementations with validation
- Route configuration and protected routes
- Component composition and reusability patterns
- Performance optimization techniques (useMemo, useCallback)
- Error boundary implementations
- Testing patterns with React Testing Library`;
  }

  /**
   * Generate Node.js specific patterns
   */
  generateNodeJsPatterns() {
    if (this.config.PROJECT_TYPE !== "Node.js" && this.config.PROJECT_TYPE !== "Auto-detect") {
      return '';
    }

    return `### Node.js Implementation Patterns
- Express.js route handlers and middleware
- Async/await error handling patterns
- Database connection and query patterns
- Authentication middleware implementation
- Input validation and sanitization
- Environment configuration management
- Logging implementation with Winston or similar
- Error handling middleware and custom error classes
- Background job processing with queues
- API documentation with Swagger/OpenAPI
- Security middleware (helmet, cors, rate limiting)`;
  }

  /**
   * Generate implementation guidelines
   */
  generateImplementationGuidelines() {
    return `## Implementation Guidelines

Based on the documented workflows, provide specific guidance for implementing new features:

### 1. Step-by-Step Implementation Process
- Where to start when adding a similar feature
- Order of implementation (e.g., model → repository → service → controller)
- How to integrate with existing cross-cutting concerns
- Dependencies and prerequisites for new features

### 2. Common Pitfalls to Avoid
- Identify error-prone areas in the current implementation
- Note performance considerations and bottlenecks
- List common bugs or issues encountered
- Security considerations and best practices

### 3. Extension Mechanisms
- Document how to plug into existing extension points
- Show how to add new behavior without modifying existing code
- Explain configuration-driven feature patterns
- Document versioning and backward compatibility approaches

### 4. Code Quality Standards
- Formatting and style guide adherence
- Code review checklist items
- Performance benchmarks and requirements
- Security scanning and vulnerability assessment
- Documentation requirements for new code`;
  }

  /**
   * Generate conclusion
   */
  generateConclusion() {
    return `## Conclusion

Conclude with a summary of the most important patterns that should be followed when implementing new features to maintain consistency with the codebase. Include:

- The core architectural principles that guide the implementation
- Key patterns that ensure maintainability and scalability
- Essential practices for code quality and security
- Guidelines for team collaboration and knowledge sharing

This documentation should serve as a comprehensive blueprint for implementing similar features while maintaining the established patterns and quality standards of the codebase.`;
  }

  /**
   * Helper to get next section number
   */
  getNextSectionNumber() {
    let baseNumber = 9;
    if (this.config.INCLUDE_TEST_PATTERNS) baseNumber++;
    if (this.config.INCLUDE_SEQUENCE_DIAGRAM) baseNumber++;
    return baseNumber;
  }

  /**
   * Generate a configuration-aware prompt with analysis results
   */
  generateAnalysisAwarePrompt() {
    if (!this.analysisResults || Object.keys(this.analysisResults).length === 0) {
      return this.generatePrompt();
    }

    const detectedInfo = this.formatAnalysisResults();
    return `${detectedInfo}\n\n${this.generatePrompt()}`;
  }

  /**
   * Format analysis results for inclusion in prompt
   */
  formatAnalysisResults() {
    return `## Detected Project Information

Based on automated analysis of the codebase:

**Project Type**: ${this.analysisResults.projectType || 'Unknown'}
**Entry Points**: ${Array.isArray(this.analysisResults.entryPoints) ? this.analysisResults.entryPoints.join(', ') : 'Unknown'}
**Persistence Type**: ${this.analysisResults.persistenceType || 'Unknown'}
**Architecture Pattern**: ${this.analysisResults.architecturePattern || 'Unknown'}
**Technologies**: ${Array.isArray(this.analysisResults.technologies) ? this.analysisResults.technologies.join(', ') : 'Unknown'}

Use this information to focus the documentation on the most relevant patterns and implementation details.`;
  }
}

module.exports = PromptGenerator;