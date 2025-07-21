'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavigationCategory } from '@/types/navigation';

interface SecondaryNavigationProps {
  category: NavigationCategory;
  isVisible: boolean;
}

export default function SecondaryNavigation({ category, isVisible }: SecondaryNavigationProps) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isVisible || !category.children || category.children.length === 0) {
    return null;
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href);

  return (
    <>
      {/* Desktop Secondary Navigation */}
      <div className="hidden lg:block bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center space-x-8 py-3">
            <span className="text-sm font-medium text-gray-600">
              {category.name}:
            </span>
            {category.children.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Secondary Navigation */}
      <div className="lg:hidden bg-gray-50 border-t border-gray-200">
        <div className="px-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full py-3 text-left"
          >
            <span className="text-sm font-medium text-gray-700">
              {category.name} Options
            </span>
            <svg 
              className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isExpanded && (
            <div className="pb-3 space-y-1">
              {category.children.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive(item.href)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsExpanded(false)}
                >
                  {item.name}
                  {item.description && (
                    <span className="block text-xs text-gray-500 mt-1">
                      {item.description}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}