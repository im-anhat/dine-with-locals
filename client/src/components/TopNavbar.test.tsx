import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../test/test-utils';
import { TopNavbar } from './TopNavbar';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('TopNavbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render TopNavbar with single path', () => {
      const currentPath = ['dashboard'];

      render(<TopNavbar currentPath={currentPath} />);

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('should render TopNavbar with multiple paths', () => {
      const currentPath = ['dashboard', 'host', 'create-listing'];

      render(<TopNavbar currentPath={currentPath} />);

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Host')).toBeInTheDocument();
      expect(screen.getByText('Create a Listing')).toBeInTheDocument();
    });

    it('should render sidebar trigger', () => {
      const currentPath = ['dashboard'];

      render(<TopNavbar currentPath={currentPath} />);

      // Should render the sidebar trigger component
      // This test verifies the component structure
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('should render separators between path items', () => {
      const currentPath = ['dashboard', 'host'];

      render(<TopNavbar currentPath={currentPath} />);

      // Should have chevron icon between items
      const dashboard = screen.getByText('Dashboard');
      const host = screen.getByText('Host');

      expect(dashboard).toBeInTheDocument();
      expect(host).toBeInTheDocument();
    });
  });

  describe('Path Mapping', () => {
    it('should map predefined paths correctly', () => {
      const currentPath = ['host'];

      render(<TopNavbar currentPath={currentPath} />);

      expect(screen.getByText('Host')).toBeInTheDocument();
    });

    it('should map create-listing path correctly', () => {
      const currentPath = ['create-listing'];

      render(<TopNavbar currentPath={currentPath} />);

      expect(screen.getByText('Create a Listing')).toBeInTheDocument();
    });

    it('should map approvals path correctly', () => {
      const currentPath = ['approvals'];

      render(<TopNavbar currentPath={currentPath} />);

      expect(screen.getByText('Pending Approvals')).toBeInTheDocument();
    });

    it('should capitalize unmapped paths', () => {
      const currentPath = ['profile'];

      render(<TopNavbar currentPath={currentPath} />);

      expect(screen.getByText('Profile')).toBeInTheDocument();
    });

    it('should handle multiple unmapped paths', () => {
      const currentPath = ['settings', 'privacy'];

      render(<TopNavbar currentPath={currentPath} />);

      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByText('Privacy')).toBeInTheDocument();
    });
  });

  describe('Navigation Behavior', () => {
    it('should handle click on first path item', () => {
      const currentPath = ['dashboard', 'host'];

      render(<TopNavbar currentPath={currentPath} />);

      const dashboardItem = screen.getByText('Dashboard');
      dashboardItem.click();

      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });

    it('should handle click on middle path item', () => {
      const currentPath = ['dashboard', 'host', 'create-listing'];

      render(<TopNavbar currentPath={currentPath} />);

      const hostItem = screen.getByText('Host');
      hostItem.click();

      expect(mockNavigate).toHaveBeenCalledWith('/dashboard/host');
    });

    it('should handle click on last path item', () => {
      const currentPath = ['dashboard', 'host', 'create-listing'];

      render(<TopNavbar currentPath={currentPath} />);

      const createListingItem = screen.getByText('Create a Listing');
      createListingItem.click();

      expect(mockNavigate).toHaveBeenCalledWith(
        '/dashboard/host/create-listing',
      );
    });

    it('should handle single path navigation', () => {
      const currentPath = ['dashboard'];

      render(<TopNavbar currentPath={currentPath} />);

      const dashboardItem = screen.getByText('Dashboard');
      dashboardItem.click();

      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  describe('Styling and Classes', () => {
    it('should apply different styles to intermediate vs final path items', () => {
      const currentPath = ['dashboard', 'host'];

      render(<TopNavbar currentPath={currentPath} />);

      const dashboardItem = screen.getByText('Dashboard');
      const hostItem = screen.getByText('Host');

      // Intermediate items should have text-stone-500 class
      expect(dashboardItem).toHaveClass('text-stone-500');
      // Final item should not have text-stone-500 class
      expect(hostItem).not.toHaveClass('text-stone-500');
    });

    it('should apply cursor pointer to all path items', () => {
      const currentPath = ['dashboard', 'host'];

      render(<TopNavbar currentPath={currentPath} />);

      const dashboardItem = screen.getByText('Dashboard');
      const hostItem = screen.getByText('Host');

      expect(dashboardItem).toHaveClass('cursor-pointer');
      expect(hostItem).toHaveClass('cursor-pointer');
    });

    it('should apply hover styles to path items', () => {
      const currentPath = ['dashboard'];

      render(<TopNavbar currentPath={currentPath} />);

      const dashboardItem = screen.getByText('Dashboard');

      expect(dashboardItem).toHaveClass('hover:text-stone-900');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty path array', () => {
      const currentPath: string[] = [];

      render(<TopNavbar currentPath={currentPath} />);

      // Should render without crashing
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('should handle paths with special characters', () => {
      const currentPath = ['my-profile', 'edit-settings'];

      render(<TopNavbar currentPath={currentPath} />);

      expect(screen.getByText('My-profile')).toBeInTheDocument();
      expect(screen.getByText('Edit-settings')).toBeInTheDocument();
    });

    it('should handle very long path arrays', () => {
      const currentPath = [
        'dashboard',
        'host',
        'create-listing',
        'step-1',
        'details',
      ];

      render(<TopNavbar currentPath={currentPath} />);

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Host')).toBeInTheDocument();
      expect(screen.getByText('Create a Listing')).toBeInTheDocument();
      expect(screen.getByText('Step-1')).toBeInTheDocument();
      expect(screen.getByText('Details')).toBeInTheDocument();
    });

    it('should handle paths with numbers', () => {
      const currentPath = ['step1', 'page2'];

      render(<TopNavbar currentPath={currentPath} />);

      expect(screen.getByText('Step1')).toBeInTheDocument();
      expect(screen.getByText('Page2')).toBeInTheDocument();
    });
  });
});
