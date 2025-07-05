import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SidebarProvider } from '../src/components/ui/sidebar';

// Test wrapper components for providers
export const TestWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <BrowserRouter>
    <SidebarProvider>{children}</SidebarProvider>
  </BrowserRouter>
);

// Custom render function that includes providers
export const renderWithProviders = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: TestWrapper, ...options });

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { renderWithProviders as render };
