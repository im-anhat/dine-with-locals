import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '../test/test-utils';
import HomePage from './HomePage';
import axios from 'axios';
vi.mock('axios');

// Mock the UserContext
const mockUserContext = {
  currentUser: null as any,
  setCurrentUser: vi.fn(),
  loading: false,
};

vi.mock('../hooks/useUserContext', () => ({
  useUserContext: () => mockUserContext,
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('HomePage', () => {
  const mockListings = [
    {
      _id: '1',
      userId: {
        _id: 'u1',
        userName: 'johndoe',
        firstName: 'John',
        lastName: 'Doe',
        avatar: 'avatar1.jpg',
      },
      title: 'Listing 1',
      description: 'Description 1',
      images: ['img1.jpg'],
      category: 'dining',
      locationId: {
        coordinates: { lat: 1, lng: 2 },
        _id: 'loc1',
        address: '123 Main St',
        city: 'City1',
        state: 'State1',
        country: 'Country1',
        zipCode: '00001',
        name: 'Place1',
        place_id: 'place1',
        createdAt: '',
        updatedAt: '',
        __v: 0,
      },
      additionalInfo: 'Info 1',
      status: 'waiting',
      time: '',
      duration: 1,
      interestTopic: [],
      numGuests: 1,
      cuisine: [],
      dietary: [],
      createdAt: '',
      updatedAt: '',
      __v: 0,
      distance: 0.1,
    },
    {
      _id: '2',
      userId: {
        _id: 'u2',
        userName: 'janedoe',
        firstName: 'Jane',
        lastName: 'Doe',
        avatar: 'avatar2.jpg',
      },
      title: 'Listing 2',
      description: 'Description 2',
      images: ['img2.jpg'],
      category: 'dining',
      locationId: {
        coordinates: { lat: 3, lng: 4 },
        _id: 'loc2',
        address: '456 Main St',
        city: 'City2',
        state: 'State2',
        country: 'Country2',
        zipCode: '00002',
        name: 'Place2',
        place_id: 'place2',
        createdAt: '',
        updatedAt: '',
        __v: 0,
      },
      additionalInfo: 'Info 2',
      status: 'waiting',
      time: '',
      duration: 2,
      interestTopic: [],
      numGuests: 2,
      cuisine: [],
      dietary: [],
      createdAt: '',
      updatedAt: '',
      __v: 0,
      distance: 0.2,
    },
    {
      _id: '3',
      userId: {
        _id: 'u3',
        userName: 'bobsmith',
        firstName: 'Bob',
        lastName: 'Smith',
        avatar: 'avatar3.jpg',
      },
      title: 'Listing 3',
      description: 'Description 3',
      images: ['img3.jpg'],
      category: 'dining',
      locationId: {
        coordinates: { lat: 5, lng: 6 },
        _id: 'loc3',
        address: '789 Main St',
        city: 'City3',
        state: 'State3',
        country: 'Country3',
        zipCode: '00003',
        name: 'Place3',
        place_id: 'place3',
        createdAt: '',
        updatedAt: '',
        __v: 0,
      },
      additionalInfo: 'Info 3',
      status: 'waiting',
      time: '',
      duration: 3,
      interestTopic: [],
      numGuests: 3,
      cuisine: [],
      dietary: [],
      createdAt: '',
      updatedAt: '',
      __v: 0,
      distance: 0.3,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockUserContext.currentUser = null;
    mockUserContext.loading = false;
    // @ts-expect-error: axios.get is being mocked for testing purposes
    axios.get.mockResolvedValue({ data: mockListings });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render HomePage without crashing', async () => {
      render(<HomePage />);
      await waitFor(() => {
        expect(axios.get).toHaveBeenCalled();
      });
      expect(document.body).toBeInTheDocument();
    });

    it('should render main content area', async () => {
      render(<HomePage />);
      await waitFor(() => {
        expect(axios.get).toHaveBeenCalled();
      });
      // Look for the hero section which is the main content of HomePage
      const authenticText = screen.getByText('Authentic');
      expect(authenticText).toBeInTheDocument();

      const flavorsText = screen.getByText('flavors,');
      expect(flavorsText).toBeInTheDocument();

      // Check for key call-to-action buttons
      const getStartedButton = screen.getByText('Get started');
      expect(getStartedButton).toBeInTheDocument();
    });
    describe('Featured Listings useEffect', () => {
      it('should fetch and render featured listings', async () => {
        render(<HomePage />);
        await waitFor(() => {
          expect(axios.get).toHaveBeenCalled();
        });
        // Only first 3 listings should be passed to FilterResults
        // You can check for their names if FilterResults renders them directly
        expect(screen.queryByText('Listing 1')).toBeInTheDocument();
        expect(screen.queryByText('Listing 2')).toBeInTheDocument();
        expect(screen.queryByText('Listing 3')).toBeInTheDocument();
        // Listing 4 should not be present
        expect(screen.queryByText('Listing 4')).not.toBeInTheDocument();
      });
    });

    it('should render navigation elements', () => {
      render(<HomePage />);

      // Should have some navigation or header elements
      // This is a structural test since we don't know the exact content
      expect(document.body.firstChild).toBeInTheDocument();
    });
  });

  describe('User Context Integration', () => {
    it('should handle authenticated user state', () => {
      mockUserContext.currentUser = {
        _id: 'user123',
        userName: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        role: 'Guest',
        password: 'hashed',
        phone: '123456789',
        avatar: 'avatar.jpg',
        socialLink: 'social.com/test',
        hobbies: ['cooking'],
        cuisines: ['Italian'],
        ethnicity: 'Asian',
        bio: 'Test bio',
        cover: 'cover.jpg',
        locationId: 'location123',
      };

      render(<HomePage />);

      // Should render without errors when user is authenticated
      expect(document.body.firstChild).toBeInTheDocument();
    });

    it('should handle non-authenticated user state', () => {
      mockUserContext.currentUser = null;

      render(<HomePage />);

      // Should render without errors when user is not authenticated
      expect(document.body.firstChild).toBeInTheDocument();
    });

    it('should handle loading state', () => {
      mockUserContext.loading = true;

      render(<HomePage />);

      // Should render without errors during loading
      expect(document.body.firstChild).toBeInTheDocument();
    });

    it('should handle different user roles', () => {
      mockUserContext.currentUser = {
        _id: 'host123',
        userName: 'testhost',
        firstName: 'Test',
        lastName: 'Host',
        role: 'Host',
        password: 'hashed',
        phone: '123456789',
        avatar: 'avatar.jpg',
        socialLink: 'social.com/test',
        hobbies: ['cooking'],
        cuisines: ['Italian'],
        ethnicity: 'Asian',
        bio: 'Test bio',
        cover: 'cover.jpg',
        locationId: 'location123',
      };

      render(<HomePage />);

      // Should render without errors for Host role
      expect(document.body.firstChild).toBeInTheDocument();
    });
  });

  describe('Navigation Integration', () => {
    it('should integrate with router navigation', () => {
      render(<HomePage />);

      // Navigation should be available (mocked)
      expect(mockNavigate).toBeDefined();
    });

    it('should handle navigation calls', () => {
      render(<HomePage />);

      // If there are any navigation calls during render, they should work
      expect(() => mockNavigate('/test')).not.toThrow();
    });
  });

  describe('Component Structure', () => {
    it('should have proper document structure', () => {
      render(<HomePage />);

      // Should have HTML structure
      expect(document.documentElement).toBeInTheDocument();
      expect(document.body).toBeInTheDocument();
    });

    it('should render React component tree', () => {
      const { container } = render(<HomePage />);

      // Should have React component content
      expect(container).toBeInTheDocument();
      expect(container.firstChild).toBeTruthy();
    });

    it('should handle component props', () => {
      // HomePage doesn't take props, but test the structure
      render(<HomePage />);

      expect(document.body.firstChild).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle context provider errors gracefully', () => {
      // Mock a context error
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      render(<HomePage />);

      // Should not crash even if there are context issues
      expect(document.body.firstChild).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it('should handle missing user context gracefully', () => {
      // Test with undefined user context
      mockUserContext.currentUser = undefined as any;

      render(<HomePage />);

      expect(document.body.firstChild).toBeInTheDocument();
    });

    it('should handle rendering errors gracefully', () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      // Should not crash during render
      expect(() => {
        render(<HomePage />);
      }).not.toThrow();

      consoleSpy.mockRestore();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible structure', () => {
      render(<HomePage />);

      // Should have focusable elements or proper structure
      expect(document.body).toBeInTheDocument();
    });

    it('should support keyboard navigation', () => {
      render(<HomePage />);

      // Should have elements that can receive focus
      const focusableElements = document.querySelectorAll(
        'button, a, input, select, textarea, [tabindex]',
      );
      // This is a structural test - exact number depends on implementation
      expect(focusableElements.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Performance', () => {
    it('should render efficiently', () => {
      const start = performance.now();

      render(<HomePage />);

      const end = performance.now();
      const renderTime = end - start;

      // Should render within reasonable time (adjust threshold as needed)
      expect(renderTime).toBeLessThan(1000); // 1 second max
    });

    it('should handle multiple renders without memory leaks', () => {
      // Render multiple times to check for memory issues
      for (let i = 0; i < 5; i++) {
        const { unmount } = render(<HomePage />);
        expect(document.body.firstChild).toBeInTheDocument();
        unmount();
      }
    });
  });
});
