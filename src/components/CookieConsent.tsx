"use client";
import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const hasConsented = localStorage.getItem('cookie-consent');
    if (!hasConsented) {
      // Small delay to allow page to load before showing popup
      setTimeout(() => {
        setShowConsent(true);
        setIsVisible(true);
      }, 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
    // Wait for animation to complete before hiding
    setTimeout(() => setShowConsent(false), 300);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
    // Wait for animation to complete before hiding
    setTimeout(() => setShowConsent(false), 300);
  };

  if (!showConsent) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      />
      
      {/* Cookie Consent Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className={`bg-white rounded-lg shadow-xl max-w-md w-full mx-auto transform transition-all duration-300 ${
            isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
        >
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="ml-3 text-lg font-medium text-gray-900">
                Cookie Notice
              </h3>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-3">
                Monkey LoveStack uses cookies to enhance your browsing experience, provide personalized content, 
                and analyze our traffic. We also use cookies to remember your chat preferences and improve our services.
              </p>
              <p className="text-sm text-gray-600">
                By clicking &quot;Accept All&quot;, you consent to our use of cookies. You can manage your preferences 
                or learn more about our cookie policy in our{' '}
                <a href="/privacy-policy" className="text-blue-600 hover:text-blue-700 underline">
                  Privacy Policy
                </a>.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAccept}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Accept All
              </button>
              <button
                onClick={handleDecline}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Decline
              </button>
            </div>
            
            <div className="mt-3 text-center">
              <a 
                href="/privacy-policy" 
                className="text-xs text-gray-500 hover:text-gray-700 underline"
              >
                Learn more about our cookie policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
