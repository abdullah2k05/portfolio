import { useEffect } from 'react';

const SITE_URL = 'https://mabdullah.top';
const DEFAULT_OG_IMAGE = 'https://mabdullah.top/og-image.png';

const DEFAULTS = {
  title: 'Muhammad Abdullah | AI Automation Engineer & Data Science Specialist',
  description:
    'Muhammad Abdullah — AI Automation Engineer & Data Science Specialist. Portfolio showcasing AI workflows, backend development, and data science projects.',
  keywords:
    'AI, automation, data science, full-stack developer, portfolio, MERN, Next.js, Python, React, TypeScript',
  robots: 'index, follow',
  ogTitle: 'Muhammad Abdullah | AI Automation Engineer & Data Science Specialist',
  ogDescription:
    'Portfolio showcasing AI workflows, backend development, and data science projects.',
  ogImage: DEFAULT_OG_IMAGE,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Muhammad Abdullah | AI Automation Engineer & Data Science Specialist',
  twitterDescription:
    'Portfolio showcasing AI workflows, backend development, and data science projects.',
  twitterImage: DEFAULT_OG_IMAGE,
  canonical: SITE_URL,
};

function setMetaTag(name, content) {
  if (!content) return;
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setMetaProperty(property, content) {
  if (!content) return;
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLinkRel(rel, href) {
  if (!href) return;
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function removeStructuredData() {
  document.querySelectorAll('script[type="application/ld+json"]').forEach((el) => {
    if (el.dataset.seo === 'true') el.remove();
  });
}

function addStructuredData(data) {
  removeStructuredData();
  if (!data) return;
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.dataset.seo = 'true';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

export default function useSEO(opts = {}) {
  const {
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    ogImage,
    ogType,
    twitterCard,
    twitterTitle,
    twitterDescription,
    twitterImage,
    canonical,
    robots,
    structuredData,
  } = opts;

  useEffect(() => {
    const path = window.location.pathname;
    const url = canonical || `${SITE_URL}${path === '/' ? '' : path}`;
    const img = ogImage || DEFAULT_OG_IMAGE;
    const ogt = ogTitle || title || DEFAULTS.ogTitle;
    const ogd = ogDescription || description || DEFAULTS.ogDescription;
    const tt = twitterTitle || ogt || DEFAULTS.twitterTitle;
    const td = twitterDescription || ogd || DEFAULTS.twitterDescription;

    document.title = title || DEFAULTS.title;
    setMetaTag('description', description || DEFAULTS.description);
    setMetaTag('keywords', keywords || DEFAULTS.keywords);
    setMetaTag('robots', robots || DEFAULTS.robots);
    setLinkRel('canonical', url);

    setMetaProperty('og:title', ogt);
    setMetaProperty('og:description', ogd);
    setMetaProperty('og:image', img);
    setMetaProperty('og:url', url);
    setMetaProperty('og:type', ogType || DEFAULTS.ogType);

    setMetaTag('twitter:card', twitterCard || DEFAULTS.twitterCard);
    setMetaTag('twitter:title', tt);
    setMetaTag('twitter:description', td);
    setMetaTag('twitter:image', img);

    if (structuredData && Array.isArray(structuredData)) {
      structuredData.forEach((d) => addStructuredData(d));
    } else {
      addStructuredData(structuredData);
    }

    return () => {
      document.title = DEFAULTS.title;
      setMetaTag('description', DEFAULTS.description);
      setMetaTag('keywords', DEFAULTS.keywords);
      setMetaTag('robots', DEFAULTS.robots);
      setLinkRel('canonical', SITE_URL);

      setMetaProperty('og:title', DEFAULTS.ogTitle);
      setMetaProperty('og:description', DEFAULTS.ogDescription);
      setMetaProperty('og:image', DEFAULTS.ogImage);
      setMetaProperty('og:url', SITE_URL);
      setMetaProperty('og:type', DEFAULTS.ogType);

      setMetaTag('twitter:card', DEFAULTS.twitterCard);
      setMetaTag('twitter:title', DEFAULTS.twitterTitle);
      setMetaTag('twitter:description', DEFAULTS.twitterDescription);
      setMetaTag('twitter:image', DEFAULTS.twitterImage);

      removeStructuredData();
    };
  }, [
    title, description, keywords,
    ogTitle, ogDescription, ogImage, ogType,
    twitterCard, twitterTitle, twitterDescription, twitterImage,
    canonical, robots, structuredData,
  ]);
}
