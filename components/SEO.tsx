
import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
}

const SEO: React.FC<SEOProps> = ({ title, description, image, url }) => {
  useEffect(() => {
    // 1. Update Title
    document.title = `${title} | Phallbun`;

    // 2. Update Meta Description
    let metaDesc = document.querySelector("meta[name='description']");
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description || 'Premium online shopping experience.');

    // 3. Update Open Graph (Facebook/LinkedIn)
    const updateMeta = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property='${property}']`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    updateMeta('og:title', title);
    updateMeta('og:description', description || '');
    if (image) updateMeta('og:image', image);
    if (url) updateMeta('og:url', url);

    // 4. Update Twitter Card
    const updateNameMeta = (name: string, content: string) => {
        let tag = document.querySelector(`meta[name='${name}']`);
        if (!tag) {
          tag = document.createElement('meta');
          tag.setAttribute('name', name);
          document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
    };
    
    updateNameMeta('twitter:card', 'summary_large_image');
    updateNameMeta('twitter:title', title);
    updateNameMeta('twitter:description', description || '');
    if (image) updateNameMeta('twitter:image', image);

  }, [title, description, image, url]);

  return null;
};

export default SEO;
