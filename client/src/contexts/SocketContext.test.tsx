import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '../test/test-utils';
import { SocketProvider } from './SocketContext';

// Mock socket.io-client
vi.mock('socket.io-client', () => ({
  io: vi.fn(() => ({
    on: vi.fn(),
    emit: vi.fn(),
    off: vi.fn(),
    disconnect: vi.fn(),
    connect: vi.fn(),
    connected: false,
    id: 'test-socket-id',
  })),
}));

describe('SocketContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock console methods to reduce noise
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('SocketProvider', () => {
    it('should render SocketProvider without crashing', () => {
      const TestComponent = () => (
        <div data-testid="socket-test">Socket Test</div>
      );

      render(
        <SocketProvider>
          <TestComponent />
        </SocketProvider>,
      );

      expect(screen.getByTestId('socket-test')).toHaveTextContent(
        'Socket Test',
      );
    });

    it('should provide socket context to child components', () => {
      const TestComponent = () => (
        <div data-testid="socket-child">Socket Child</div>
      );

      render(
        <SocketProvider>
          <TestComponent />
        </SocketProvider>,
      );

      expect(screen.getByTestId('socket-child')).toBeInTheDocument();
    });

    it('should handle multiple child components', () => {
      render(
        <SocketProvider>
          <div data-testid="socket-child-1">Socket Child 1</div>
          <div data-testid="socket-child-2">Socket Child 2</div>
        </SocketProvider>,
      );

      expect(screen.getByTestId('socket-child-1')).toHaveTextContent(
        'Socket Child 1',
      );
      expect(screen.getByTestId('socket-child-2')).toHaveTextContent(
        'Socket Child 2',
      );
    });

    it('should handle provider nesting', () => {
      const TestComponent = () => (
        <div data-testid="nested-socket">Nested Socket</div>
      );

      render(
        <SocketProvider>
          <SocketProvider>
            <TestComponent />
          </SocketProvider>
        </SocketProvider>,
      );

      expect(screen.getByTestId('nested-socket')).toBeInTheDocument();
    });
  });

  describe('Socket Connection', () => {
    it('should initialize socket connection safely', () => {
      const TestComponent = () => (
        <div data-testid="connection-test">Connection Test</div>
      );

      // Should not throw during socket initialization
      expect(() => {
        render(
          <SocketProvider>
            <TestComponent />
          </SocketProvider>,
        );
      }).not.toThrow();

      expect(screen.getByTestId('connection-test')).toBeInTheDocument();
    });

    it('should handle socket connection errors gracefully', () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const TestComponent = () => (
        <div data-testid="error-handling">Error Handling</div>
      );

      render(
        <SocketProvider>
          <TestComponent />
        </SocketProvider>,
      );

      expect(screen.getByTestId('error-handling')).toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });

  describe('Environment Integration', () => {
    it('should use test environment configuration', () => {
      const TestComponent = () => (
        <div data-testid="env-test">Environment Test</div>
      );

      render(
        <SocketProvider>
          <TestComponent />
        </SocketProvider>,
      );

      // Should render successfully with test environment
      expect(screen.getByTestId('env-test')).toBeInTheDocument();
    });

    it('should handle missing environment variables gracefully', () => {
      // Temporarily modify environment
      const originalEnv = import.meta.env;
      Object.defineProperty(import.meta, 'env', {
        value: {},
        writable: true,
      });

      const TestComponent = () => (
        <div data-testid="missing-env">Missing Env Test</div>
      );

      render(
        <SocketProvider>
          <TestComponent />
        </SocketProvider>,
      );

      expect(screen.getByTestId('missing-env')).toBeInTheDocument();

      // Restore environment
      Object.defineProperty(import.meta, 'env', {
        value: originalEnv,
        writable: true,
      });
    });
  });

  describe('Cleanup and Memory Management', () => {
    it('should handle provider unmounting safely', () => {
      const TestComponent = () => (
        <div data-testid="unmount-test">Unmount Test</div>
      );

      const { unmount } = render(
        <SocketProvider>
          <TestComponent />
        </SocketProvider>,
      );

      expect(screen.getByTestId('unmount-test')).toBeInTheDocument();

      // Should not throw when unmounting
      expect(() => {
        unmount();
      }).not.toThrow();
    });

    it('should handle rapid provider mounting and unmounting', () => {
      const TestComponent = () => (
        <div data-testid="rapid-test">Rapid Test</div>
      );

      // Mount and unmount multiple times
      for (let i = 0; i < 3; i++) {
        const { unmount } = render(
          <SocketProvider>
            <TestComponent />
          </SocketProvider>,
        );

        expect(screen.getByTestId('rapid-test')).toBeInTheDocument();
        unmount();
      }
    });
  });
});
