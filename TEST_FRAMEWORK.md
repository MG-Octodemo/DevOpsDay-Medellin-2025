# Test Planning and Quality Assurance Framework

## Overview

This repository contains a comprehensive test planning and quality assurance framework based on ISTQB (International Software Testing Qualifications Board) standards and ISO 25010 quality model. The framework provides systematic approaches to test strategy development, task breakdown, and quality validation for GitHub-based project management.

## Framework Components

### 📋 Documentation Structure

```
docs/ways-of-work/
├── test-framework-guide.md              # Complete framework guide
└── plan/
    └── {epic-name}/
        └── {feature-name}/
            ├── feature.md                # Product Requirements Document
            ├── technical-breakdown.md    # Technical implementation details
            ├── implementation-plan.md    # Development roadmap
            ├── project-plan.md          # GitHub project management
            ├── test-strategy.md         # ISTQB-based test strategy
            ├── test-issues-checklist.md # Comprehensive test task breakdown
            └── qa-plan.md              # ISO 25010 quality validation plan
```

### 🎯 GitHub Issue Templates

Located in `.github/ISSUE_TEMPLATE/`:

- **`test-strategy.md`**: Comprehensive testing approach using ISTQB framework
- **`playwright-tests.md`**: End-to-end testing with Playwright automation
- **`quality-assurance.md`**: ISO 25010 quality characteristic validation
- **`unit-tests.md`**: Component-level testing with coverage targets
- **`integration-tests.md`**: API and service integration validation

### 🧪 Test Automation Examples

- **Playwright Configuration**: `playwright.config.js` with multi-browser support
- **Page Object Model**: `tests/e2e/pages/agenda.page.ts` demonstrating ISTQB patterns
- **E2E Test Suites**: `tests/e2e/agenda.spec.ts` with ISO 25010 quality validation

## 🏗️ ISTQB Framework Implementation

### Test Design Techniques
- **Equivalence Partitioning**: Systematic input domain classification
- **Boundary Value Analysis**: Edge case identification and testing
- **Decision Table Testing**: Complex business rule validation
- **State Transition Testing**: System behavior and workflow validation
- **Experience-Based Testing**: Exploratory testing and error guessing

### Test Types Coverage
- **Functional Testing**: Feature behavior and requirement validation
- **Non-Functional Testing**: Performance, usability, security, reliability
- **Structural Testing**: Code coverage and architecture validation
- **Change-Related Testing**: Regression and confirmation testing

## 📊 ISO 25010 Quality Model

### Quality Characteristics Assessment
1. **Functional Suitability**: Completeness, correctness, appropriateness
2. **Performance Efficiency**: Time behavior, resource utilization, capacity
3. **Compatibility**: Co-existence and interoperability testing
4. **Usability**: User interface, accessibility, and user experience
5. **Reliability**: Fault tolerance, recoverability, availability
6. **Security**: Confidentiality, integrity, authentication
7. **Maintainability**: Modularity, reusability, testability
8. **Portability**: Adaptability, installability, replaceability

## 🚀 Getting Started

### 1. Framework Setup

```bash
# Clone the repository
git clone https://github.com/MG-Octodemo/DevOpsDay-Medellin-2025.git
cd DevOpsDay-Medellin-2025

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### 2. Create Feature Documentation

Use the provided templates to document your feature:

```bash
# Create feature directory
mkdir -p docs/ways-of-work/plan/your-epic/your-feature

