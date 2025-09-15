"use client";

import { useEffect } from "react";
import Image from "next/image";

export function PerformanceOptimizer() {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      try {
        // Preload critical images
        const imageLink = document.createElement('link');
        imageLink.rel = 'preload';
        imageLink.href = '/images/open-graph.png';
        imageLink.as = 'image';
        document.head.appendChild(imageLink);
      } catch (error) {
        console.warn('Failed to preload resources:', error);
      }
    };

    // Optimize images loading
    const optimizeImageLoading = () => {
      const images = document.querySelectorAll('img[data-src]');
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src || '';
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach((img) => imageObserver.observe(img));
    };

    // Add performance monitoring
    const addPerformanceMonitoring = () => {
      // Monitor Core Web Vitals
      import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
        onCLS((metric) => console.log('CLS:', metric));
        onINP((metric) => console.log('INP:', metric));
        onFCP((metric) => console.log('FCP:', metric));
        onLCP((metric) => console.log('LCP:', metric));
        onTTFB((metric) => console.log('TTFB:', metric));
      }).catch((error) => {
        console.warn('Web Vitals not available:', error);
      });

      // Monitor page load time
      window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`Page load time: ${loadTime.toFixed(2)}ms`);
      });
    };

    // Initialize optimizations
    preloadCriticalResources();
    optimizeImageLoading();
    addPerformanceMonitoring();

    // Cleanup
    return () => {
      // Cleanup if needed
    };
  }, []);

  return null;
}

// SEO-friendly image component
interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  className, 
  priority = false 
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width || 800}
      height={height || 600}
      className={className}
      priority={priority}
      style={{
        contentVisibility: 'auto',
        containIntrinsicSize: width && height ? `${width}px ${height}px` : undefined,
      }}
    />
  );
}

// SEO-friendly link component
interface OptimizedLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  prefetch?: boolean;
}

export function OptimizedLink({ 
  href, 
  children, 
  className, 
  prefetch = true 
}: OptimizedLinkProps) {
  return (
    <a
      href={href}
      className={className}
      rel={prefetch ? 'prefetch' : undefined}
      aria-label={typeof children === 'string' ? children : undefined}
    >
      {children}
    </a>
  );
}
