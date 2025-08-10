# Testing Setup Guide: DevOpsDay Platform

## Quick Start Guide

This guide provides step-by-step instructions for setting up the comprehensive testing framework for the DevOpsDay platform, including unit tests, integration tests, and end-to-end testing with Playwright.

## Prerequisites

- Node.js v16 or later
- npm or yarn package manager
- Git for version control
- Modern web browsers (Chrome, Firefox, Safari, Edge)

## Frontend Testing Setup (React)

### 1. Install Testing Dependencies

```bash
cd client
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install --save-dev jest-environment-jsdom
```

### 2. Configure Jest (create `client/jest.config.js`)

```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapping: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/reportWebVitals.js',
    '!src/**/*.stories.js',
    '!src/**/*.test.js'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  coverageReporters: ['text', 'lcov', 'html'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx}'
  ]
};
```

### 3. Setup Test Utilities (create `client/src/setupTests.js`)

```javascript
import '@testing-library/jest-dom';

// Mock matchMedia for tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() { return null; }
  disconnect() { return null; }
  unobserve() { return null; }
};
```

### 4. Create Test Utilities (create `client/src/test-utils.js`)

```javascript
import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Custom render function with providers
const AllTheProviders = ({ children }) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        {children}
      </AuthProvider>
    </BrowserRouter>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render };

// Helper functions for common test scenarios
export const mockUser = {
  id: '1',
  email: 'test@example.com',
  displayName: 'Test User',
  token: 'mock-jwt-token'
};

export const mockTalk = {
  id: '1',
  title: 'Test Talk',
  description: 'Test Description',
  speakers: [{ name: 'Test Speaker', bio: 'Test Bio' }],
  startTime: new Date('2025-05-22T10:00:00'),
  endTime: new Date('2025-05-22T11:00:00'),
  location: 'Test Room',
  maxAttendees: 50,
  tags: ['Test']
};
```

## Backend Testing Setup (Node.js)

### 1. Install Testing Dependencies

```bash
cd server
npm install --save-dev jest supertest mongodb-memory-server
```

### 2. Configure Jest (create `server/jest.config.js`)

```javascript
module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js',
    '!src/**/*.test.js'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  coverageReporters: ['text', 'lcov', 'html'],
  testMatch: [
    '<rootDir>/tests/**/*.test.js',
    '<rootDir>/src/**/*.test.js'
  ],
  testTimeout: 10000
};
```

### 3. Setup Test Environment (create `server/tests/setup.js`)

```javascript
// Test environment setup
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.EMAIL_HOST = 'smtp.test.com';
process.env.EMAIL_PORT = '587';
process.env.EMAIL_USER = 'test@example.com';
process.env.EMAIL_PASS = 'test-password';

// Global test cleanup
afterEach(() => {
  jest.clearAllMocks();
});

// Mock email service
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({ messageId: 'test-message-id' })
  })
}));
```

### 4. Create Test Utilities (create `server/tests/helpers.js`)

```javascript
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/index');

// Helper function to create authenticated user
const createAuthenticatedUser = (userData = {}) => {
  const user = {
    id: '1',
    email: 'test@example.com',
    displayName: 'Test User',
    ...userData
  };
  
  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
  
  return { user, token };
};

// Helper function for authenticated requests
const authenticatedRequest = (token) => {
  return request(app).set('Authorization', `Bearer ${token}`);
};

// Mock data generators
const generateMockTalk = (overrides = {}) => ({
  title: 'Test Talk',
  description: 'Test Description',
  speakers: [{ name: 'Test Speaker', bio: 'Test Bio' }],
  startTime: new Date(),
  endTime: new Date(Date.now() + 3600000), // 1 hour later
  location: 'Test Room',
  maxAttendees: 50,
  tags: ['Test'],
  ...overrides
});

const generateMockUser = (overrides = {}) => ({
  email: 'test@example.com',
  password: 'TestPassword123!',
  displayName: 'Test User',
  company: 'Test Company',
  jobTitle: 'Test Title',
  ...overrides
});

module.exports = {
  createAuthenticatedUser,
  authenticatedRequest,
  generateMockTalk,
  generateMockUser,
  app
};
```

## Playwright E2E Testing Setup

### 1. Install Playwright

