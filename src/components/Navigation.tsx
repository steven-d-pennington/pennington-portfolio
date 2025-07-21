'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { ThemeToggle } from './ThemeToggle';
import { useUser, useAuthActions } from './AuthProvider';
import AuthModal from './AuthModal';
import SecondaryNavigation from './SecondaryNavigation';
import { navigationConfig, NavigationCategory } from '@/types/navigation';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const pathname = usePathname();
  
  const { user, userProfile, loading } = useUser();
  const { signOut } = useAuthActions();

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (!error) {
        // Redirect to home page after successful sign out
        window.location.href = '/?auth_success=signed_out';
      } else {
        console.error('Sign out error:', error);
        // Show error to user via URL params for AuthErrorHandler
        window.location.href = '/?auth_error=server_error&message=Failed to sign out. Please try again.';
      }
    } catch (err) {
      console.error('Unexpected sign out error:', err);
      window.location.href = '/?auth_error=server_error&message=An unexpected error occurred during sign out.';
    }
    setIsUserMenuOpen(false);
  };

  const openAuthModal = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  // Get navigation items from config
  const primaryNavItems = navigationConfig.primary;
  const protectedNavItems = navigationConfig.protected || [];
  
  // Combine nav items based on user authentication (used in mobile navigation)
  // const allNavItems = user ? [...primaryNavItems, ...protectedNavItems] : primaryNavItems;

  const isActive = (href: string) => pathname === href || pathname.startsWith(href);
  
  // Find current category for secondary navigation
  const getCurrentCategory = (): NavigationCategory | null => {
    return primaryNavItems.find(category => {
      if (!category.children || category.children.length === 0) return false;
      
      // Check if current path matches category or any of its children
      if (pathname === category.href) return true;
      if (pathname.startsWith(category.href + '/')) return true;
      
      // Check if current path matches any child routes
      return category.children.some(child => 
        pathname === child.href || pathname.startsWith(child.href + '/')
      );
    }) || null;
  };

  const currentCategory = getCurrentCategory();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 relative w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20 lg:h-24">
          <div className="flex-shrink-0 flex items-center min-w-0">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/lovestack-trans.png"
                alt="Monkey LoveStack Logo"
                width={48}
                height={48}
                className="h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16"
                priority
              />
              <div className="flex flex-col min-w-0">
                <div className="flex items-baseline">
                  <span className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 whitespace-nowrap">Monkey</span>
                  <span className="text-base sm:text-lg lg:text-xl font-bold text-blue-600 ml-1 whitespace-nowrap">LoveStack</span>
                </div>
                <span className="text-xs text-gray-600 leading-tight hidden sm:block whitespace-nowrap">Engineering cloud solutions</span>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center space-x-8">
            {primaryNavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Protected items for authenticated users */}
            {user && protectedNavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            <ThemeToggle />
            
            {/* Authentication Section */}
            {loading ? (
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            ) : user ? (
              /* User Menu */
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {userProfile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </div>
                  <svg className={`w-4 h-4 text-gray-500 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                      <div className="font-medium">{userProfile?.full_name || 'User'}</div>
                      <div className="text-gray-500">{user.email}</div>
                    </div>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Account Dashboard
                    </Link>
                    {userProfile?.role && ['client', 'admin', 'team_member'].includes(userProfile.role) && (
                      <Link
                        href="/dashboard/projects"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Project Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Auth Buttons */
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button and theme toggle */}
          <div className="xl:hidden flex items-center space-x-1 flex-shrink-0">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="block h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="xl:hidden absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-lg z-40">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {/* Primary Navigation Items */}
            {primaryNavItems.map((category) => (
              <div key={category.name}>
                <Link
                  href={category.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(category.href)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
                
                {/* Sub-items for categories with children */}
                {category.children && (
                  <div className="ml-4 mt-1 space-y-1">
                    {category.children.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className={`block px-3 py-1 text-sm transition-colors ${
                          isActive(subItem.href)
                            ? 'text-blue-600'
                            : 'text-gray-600 hover:text-blue-600'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {/* Protected items for authenticated users */}
            {user && protectedNavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile Auth Section */}
            <div className="border-t border-gray-200 pt-3 mt-3">
              {loading ? (
                <div className="flex justify-center py-2">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : user ? (
                <div className="space-y-1">
                  <div className="px-3 py-2 text-base font-medium text-gray-700 border-b border-gray-200">
                    <div className="font-medium">{userProfile?.full_name || 'User'}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                  <Link
                    href="/profile"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile Settings
                  </Link>
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      openAuthModal('login');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      openAuthModal('signup');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authMode}
      />
      
      {/* Secondary Navigation */}
      {currentCategory && (
        <SecondaryNavigation 
          category={currentCategory} 
          isVisible={!isMenuOpen}
        />
      )}
    </nav>
  );
} 