# Copy and customize templates
cp docs/ways-of-work/plan/conference-platform/agenda-management/* \
   docs/ways-of-work/plan/your-epic/your-feature/
```

### 3. Generate Test Strategy

1. **Complete Test Strategy Template**: Fill out `test-strategy.md` with ISTQB and ISO 25010 assessments
2. **Create Test Issues**: Use `test-issues-checklist.md` to generate GitHub issues
3. **Set Quality Gates**: Define entry/exit criteria in `qa-plan.md`

### 4. Implement Tests

```bash
# Run E2E tests
npm run test:e2e

# Run tests in headed mode
npm run test:e2e:headed

# Debug tests
npm run test:e2e:debug

# View test reports
npm run test:report
```

## 📋 Quality Standards

### Entry Criteria
- [ ] Requirements documented with acceptance criteria
- [ ] Technical specifications completed
- [ ] Test environment configured
- [ ] Test data prepared

### Exit Criteria
- [ ] All planned tests executed (95% pass rate minimum)
- [ ] Coverage targets achieved (80% code, 100% requirements)
- [ ] Quality metrics satisfied
- [ ] Stakeholder approval obtained

### Quality Metrics
- **Code Coverage**: 80% line, 90% branch for critical paths
- **Defect Density**: < 5 defects per 1000 lines of code
- **Performance**: Page load < 2s, API response < 500ms
- **Accessibility**: WCAG 2.1 AA compliance

## 🏷️ GitHub Project Management

### Labeling Strategy
- **Test Types**: `unit-test`, `integration-test`, `e2e-test`, `performance-test`
- **Quality Framework**: `istqb`, `iso25010`, `quality-gates`
- **Priority**: `test-critical`, `test-high`, `test-medium`, `test-low`
- **Components**: `frontend-test`, `backend-test`, `api-test`

### Estimation Guidelines
- **Test Strategy**: 2-3 story points
- **Unit Tests**: 0.5-1 story point per component
- **Integration Tests**: 1-2 story points per interface
- **E2E Tests**: 2-3 story points per user workflow
- **Performance Tests**: 3-5 story points per requirement

## 🔧 Test Automation Stack

### Core Technologies
- **Testing Framework**: Playwright for E2E, Jest for unit tests
- **Quality Tools**: ESLint, Lighthouse, axe-core
- **CI/CD Integration**: GitHub Actions workflows
- **Reporting**: HTML reports, JUnit XML, JSON output

### Browser Support
- Chromium (Chrome, Edge)
- Firefox
- WebKit (Safari)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📈 Success Metrics

### Test Coverage Metrics
- **Code Coverage**: 80% line coverage minimum
- **Functional Coverage**: 100% acceptance criteria validation
- **Risk Coverage**: 100% high-risk scenario testing
- **Quality Characteristics**: All applicable ISO 25010 characteristics

### Process Efficiency Metrics
- **Test Planning Time**: 2 hours for comprehensive strategy
- **Test Implementation Speed**: 1 day per story point
- **Quality Feedback Time**: 2 hours from completion to assessment
- **Documentation Completeness**: 100% template compliance

## 🤝 Contributing

### Adding New Test Templates

1. Create template in `.github/ISSUE_TEMPLATE/`
2. Follow ISTQB and ISO 25010 standards
3. Include clear acceptance criteria
4. Add appropriate labels and estimations

### Extending the Framework

1. Review existing documentation structure
2. Maintain consistency with ISTQB techniques
3. Ensure ISO 25010 quality characteristics coverage
4. Update this README with new components

## 📚 Resources

### ISTQB Resources
- [ISTQB Foundation Level Syllabus](https://www.istqb.org/)
- [Test Design Techniques Guide](https://www.istqb.org/certification-path-root/foundation-level/foundation-level-2018.html)

### ISO 25010 Resources
- [ISO/IEC 25010 Standard](https://iso25000.com/index.php/en/iso-25000-standards/iso-25010)
- [Quality Model Implementation Guide](https://iso25000.com/index.php/en/iso-25000-standards/iso-25010)

### Playwright Resources
- [Playwright Documentation](https://playwright.dev/)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [Best Practices Guide](https://playwright.dev/docs/best-practices)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♀️ Support

For questions about the test framework:

1. Check the [framework guide](docs/ways-of-work/test-framework-guide.md)
2. Review existing [issue templates](.github/ISSUE_TEMPLATE/)
3. Examine [example implementations](docs/ways-of-work/plan/conference-platform/agenda-management/)
4. Create an issue using the appropriate template

---

**Built with ❤️ for DevOpsDay Medellin 2025**