```bash
# In project root
npm install --save-dev @playwright/test
npx playwright install
```

### 2. Configure Playwright (create `playwright.config.js`)

```javascript
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: [
    {
      command: 'cd client && npm start',
      port: 3000,
      timeout: 120 * 1000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'cd server && npm start',
      port: 5000,
      timeout: 120 * 1000,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
```

### 3. Create Page Object Model (create `tests/e2e/pages/`)

```javascript
// tests/e2e/pages/HomePage.js
class HomePage {
  constructor(page) {
    this.page = page;
    this.navSignIn = page.locator('[data-testid="nav-signin"]');
    this.navSignUp = page.locator('[data-testid="nav-signup"]');
    this.heroSection = page.locator('[data-testid="hero-section"]');
  }

  async goto() {
    await this.page.goto('/');
  }

  async clickSignIn() {
    await this.navSignIn.click();
  }

  async clickSignUp() {
    await this.navSignUp.click();
  }
}

// tests/e2e/pages/SignInPage.js
class SignInPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator('[data-testid="email"]');
    this.passwordInput = page.locator('[data-testid="password"]');
    this.submitButton = page.locator('[data-testid="submit"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
  }

  async goto() {
    await this.page.goto('/signin');
  }

  async signIn(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}

// tests/e2e/pages/CalendarPage.js
class CalendarPage {
  constructor(page) {
    this.page = page;
    this.calendar = page.locator('[data-testid="calendar"]');
    this.talkCard = page.locator('[data-testid="talk-card"]');
    this.filterInput = page.locator('[data-testid="filter-input"]');
  }

  async goto() {
    await this.page.goto('/calendar');
  }

  async clickTalk(talkTitle) {
    await this.page.locator(`[data-testid="talk-card"]:has-text("${talkTitle}")`).first().click();
  }

  async filterTalks(searchTerm) {
    await this.filterInput.fill(searchTerm);
  }
}

module.exports = { HomePage, SignInPage, CalendarPage };
```

### 4. Create Test Fixtures (create `tests/e2e/fixtures.js`)

```javascript
const { test as base } = require('@playwright/test');
const { HomePage, SignInPage, CalendarPage } = require('./pages');

// Extend test with page objects
const test = base.extend({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  signInPage: async ({ page }, use) => {
    await use(new SignInPage(page));
  },
  calendarPage: async ({ page }, use) => {
    await use(new CalendarPage(page));
  },
});

// Test data
const testData = {
  validUser: {
    email: 'test@example.com',
    password: 'TestPassword123!',
    displayName: 'Test User'
  },
  invalidUser: {
    email: 'invalid@example.com',
    password: 'wrongpassword'
  },
  testTalk: {
    title: 'Opening Keynote: The Future of DevOps',
    speaker: 'Maria Rodriguez'
  }
};

module.exports = { test, expect: require('@playwright/test').expect, testData };
```

## Sample Test Examples

### Frontend Component Test Example

```javascript
// client/src/components/__tests__/Navbar.test.js
import React from 'react';
import { render, screen, fireEvent } from '../../test-utils';
import Navbar from '../Navbar';

describe('Navbar Component', () => {
  test('renders navigation links for unauthenticated user', () => {
    render(<Navbar />);
    
    expect(screen.getByText('DevOpsDay Medellin 2025')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Calendar')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  test('shows profile link for authenticated user', () => {
    // Mock authenticated user context
    const mockAuthContext = {
      currentUser: { displayName: 'Test User' },
      logout: jest.fn()
    };
    
    render(<Navbar />, { authContext: mockAuthContext });
    
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
});
```

### Backend API Test Example

```javascript
// server/tests/controllers/auth.test.js
const request = require('supertest');
const { app, generateMockUser } = require('../helpers');

describe('Authentication Controller', () => {
  describe('POST /api/auth/register', () => {
    test('should register a new user successfully', async () => {
      const userData = generateMockUser();
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);
      
      expect(response.body).toMatchObject({
        user: {
          email: userData.email,
          displayName: userData.displayName
        }
      });
      expect(response.body.token).toBeDefined();
    });

    test('should return error for invalid email', async () => {
      const userData = generateMockUser({ email: 'invalid-email' });
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);
      
      expect(response.body.message).toContain('Invalid email');
    });
  });
});
```

