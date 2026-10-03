import { SiteSettings, WebsitePage } from '../types';

export const getInitialSettings = (pg?: WebsitePage): SiteSettings => {
  return (
    pg?.siteSettings || {
      title: pg?.title || 'My High-Conversion Website',
      description: 'A modern, responsive, high-performance website created with Visual HTML Editor.',
      keywords: 'visual editor, web design, responsive, html generator, modern ui',
      author: 'Visual HTML Editor',
      robots: 'index, follow',
      canonicalUrl: '',
      language: 'en',
      ogTitle: pg?.title || 'My High-Conversion Website',
      ogDescription: 'Experience modern, elegant web solutions designed for high conversion.',
      ogImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      ogType: 'website',
      ogSiteName: 'Visual Website Studio',
      twitterCard: 'summary_large_image',
      twitterHandle: '@visualeditor',
      jsonSchemaType: 'Organization',
      faviconUrl: '',
      appleTouchIcon: '',
      themeColor: '#4f46e5',
      headScripts: '',
      footerScripts: '',
    }
  );
};

export const generateSchemaJson = (formData: SiteSettings): string => {
  if (formData.jsonSchemaType === 'Custom' && formData.customJsonSchema) {
    return formData.customJsonSchema;
  }
  if (formData.jsonSchemaType === 'Organization') {
    return JSON.stringify(
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: formData.ogSiteName || formData.title || 'Organization Name',
        url: formData.canonicalUrl || 'https://example.com',
        logo: formData.faviconUrl || '',
        description: formData.description || '',
        sameAs: [
          formData.twitterHandle ? `https://twitter.com/${formData.twitterHandle.replace('@', '')}` : '',
        ].filter(Boolean),
      },
      null,
      2
    );
  }
  if (formData.jsonSchemaType === 'LocalBusiness') {
    return JSON.stringify(
      {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: formData.title || 'Business Name',
        image: formData.ogImage || '',
        url: formData.canonicalUrl || 'https://example.com',
        telephone: '+1-555-019-2834',
        priceRange: '$$',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '100 Innovation Way',
          addressLocality: 'San Francisco',
          addressRegion: 'CA',
          postalCode: '94105',
          addressCountry: 'US',
        },
      },
      null,
      2
    );
  }
  if (formData.jsonSchemaType === 'Article') {
    return JSON.stringify(
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: formData.title || 'Article Headline',
        image: [formData.ogImage || ''],
        author: {
          '@type': 'Person',
          name: formData.author || 'Author',
        },
        publisher: {
          '@type': 'Organization',
          name: formData.ogSiteName || 'Publisher',
          logo: {
            '@type': 'ImageObject',
            url: formData.faviconUrl || '',
          },
        },
        description: formData.description || '',
      },
      null,
      2
    );
  }
  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: formData.title || 'My Website',
      url: formData.canonicalUrl || 'https://example.com',
      description: formData.description || '',
    },
    null,
    2
  );
};
