# Workflow Documentation Generator

A comprehensive, technology-agnostic prompt generator for documenting end-to-end application workflows. This tool automatically detects project architecture patterns, technology stacks, and data flow patterns to generate detailed implementation blueprints.

## Features

🔍 **Auto-Detection**: Automatically identifies technology stacks, entry points, persistence mechanisms, and architecture patterns

📋 **Comprehensive Prompts**: Generates detailed prompts covering:
- Entry points and API implementations
- Service layer architecture
- Data access patterns
- Error handling strategies
- Testing approaches
- Technology-specific patterns

🛠️ **Technology Support**: Built-in support for:
- .NET (Controllers, Entity Framework, ASP.NET Core)
- Java/Spring (Controllers, JPA, Spring Boot)
- React (Components, Hooks, State Management)
- Node.js (Express, Middleware, Async Patterns)
- And more...

⚙️ **Configurable**: Fully customizable through configuration files or interactive mode

## Installation

```bash
cd tools/documentation-generator
npm install
```

## Usage

### Command Line Interface

#### Basic Analysis
```bash
# Analyze current directory and output to console
node src/cli.js analyze

# Analyze specific project and save to file
node src/cli.js analyze --path /path/to/project --output documentation-prompt.md

# Use interactive mode
node src/cli.js interactive
```

#### Advanced Options
```bash
# Override detection with specific values
node src/cli.js analyze \\
  --project-type "Node.js" \\
  --entry-point "API" \\
  --persistence "SQL Database" \\
  --architecture "Layered" \\
  --workflows 5 \\
  --detail-level "Implementation-Ready"

# Use configuration file
node src/cli.js analyze --config my-config.json

# Generate configuration template
node src/cli.js config --output my-config.json --format json
```

### Programmatic Usage

```javascript
const WorkflowDocumentationGenerator = require('./src/index');

const generator = new WorkflowDocumentationGenerator();

// Auto-detect everything
const result = await generator.generateWithAutoDetection('/path/to/project');

// Use custom configuration
const customConfig = {
  PROJECT_TYPE: 'React',
  WORKFLOW_COUNT: 5,
  INCLUDE_TEST_PATTERNS: true
};

const result = await generator.generateDocumentation('/path/to/project', customConfig);

if (result.success) {
  console.log(result.prompt);
  console.log('Analysis Results:', result.analysisResults);
} else {
  console.error('Error:', result.error);
}
```

## Configuration

### Configuration Variables

| Variable | Options | Description |
|----------|---------|-------------|
| `PROJECT_TYPE` | Auto-detect, .NET, Java, Spring, Node.js, Python, React, Angular, Microservices, Other | Primary technology stack |
| `ENTRY_POINT` | Auto-detect, API, GraphQL, Frontend, CLI, Message Consumer, Scheduled Job, Custom | Starting point for the flow |
| `PERSISTENCE_TYPE` | Auto-detect, SQL Database, NoSQL Database, File System, External API, Message Queue, Cache, None | Data storage type |
| `ARCHITECTURE_PATTERN` | Auto-detect, Layered, Clean, CQRS, Microservices, MVC, MVVM, Serverless, Event-Driven, Other | Primary architecture pattern |
| `WORKFLOW_COUNT` | 1-5 | Number of workflows to document |
| `DETAIL_LEVEL` | Standard, Implementation-Ready | Level of implementation detail |
| `INCLUDE_SEQUENCE_DIAGRAM` | true, false | Generate sequence diagram |
| `INCLUDE_TEST_PATTERNS` | true, false | Include testing approach |

### Configuration File Example

```json
{
  "PROJECT_TYPE": "Node.js",
  "ENTRY_POINT": "API",
  "PERSISTENCE_TYPE": "SQL Database",
  "ARCHITECTURE_PATTERN": "Layered",
  "WORKFLOW_COUNT": 3,
  "DETAIL_LEVEL": "Implementation-Ready",
  "INCLUDE_SEQUENCE_DIAGRAM": true,
  "INCLUDE_TEST_PATTERNS": true
}
```

## Generated Prompt Structure

The generator creates comprehensive prompts that include:

### 1. **Initial Detection Phase**
- Technology stack identification
- Entry point analysis
- Persistence mechanism detection

### 2. **Workflow Documentation Instructions**
- Workflow overview and business purpose
- Entry point implementation details
- Service layer architecture
- Data mapping patterns
- Data access implementation
- Response construction
- Error handling patterns
- Asynchronous processing

### 3. **Technology-Specific Patterns**
- **_.NET_**: Controllers, Entity Framework, Middleware
- **_Spring_**: Annotations, JPA, Exception Handling
- **_React_**: Components, Hooks, State Management
- **_Node.js_**: Express, Async/Await, Middleware

### 4. **Implementation Guidelines**
- Step-by-step implementation process
- Common pitfalls to avoid
- Extension mechanisms
- Code quality standards

## Auto-Detection Capabilities

The tool automatically detects:

### **Project Types**
- Looks for project files (package.json, *.csproj, pom.xml)
- Analyzes dependencies and imports
- Identifies framework-specific patterns

### **Entry Points**
- API controllers and route definitions
- GraphQL resolvers
- Frontend application entry points
- CLI interfaces
- Message consumers

### **Persistence Mechanisms**
- Database connection configurations
- ORM implementations
- External API clients
- File system operations
- Message queue interactions

### **Architecture Patterns**
- Folder structure analysis
- Design pattern identification
- Dependency injection patterns
- Layer separation analysis

## Examples

### Example: Node.js + React Application

For the DevOpsDay Medellin 2025 project, the generator detects:

```
Project Type: Node.js + React
Entry Points: API, Frontend
Persistence: In-memory storage (Map-based)
Architecture: Layered/MVC
Technologies: Express, React, JWT
```

And generates a comprehensive prompt covering:
- Express.js route handlers and middleware
- React component patterns and hooks
- Authentication middleware implementation
- Error handling strategies
- State management patterns

### Example Output Structure

```markdown
## Detected Project Information
**Project Type**: Node.js
**Entry Points**: API, Frontend
**Persistence Type**: SQL Database
**Architecture Pattern**: Layered

# Project Workflow Documentation Generator

Analyze the codebase and document 3 representative end-to-end workflows...

## Initial Detection Phase
### Technology Stack Detection
Begin by examining the codebase structure...

## Workflow Documentation Instructions
### 1. Workflow Overview
- Provide a name and brief description...

### 2. Entry Point Implementation
**API Entry Points:**
- Document the API controller class...

### Node.js Implementation Patterns
- Express.js route handlers and middleware
- Async/await error handling patterns
- Database connection and query patterns
...
```

## Integration with AI Assistants

This tool is designed to work seamlessly with:

- **GitHub Copilot Chat**: Use the generated prompts directly in chat
- **ChatGPT/Claude**: Copy and paste the generated prompts
- **Custom AI Agents**: Integrate programmatically via the API

### GitHub Copilot Integration

1. Generate a prompt for your codebase:
   ```bash
   node src/cli.js analyze --output copilot-prompt.md
   ```

2. Use in Copilot Chat:
   ```
   @copilot /help using the following prompt: [paste generated prompt]
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create an issue in the repository
- Check the documentation for common use cases
- Review the example configurations

---

**Pro Tip**: Use the interactive mode (`node src/cli.js interactive`) for your first time to understand all available options!