### Playwright E2E Test Example

```javascript
// tests/e2e/user-authentication.spec.js
const { test, expect, testData } = require('./fixtures');

test.describe('User Authentication', () => {
  test('user can sign up, verify email, and sign in', async ({ page, homePage, signInPage }) => {
    // Navigate to home page
    await homePage.goto();
    
    // Click sign up
    await homePage.clickSignUp();
    
    // Fill registration form
    await page.fill('[data-testid="email"]', testData.validUser.email);
    await page.fill('[data-testid="password"]', testData.validUser.password);
    await page.fill('[data-testid="displayName"]', testData.validUser.displayName);
    
    // Submit registration
    await page.click('[data-testid="submit"]');
    
    // Verify success message
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Registration successful');
    
    // Navigate to sign in
    await signInPage.goto();
    
    // Sign in with registered user
    await signInPage.signIn(testData.validUser.email, testData.validUser.password);
    
    // Verify successful login
    await expect(page).toHaveURL('/calendar');
    await expect(page.locator('[data-testid="user-menu"]')).toContainText(testData.validUser.displayName);
  });
});
```

## CI/CD Integration

### GitHub Actions Workflow (create `.github/workflows/test.yml`)

```yaml
name: Test Suite

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [16.x, 18.x]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: |
        npm ci
        cd client && npm ci
        cd ../server && npm ci
    
    - name: Run frontend tests
      run: cd client && npm run test:coverage
    
    - name: Run backend tests
      run: cd server && npm run test:coverage
    
    - name: Upload coverage reports
      uses: codecov/codecov-action@v3
      with:
        files: ./client/coverage/lcov.info,./server/coverage/lcov.info

  e2e-tests:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18.x'
        cache: 'npm'
    
    - name: Install dependencies
      run: |
        npm ci
        cd client && npm ci
        cd ../server && npm ci
    
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    
    - name: Run Playwright tests
      run: npx playwright test
    
    - uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

## Quality Gates Configuration

### Code Coverage Enforcement (create `scripts/check-coverage.js`)

```javascript
const fs = require('fs');
const path = require('path');

// Coverage thresholds
const COVERAGE_THRESHOLDS = {
  lines: 80,
  functions: 80,
  branches: 80,
  statements: 80
};

function checkCoverage(coveragePath) {
  const coverageFile = path.join(coveragePath, 'coverage-summary.json');
  
  if (!fs.existsSync(coverageFile)) {
    console.error(`Coverage file not found: ${coverageFile}`);
    process.exit(1);
  }
  
  const coverage = JSON.parse(fs.readFileSync(coverageFile, 'utf8'));
  const total = coverage.total;
  
  let failed = false;
  
  Object.keys(COVERAGE_THRESHOLDS).forEach(metric => {
    const actual = total[metric].pct;
    const threshold = COVERAGE_THRESHOLDS[metric];
    
    if (actual < threshold) {
      console.error(`Coverage for ${metric} (${actual}%) is below threshold (${threshold}%)`);
      failed = true;
    } else {
      console.log(`✓ Coverage for ${metric}: ${actual}% (threshold: ${threshold}%)`);
    }
  });
  
  if (failed) {
    console.error('Coverage check failed!');
    process.exit(1);
  } else {
    console.log('All coverage thresholds met!');
  }
}

// Check both frontend and backend coverage
checkCoverage('client/coverage');
checkCoverage('server/coverage');
```

### Package.json Scripts Update

```json
{
  "scripts": {
    "test": "npm run test:client && npm run test:server",
    "test:client": "cd client && npm test",
    "test:server": "cd server && npm test",
    "test:coverage": "npm run test:coverage:client && npm run test:coverage:server",
    "test:coverage:client": "cd client && npm run test -- --coverage",
    "test:coverage:server": "cd server && npm test -- --coverage",
    "test:e2e": "playwright test",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:debug": "playwright test --debug",
    "check-coverage": "node scripts/check-coverage.js",
    "quality-gate": "npm run test:coverage && npm run check-coverage && npm run test:e2e"
  }
}
```

This comprehensive testing setup provides a solid foundation for implementing high-quality testing across the DevOpsDay platform, ensuring reliability, performance, and maintainability.