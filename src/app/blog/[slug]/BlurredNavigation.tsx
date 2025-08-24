'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function BlurredNavigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollOpacity, setScrollOpacity] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = 50;
      
      setIsScrolled(scrollY > threshold);
      
      // Calculate opacity based on scroll position for smooth transition
      const opacity = Math.min(scrollY / 100, 0.95);
      setScrollOpacity(opacity);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
      isScrolled 
        ? 'backdrop-blur-xl bg-white/80 border-b border-gray-200/50 shadow-sm' 
        : 'bg-transparent'
    }`}
    style={{
      backdropFilter: isScrolled ? 'blur(20px) saturate(180%)' : 'none',
      WebkitBackdropFilter: isScrolled ? 'blur(20px) saturate(180%)' : 'none',
      backgroundColor: `rgba(255, 255, 255, ${scrollOpacity * 0.8})`,
    }}>
      <div className="max-w-3xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link 
            href="/" 
            className={`text-lg font-semibold transition-all duration-300 hover:scale-105 ${
              isScrolled 
                ? 'text-gray-900 hover:text-primary-600' 
                : 'text-gray-900 hover:text-primary-600'
            }`}
          >
            Jinukeu Blog
          </Link>
        </div>
      </div>
      
      {/* Apple-style gradient line at bottom */}
      <div 
        className={`h-px bg-gradient-to-r from-transparent via-gray-300/60 to-transparent transition-opacity duration-300 ${
          isScrolled ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </nav>
  );
}