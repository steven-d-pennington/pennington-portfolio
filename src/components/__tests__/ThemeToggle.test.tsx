import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from '../ThemeToggle';

// Mock the ThemeProvider hook
const mockToggleTheme = jest.fn();
const mockUseTheme = jest.fn();

jest.mock('../ThemeProvider', () => ({
  useTheme: () => mockUseTheme(),
}));

describe('ThemeToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render placeholder when not mounted', () => {
    mockUseTheme.mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
      mounted: false,
    });

    render(<ThemeToggle />);
    
    const button = screen.getByRole('button', { name: 'Theme toggle' });
    expect(button).toBeInTheDocument();
    
    // Should have placeholder div instead of icon
    const placeholder = button.querySelector('div');
    expect(placeholder).toHaveClass('w-5 h-5');
  });

  it('should render light mode icon when theme is light', () => {
    mockUseTheme.mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
      mounted: true,
    });

    render(<ThemeToggle />);
    
    const button = screen.getByRole('button', { name: 'Switch to dark mode' });
    expect(button).toBeInTheDocument();
    
    // Should have moon icon (for switching to dark mode)
    const moonIcon = button.querySelector('svg path[d*="M20.354 15.354A9 9 0 018.646 3.646"]');
    expect(moonIcon).toBeInTheDocument();
  });

  it('should render dark mode icon when theme is dark', () => {
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      toggleTheme: mockToggleTheme,
      mounted: true,
    });

    render(<ThemeToggle />);
    
    const button = screen.getByRole('button', { name: 'Switch to light mode' });
    expect(button).toBeInTheDocument();
    
    // Should have sun icon (for switching to light mode)
    const sunIcon = button.querySelector('svg path[d*="M12 3v1m0 16v1m9-9h-1M4 12H3"]');
    expect(sunIcon).toBeInTheDocument();
  });

  it('should call toggleTheme when clicked and mounted', () => {
    mockUseTheme.mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
      mounted: true,
    });

    render(<ThemeToggle />);
    
    const button = screen.getByRole('button', { name: 'Switch to dark mode' });
    fireEvent.click(button);
    
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('should not call toggleTheme when clicked and not mounted', () => {
    mockUseTheme.mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
      mounted: false,
    });

    render(<ThemeToggle />);
    
    const button = screen.getByRole('button', { name: 'Theme toggle' });
    fireEvent.click(button);
    
    // Should not call toggleTheme since button doesn't have onClick when not mounted
    expect(mockToggleTheme).toHaveBeenCalledTimes(0);
  });

  it('should have correct accessibility attributes', () => {
    mockUseTheme.mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
      mounted: true,
    });

    render(<ThemeToggle />);
    
    const button = screen.getByRole('button', { name: 'Switch to dark mode' });
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
  });

  it('should have hover styles applied', () => {
    mockUseTheme.mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
      mounted: true,
    });

    render(<ThemeToggle />);
    
    const button = screen.getByRole('button', { name: 'Switch to dark mode' });
    expect(button).toHaveClass('hover:bg-gray-200', 'dark:hover:bg-gray-700', 'transition-colors');
  });
});