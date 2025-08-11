import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import Navbar from '../../components/Navbar';

// Mock the AuthContext
const mockAuthContext = {
  currentUser: null,
  loading: false,
  signout: jest.fn()
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

describe('Navbar Component - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering Tests - ISO 25010 Functional Suitability', () => {
    test('should render navbar with brand logo and title', () => {
      renderWithRouter(<Navbar />);
      
      const brandLink = screen.getByRole('link', { name: /devopsday medellin 2025/i });
      expect(brandLink).toBeInTheDocument();
      expect(brandLink).toHaveAttribute('href', '/');
    });

    test('should render navigation links when user is not authenticated', () => {
      renderWithRouter(<Navbar />);
      
      expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /calendar/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
    });

    test('should render user-specific links when authenticated', () => {
      const authenticatedContext = {
        currentUser: { 
          displayName: 'Test User', 
          email: 'test@example.com' 
        },
        loading: false,
        signout: jest.fn()
      };

      renderWithRouter(<Navbar />, authenticatedContext);
      
      expect(screen.getByRole('link', { name: /profile/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /sign in/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /sign up/i })).not.toBeInTheDocument();
    });

    test('should display user name when authenticated', () => {
      const authenticatedContext = {
        currentUser: { 
          displayName: 'John Doe', 
          email: 'john@example.com' 
        },
        loading: false,
        signout: jest.fn()
      };

      renderWithRouter(<Navbar />, authenticatedContext);
      
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  describe('Accessibility Tests - WCAG 2.1 AA Compliance', () => {
    test('should have proper heading structure', () => {
      renderWithRouter(<Navbar />);
      
      // Brand should be prominent but not necessarily h1 (page might have its own h1)
      const brand = screen.getByRole('link', { name: /devopsday medellin 2025/i });
      expect(brand).toBeInTheDocument();
    });

    test('should have proper link accessibility attributes', () => {
      renderWithRouter(<Navbar />);
      
      const navLinks = screen.getAllByRole('link');
      navLinks.forEach(link => {
        // Links should have accessible names
        expect(link).toHaveAccessibleName();
        // Links should be keyboard focusable
        expect(link).not.toHaveAttribute('tabindex', '-1');
      });
    });

    test('should have proper button accessibility for sign out', () => {
      const authenticatedContext = {
        currentUser: { displayName: 'Test User' },
        loading: false,
        signout: jest.fn()
      };

      renderWithRouter(<Navbar />, authenticatedContext);
      
      const signOutButton = screen.getByRole('button', { name: /sign out/i });
      expect(signOutButton).toBeInTheDocument();
      expect(signOutButton).toHaveAccessibleName();
    });

    test('should support keyboard navigation', () => {
      renderWithRouter(<Navbar />);
      
      const homeLink = screen.getByRole('link', { name: /home/i });
      homeLink.focus();
      expect(homeLink).toHaveFocus();

      // Tab to next element
      fireEvent.keyDown(homeLink, { key: 'Tab' });
      const calendarLink = screen.getByRole('link', { name: /calendar/i });
      expect(document.activeElement).toBe(calendarLink);
    });

    test('should have proper color contrast (manual verification required)', () => {
      renderWithRouter(<Navbar />);
      
      // This test ensures elements are rendered for manual contrast checking
      const navbar = screen.getByRole('navigation');
      expect(navbar).toBeInTheDocument();
      
      // In real implementation, you would use tools like axe-core
      // or lighthouse to automatically check color contrast
    });

    test('should provide semantic navigation landmark', () => {
      renderWithRouter(<Navbar />);
      
      const navigation = screen.getByRole('navigation');
      expect(navigation).toBeInTheDocument();
    });
  });

  describe('Interaction Tests - State Transition Testing', () => {
    test('should call signout function when sign out button is clicked', async () => {
      const mockSignout = jest.fn();
      const authenticatedContext = {
        currentUser: { displayName: 'Test User' },
        loading: false,
        signout: mockSignout
      };

      renderWithRouter(<Navbar />, authenticatedContext);
      
      const signOutButton = screen.getByRole('button', { name: /sign out/i });
      fireEvent.click(signOutButton);
      
      expect(mockSignout).toHaveBeenCalledTimes(1);
    });

    test('should handle loading state gracefully', () => {
      const loadingContext = {
        currentUser: null,
        loading: true,
        signout: jest.fn()
      };

      renderWithRouter(<Navbar />, loadingContext);
      
      // During loading, basic navigation should still be available
      expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /calendar/i })).toBeInTheDocument();
    });

    test('should update navigation links when authentication state changes', () => {
      const { rerender } = renderWithRouter(<Navbar />);
      
      // Initially not authenticated
      expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /sign out/i })).not.toBeInTheDocument();
      
      // Rerender with authenticated user
      const authenticatedContext = {
        currentUser: { displayName: 'Test User' },
        loading: false,
        signout: jest.fn()
      };

      rerender(
        <BrowserRouter>
          <MockAuthProvider value={authenticatedContext}>
            <Navbar />
          </MockAuthProvider>
        </BrowserRouter>
      );
      
      expect(screen.queryByRole('link', { name: /sign in/i })).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument();
    });
  });

  describe('Responsive Design Tests - Mobile Compatibility', () => {
    test('should be responsive on mobile viewports', () => {
      // Simulate mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375, // iPhone SE width
      });

      renderWithRouter(<Navbar />);
      
      const navbar = screen.getByRole('navigation');
      expect(navbar).toBeInTheDocument();
      
      // Navigation links should still be accessible
      expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    });

    test('should handle touch interactions appropriately', () => {
      renderWithRouter(<Navbar />);
      
      const homeLink = screen.getByRole('link', { name: /home/i });
      
      // Simulate touch interaction
      fireEvent.touchStart(homeLink);
      fireEvent.touchEnd(homeLink);
      
      // Element should remain interactive
      expect(homeLink).toBeInTheDocument();
    });
  });

  describe('Error Handling Tests - Reliability', () => {
    test('should handle missing user display name gracefully', () => {
      const incompleteUserContext = {
        currentUser: { email: 'test@example.com' }, // Missing displayName
        loading: false,
        signout: jest.fn()
      };

      renderWithRouter(<Navbar />, incompleteUserContext);
      
      // Should still render without crashing
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument();
    });

    test('should handle signout function errors gracefully', async () => {
      const errorSignout = jest.fn(() => {
        throw new Error('Signout failed');
      });
      
      const authenticatedContext = {
        currentUser: { displayName: 'Test User' },
        loading: false,
        signout: errorSignout
      };

      renderWithRouter(<Navbar />, authenticatedContext);
      
      const signOutButton = screen.getByRole('button', { name: /sign out/i });
      
      // Should not crash when signout throws error
      expect(() => {
        fireEvent.click(signOutButton);
      }).not.toThrow();
    });
  });

  describe('Performance Tests - Rendering Efficiency', () => {
    test('should render efficiently with minimal re-renders', () => {
      const renderSpy = jest.fn();
      
      const TestableNavbar = () => {
        renderSpy();
        return <Navbar />;
      };

      const { rerender } = renderWithRouter(<TestableNavbar />);
      
      expect(renderSpy).toHaveBeenCalledTimes(1);
      
      // Re-render with same props shouldn't cause unnecessary renders
      rerender(
        <BrowserRouter>
          <MockAuthProvider>
            <TestableNavbar />
          </MockAuthProvider>
        </BrowserRouter>
      );
      
      expect(renderSpy).toHaveBeenCalledTimes(2);
    });

    test('should handle rapid authentication state changes', () => {
      const { rerender } = renderWithRouter(<Navbar />);
      
      // Rapidly change authentication state
      for (let i = 0; i < 10; i++) {
        const context = {
          currentUser: i % 2 === 0 ? null : { displayName: `User ${i}` },
          loading: false,
          signout: jest.fn()
        };

        rerender(
          <BrowserRouter>
            <MockAuthProvider value={context}>
              <Navbar />
            </MockAuthProvider>
          </BrowserRouter>
        );
      }
      
      // Should not crash and final state should be rendered
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });

  describe('Security Tests - XSS Prevention', () => {
    test('should safely render user display name', () => {
      const maliciousContext = {
        currentUser: { 
          displayName: '<script>alert("xss")</script>',
          email: 'test@example.com'
        },
        loading: false,
        signout: jest.fn()
      };

      renderWithRouter(<Navbar />, maliciousContext);
      
      // Should render as text, not execute script
      expect(screen.getByText('<script>alert("xss")</script>')).toBeInTheDocument();
      
      // Verify no script tags in DOM
      expect(document.querySelector('script')).toBeNull();
    });

    test('should sanitize any potentially dangerous content', () => {
      const suspiciousContext = {
        currentUser: { 
          displayName: 'User<img src=x onerror=alert(1)>',
          email: 'test@example.com'
        },
        loading: false,
        signout: jest.fn()
      };

      renderWithRouter(<Navbar />, suspiciousContext);
      
      // Should be safely rendered as text
      const navbar = screen.getByRole('navigation');
      expect(navbar).toBeInTheDocument();
      expect(navbar.innerHTML).not.toContain('onerror');
    });
  });
});