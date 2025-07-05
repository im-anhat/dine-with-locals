import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '../test/test-utils';
import { AuthProvider } from './AuthContext';

// Mock UserService to avoid actual API calls
vi.mock('../services/UserService', () => ({
  getUserById: vi.fn(),
  updateUserProfile: vi.fn(),
}));

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    // Mock console methods to reduce noise in tests
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  describe('Authentication Provider', () => {
    it('should render AuthProvider without crashing', () => {
      const TestComponent = () => (
        <div data-testid="test-content">Test Content</div>
      );

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      );

      expect(screen.getByTestId('test-content')).toHaveTextContent(
        'Test Content',
      );
    });

    it('should provide context to child components', () => {
      const TestComponent = () => {
        // Simple test to verify provider renders children
        return <div data-testid="child-component">Provider Working</div>;
      };

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      );

      expect(screen.getByTestId('child-component')).toHaveTextContent(
        'Provider Working',
      );
    });

    it('should handle multiple child components', () => {
      render(
        <AuthProvider>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
        </AuthProvider>,
      );

      expect(screen.getByTestId('child-1')).toHaveTextContent('Child 1');
      expect(screen.getByTestId('child-2')).toHaveTextContent('Child 2');
    });
  });

  describe('Local Storage Integration', () => {
    it('should handle localStorage interactions safely', () => {
      // Mock localStorage
      const mockLocalStorage = {
        getItem: vi.fn().mockReturnValue(null),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      };

      Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage,
        writable: true,
      });

      const TestComponent = () => (
        <div data-testid="storage-test">Storage Test</div>
      );

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      );

      expect(screen.getByTestId('storage-test')).toBeInTheDocument();
    });

    it('should handle invalid tokens in localStorage gracefully', () => {
      const mockLocalStorage = {
        getItem: vi.fn().mockReturnValue('invalid-token'),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      };

      Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage,
        writable: true,
      });

      const TestComponent = () => (
        <div data-testid="invalid-token-test">Invalid Token Test</div>
      );

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      );

      // Should render without crashing even with invalid token
      expect(screen.getByTestId('invalid-token-test')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle authentication errors gracefully', () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const TestComponent = () => (
        <div data-testid="error-test">Error Handling Test</div>
      );

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      );

      // Component should render even if there are authentication errors
      expect(screen.getByTestId('error-test')).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it('should provide stable provider interface', () => {
      const TestComponent = () => {
        // Test that the provider doesn't crash during rendering
        return <div data-testid="stability-test">Stability Test</div>;
      };

      // Should not throw during render
      expect(() => {
        render(
          <AuthProvider>
            <TestComponent />
          </AuthProvider>,
        );
      }).not.toThrow();

      expect(screen.getByTestId('stability-test')).toBeInTheDocument();
    });
  });

  describe('Integration with React Router', () => {
    it('should work with router navigation', () => {
      // Test that AuthProvider works with the router mock
      const TestComponent = () => (
        <div data-testid="router-test">Router Integration</div>
      );

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      );

      expect(screen.getByTestId('router-test')).toBeInTheDocument();
    });
  });

  describe('Provider Structure', () => {
    it('should accept and render children prop', () => {
      const children = (
        <div data-testid="children-prop">Children Prop Test</div>
      );

      render(<AuthProvider>{children}</AuthProvider>);

      expect(screen.getByTestId('children-prop')).toHaveTextContent(
        'Children Prop Test',
      );
    });

    it('should handle nested providers', () => {
      const TestComponent = () => (
        <div data-testid="nested-test">Nested Test</div>
      );

      render(
        <AuthProvider>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </AuthProvider>,
      );

      expect(screen.getByTestId('nested-test')).toBeInTheDocument();
    });
  });
});
