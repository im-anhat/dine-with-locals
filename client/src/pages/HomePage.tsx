import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Star,
  Shield,
  Zap,
  Users,
  CheckCircle,
  Play,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: 'Lightning Fast',
      description:
        'Built for speed and performance with modern technology stack',
    },
    {
      icon: <Shield className="h-8 w-8 text-green-500" />,
      title: 'Secure by Design',
      description: 'Enterprise-grade security to protect your data and privacy',
    },
    {
      icon: <Users className="h-8 w-8 text-purple-500" />,
      title: 'Team Collaboration',
      description: 'Work together seamlessly with powerful collaboration tools',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Product Manager',
      content:
        'This platform has transformed how our team works together. Absolutely incredible!',
      rating: 5,
      avatar: '/api/placeholder/40/40',
    },
    {
      name: 'Michael Chen',
      role: 'Developer',
      content:
        "The best tool I've used in years. Clean, fast, and incredibly intuitive.",
      rating: 5,
      avatar: '/api/placeholder/40/40',
    },
    {
      name: 'Emily Davis',
      role: 'Designer',
      content:
        'Beautiful interface and powerful features. Everything I need in one place.',
      rating: 5,
      avatar: '/api/placeholder/40/40',
    },
  ];

  const stats = [
    { number: '10K+', label: 'Happy Users' },
    { number: '50K+', label: 'Projects Created' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'Support' },
  ];

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2 gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg m-4">
              <img
                src="/logo.svg"
                alt="Local Taste Logo"
                className="h-8 w-8 ml-2"
              />
            </div>
            <span className="text-xl font-bold">Local Taste</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button onClick={() => navigate('/signup')}>Sign up</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-24 text-center">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Make your experience{' '}
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Memorable
            </span>{' '}
            Today
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Discover authentic local flavors and create unforgettable dining
            experiences. Join thousands of food lovers already exploring the
            best local cuisine.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              onClick={() => navigate('/signup')}
              className="group"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="group">
              <Play className="mr-2 h-4 w-4" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/50 py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium">
            Features
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Why Choose Local Taste?
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful features designed to help you discover and enjoy local
            cuisine
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="group transition-all hover:shadow-lg">
              <CardHeader>
                <div className="mb-2 transition-transform group-hover:scale-110">
                  {feature.icon}
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-muted/50 py-24">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium">
              Testimonials
            </div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Loved by Food Enthusiasts
            </h2>
            <p className="text-lg text-muted-foreground">
              See what our community has to say about their local taste
              experiences
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-6xl gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage
                        src={testimonial.avatar}
                        alt={testimonial.name}
                      />
                      <AvatarFallback>
                        {testimonial.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">
                        {testimonial.name}
                      </CardTitle>
                      <CardDescription>{testimonial.role}</CardDescription>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    "{testimonial.content}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-24">
        <Card className="mx-auto max-w-4xl bg-gradient-to-r from-primary to-purple-600 text-primary-foreground">
          <CardContent className="p-12 text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Ready to Explore Local Flavors?
            </h2>
            <p className="mb-8 text-lg opacity-90">
              Join thousands of food lovers already discovering amazing local
              restaurants and hidden gems.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/signup')}
              >
                Start Free Trial
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Contact Us
              </Button>
            </div>
          </CardContent>
        </Card>
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
