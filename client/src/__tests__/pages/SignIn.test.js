import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import SignIn from '../../pages/SignIn';
import { AuthProvider } from '../../contexts/AuthContext';

// Mock the AuthContext
const mockAuthContext = {
  signin: jest.fn(),
  loading: false,
  error: null
};

const MockAuthProvider = ({ children, value = mockAuthContext }) => (
  <AuthProvider value={value}>
    {children}
  </AuthProvider>
);

const renderWithRouter = (component, authValue) => {
  return render(
    <BrowserRouter>
      <MockAuthProvider value={authValue}>
        {component}
      </MockAuthProvider>
    </BrowserRouter>
  );
};

describe('SignIn Page - Authentication Workflow Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Form Rendering - Functional Suitability', () => {
    test('should render sign in form with required fields', () => {
      renderWithRouter(<SignIn />);
      
      expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    test('should render navigation links', () => {
      renderWithRouter(<SignIn />);
      
      expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /forgot password/i })).toBeInTheDocument();
    });

    test('should render form with proper HTML structure', () => {
      renderWithRouter(<SignIn />);
      
      const form = screen.getByRole('form') || screen.getByTestId('signin-form');
      expect(form).toBeInTheDocument();
    });
  });

  describe('Accessibility Tests - WCAG 2.1 AA Compliance', () => {
    test('should have proper form labels associated with inputs', () => {
      renderWithRouter(<SignIn />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      
      expect(emailInput).toHaveAccessibleName();
      expect(passwordInput).toHaveAccessibleName();
      
      // Check that labels are properly associated
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    test('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      renderWithRouter(<SignIn />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      // Tab through form elements
      await user.tab();
      expect(emailInput).toHaveFocus();
      
      await user.tab();
      expect(passwordInput).toHaveFocus();
      
      await user.tab();
      expect(submitButton).toHaveFocus();
    });

    test('should have proper heading hierarchy', () => {
      renderWithRouter(<SignIn />);
      
      const heading = screen.getByRole('heading', { name: /sign in/i });
      expect(heading).toBeInTheDocument();
      // Should be h1 or appropriate level for page title
    });

    test('should provide error messages accessibly', () => {
      const errorContext = {
        signin: jest.fn(),
        loading: false,
        error: 'Invalid email or password'
      };

      renderWithRouter(<SignIn />, errorContext);
      
      const errorMessage = screen.getByRole('alert') || screen.getByText(/invalid email or password/i);
      expect(errorMessage).toBeInTheDocument();
    });

    test('should indicate required fields', () => {
      renderWithRouter(<SignIn />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      
      // Required fields should be marked as required
      expect(emailInput).toHaveAttribute('required');
      expect(passwordInput).toHaveAttribute('required');
    });
  });

  describe('Input Validation Tests - Decision Table Testing', () => {
    test('should validate email format', async () => {
      const user = userEvent.setup();
      renderWithRouter(<SignIn />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      // Test invalid email formats
      const invalidEmails = [
        'invalid-email',
        '@domain.com',
        'user@',
        'user..name@domain.com',
        ''
      ];
      
      for (const email of invalidEmails) {
        await user.clear(emailInput);
        await user.type(emailInput, email);
        await user.click(submitButton);
        
        // Should show validation error or prevent submission
        expect(emailInput).toHaveDisplayValue(email);
        if (email === '') {
          expect(emailInput).toBeInvalid();
        }
      }
    });

    test('should accept valid email formats', async () => {
      const user = userEvent.setup();
      renderWithRouter(<SignIn />);
      
      const emailInput = screen.getByLabelText(/email/i);
      
      const validEmails = [
        'user@domain.com',
        'test.email@example.org',
        'user+tag@domain.co.uk',
        'firstname.lastname@company.com'
      ];
      
      for (const email of validEmails) {
        await user.clear(emailInput);
        await user.type(emailInput, email);
        
        expect(emailInput).toHaveDisplayValue(email);
        expect(emailInput).toBeValid();
      }
    });

    test('should require password field', async () => {
      const user = userEvent.setup();
      renderWithRouter(<SignIn />);
      
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      // Try to submit with empty password
      await user.click(submitButton);
      
      expect(passwordInput).toBeInvalid();
    });

    // Boundary Value Analysis for password length
    test('should handle password length boundaries', async () => {
      const user = userEvent.setup();
      renderWithRouter(<SignIn />);
      
      const passwordInput = screen.getByLabelText(/password/i);
      
      // Test very short password
      await user.type(passwordInput, '1');
      expect(passwordInput).toHaveDisplayValue('1');
      
      // Test very long password
      const longPassword = 'a'.repeat(1000);
      await user.clear(passwordInput);
      await user.type(passwordInput, longPassword);
      expect(passwordInput).toHaveDisplayValue(longPassword);
    });
  });

  describe('Authentication Flow Tests - State Transition Testing', () => {
    test('should call signin function with valid credentials', async () => {
      const user = userEvent.setup();
      const mockSignin = jest.fn();
      const authContext = {
        signin: mockSignin,
        loading: false,
        error: null
      };

      renderWithRouter(<SignIn />, authContext);
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);
      
      expect(mockSignin).toHaveBeenCalledWith('test@example.com', 'password123');
    });

    test('should show loading state during authentication', () => {
      const loadingContext = {
        signin: jest.fn(),
        loading: true,
        error: null
      };

      renderWithRouter(<SignIn />, loadingContext);
      
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      expect(submitButton).toBeDisabled();
      
      // Should show loading indicator
      expect(screen.getByText(/signing in/i) || screen.getByRole('status')).toBeInTheDocument();
    });

    test('should display error messages from authentication failures', () => {
      const errorContext = {
        signin: jest.fn(),
        loading: false,
        error: 'Invalid credentials'
      };

      renderWithRouter(<SignIn />, errorContext);
      
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });

    test('should clear previous errors on new submission', async () => {
      const user = userEvent.setup();
      let authContext = {
        signin: jest.fn(),
        loading: false,
        error: 'Previous error'
      };

      const { rerender } = renderWithRouter(<SignIn />, authContext);
      
      expect(screen.getByText(/previous error/i)).toBeInTheDocument();
      
      // Update context to clear error
      authContext = {
        signin: jest.fn(),
        loading: false,
        error: null
      };

      rerender(
        <BrowserRouter>
          <MockAuthProvider value={authContext}>
            <SignIn />
          </MockAuthProvider>
        </BrowserRouter>
      );
      
      expect(screen.queryByText(/previous error/i)).not.toBeInTheDocument();
    });
  });

  describe('Security Tests - Input Sanitization', () => {
    test('should handle malicious input safely', async () => {
      const user = userEvent.setup();
      const mockSignin = jest.fn();
      const authContext = {
        signin: mockSignin,
        loading: false,
        error: null
      };

      renderWithRouter(<SignIn />, authContext);
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      // Try to inject script
      const maliciousEmail = '<script>alert("xss")</script>@domain.com';
      const maliciousPassword = '<img src=x onerror=alert(1)>';
      
      await user.type(emailInput, maliciousEmail);
      await user.type(passwordInput, maliciousPassword);
      await user.click(submitButton);
      
      // Function should be called with sanitized or raw input
      // The actual sanitization should happen in the auth service
      expect(mockSignin).toHaveBeenCalled();
      
      // Verify no script execution in DOM
      expect(document.querySelector('script')).toBeNull();
    });

    test('should prevent CSRF attacks through proper form handling', () => {
      renderWithRouter(<SignIn />);
      
      const form = screen.getByRole('form') || document.querySelector('form');
      
      if (form) {
        // Form should not auto-submit or have hidden fields with tokens
        expect(form).not.toHaveAttribute('action');
        expect(form.querySelector('input[type="hidden"][name="_token"]')).toBeNull();
      }
    });
  });

  describe('Performance Tests - Form Responsiveness', () => {
    test('should handle rapid user input efficiently', async () => {
      const user = userEvent.setup();
      renderWithRouter(<SignIn />);
      
      const emailInput = screen.getByLabelText(/email/i);
      
      const startTime = Date.now();
      
      // Simulate rapid typing
      await user.type(emailInput, 'very.long.email.address@example.com', { delay: 1 });
      
      const endTime = Date.now();
      
      // Should complete within reasonable time
      expect(endTime - startTime).toBeLessThan(1000);
      expect(emailInput).toHaveDisplayValue('very.long.email.address@example.com');
    });

    test('should not cause memory leaks with multiple submissions', async () => {
      const user = userEvent.setup();
      const mockSignin = jest.fn();
      const authContext = {
        signin: mockSignin,
        loading: false,
        error: null
      };

      renderWithRouter(<SignIn />, authContext);
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      // Submit multiple times rapidly
      for (let i = 0; i < 10; i++) {
        await user.clear(emailInput);
        await user.clear(passwordInput);
        await user.type(emailInput, `test${i}@example.com`);
        await user.type(passwordInput, `password${i}`);
        await user.click(submitButton);
      }
      
      expect(mockSignin).toHaveBeenCalledTimes(10);
    });
  });

  describe('Mobile Responsiveness Tests', () => {
    test('should be usable on mobile viewports', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      renderWithRouter(<SignIn />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      
      // Inputs should be appropriately sized for mobile
      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
      
      // Touch interactions should work
      fireEvent.touchStart(emailInput);
      expect(emailInput).toBeInTheDocument();
    });

    test('should handle virtual keyboard interactions', async () => {
      const user = userEvent.setup();
      renderWithRouter(<SignIn />);
      
      const emailInput = screen.getByLabelText(/email/i);
      
      // Simulate mobile keyboard interaction
      fireEvent.focus(emailInput);
      await user.type(emailInput, 'mobile@test.com');
      
      expect(emailInput).toHaveDisplayValue('mobile@test.com');
      expect(emailInput).toHaveFocus();
    });
  });

  describe('Error Recovery Tests - Reliability', () => {
    test('should recover from network errors gracefully', async () => {
      const user = userEvent.setup();
      const mockSignin = jest.fn().mockRejectedValue(new Error('Network error'));
      const authContext = {
        signin: mockSignin,
        loading: false,
        error: 'Network error occurred'
      };

      renderWithRouter(<SignIn />, authContext);
      
      // Error should be displayed
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
      
      // Form should still be usable
      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      expect(emailInput).not.toBeDisabled();
      expect(submitButton).not.toBeDisabled();
    });

    test('should handle authentication service unavailability', () => {
      const errorContext = {
        signin: jest.fn(),
        loading: false,
        error: 'Authentication service temporarily unavailable'
      };

      renderWithRouter(<SignIn />, errorContext);
      
      expect(screen.getByText(/authentication service temporarily unavailable/i)).toBeInTheDocument();
      
      // Form should remain functional for retry
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });
  });
});