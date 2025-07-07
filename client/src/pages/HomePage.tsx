import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FilterResults from '@/components/filter/FilterResult';

export default function HomePage() {
  const navigate = useNavigate();
  const [featuredListings, setFeaturedListings] = useState([]);

  useEffect(() => {
    const fetchFeaturedListings = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}api/listing/nearby`,
        {
          params: {
            lat: 41.885202, // ea
            lng: -87.636092,
            distance: 80, // Example distance in km
          },
        },
      );
      setFeaturedListings(res.data.slice(0, 3)); // Limit to 3 featured listings
    };
    fetchFeaturedListings();
  }, []);

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-1 w-full h-20 border-b px-4 flex items-center justify-between bg-background">
        <img src="/logo.svg" alt="Local Taste Logo" className="w-12 h-12" />
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => navigate('/login')}>
            Login
          </Button>
          <Button onClick={() => navigate('/signup')}>Sign up</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-8 lg:py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Image - First on mobile, second on desktop */}
            <div className=" order-1 lg:order-2">
              <div className="overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src="https://res.cloudinary.com/disvrqxe2/image/upload/v1751821229/cu5n4my0dxkkg5b0ezq4.avif"
                  alt="People enjoying local dining experience together"
                  className="w-full h-auto object-cover"
                />
              </div>
              {/* Optional decorative elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
            </div>

            {/* Text content - Second on mobile, first on desktop */}
            <div className="space-y-6 order-2 lg:order-1">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                <span className="text-foreground">Authentic</span>{' '}
                <span className="text-primary">flavors,</span>
                <br />
                <span className="text-foreground">Genuine</span>{' '}
                <span className="text-primary">connections</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                Connect with locals authentically via cuisine. Discover hidden
                gems, experience traditional flavors, and create meaningful
                connections through food in your community.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Button
                  size="lg"
                  onClick={() => navigate('/signup')}
                  className="text-lg px-8 py-6"
                >
                  Get started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6"
                >
                  How does it work?
                  <Play className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Interested in hosting?{' '}
                <button className="underline hover:text-foreground transition-colors">
                  Learn more
                </button>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="lg:p-16 px-8 py-8">
        <div className="">
          <div className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight sm:text-4xl mb-4">
              Featured Dining Experiences
            </h2>
            <p className="text-lg text-muted-foreground">
              Discover authentic local dining experiences hosted by passionate
              food lovers in your community
            </p>
          </div>
          <FilterResults results={featuredListings} />
          <div className="mt-8">
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/signup')}
              className="text-lg px-8 py-3"
            >
              View All Experiences
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg">
                <img
                  src="/logo.svg"
                  alt="Local Taste Logo"
                  className="h-8 w-8"
                />
              </div>
              <span className="text-xl font-bold">Local Taste</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Local Taste. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
