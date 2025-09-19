// Google Analytics utility functions
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const GA_TRACKING_ID = 'G-NQBLNWPK2M';

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Track custom events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track download events
export const trackDownload = (videoUrl: string, filename: string) => {
  event({
    action: 'download',
    category: 'video',
    label: filename,
  });
};

// Track search events
export const trackSearch = (postUrl: string) => {
  event({
    action: 'search',
    category: 'engagement',
    label: 'instagram_url',
  });
};

// Track error events
export const trackError = (error: string, context: string) => {
  event({
    action: 'error',
    category: 'technical',
    label: `${context}: ${error}`,
  });
};
