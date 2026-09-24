import React, { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  ogImage?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'PeakShield Roofing - Stronger Roofs. Stronger Homes. Built to Last.',
  description = 'Professional roofing solutions using quality materials, skilled craftsmanship, and dependable service. 15+ years of trusted experience in Colorado.',
  ogImage = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
}) => {
  useEffect(() => {
    document.title = title;

    const setMeta = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const setOgMeta = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', property);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    setMeta('description', description);
    setOgMeta('og:title', title);
    setOgMeta('og:description', description);
    setOgMeta('og:image', ogImage);
  }, [title, description, ogImage]);

  return null;
};
