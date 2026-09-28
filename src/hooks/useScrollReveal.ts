import { useEffect } from 'react';

/**
 * Gordonstoun luxury scroll reveal hook.
 * Uses IntersectionObserver to smoothly reveal elements with .reveal-on-scroll class.
 */
export function useScrollReveal(dependencies: unknown[] = []) {
  useEffect(() => {
    // Check if browser supports IntersectionObserver
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        el.classList.add('is-visible');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // Unobserve once revealed for performance
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    // Initial query
    const elements = document.querySelectorAll('.reveal-on-scroll:not(.is-visible)');
    elements.forEach((el) => observer.observe(el));

    // Handle dynamically mounted or updated elements
    const timeout = setTimeout(() => {
      document.querySelectorAll('.reveal-on-scroll:not(.is-visible)').forEach((el) => observer.observe(el));
    }, 400);

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, dependencies);
}
