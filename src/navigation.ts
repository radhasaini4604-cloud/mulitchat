declare global {
  interface Window {
    navigate: (to: string) => void;
  }
}

export function navigate(to: string) {
  window.history.pushState({}, '', to);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

window.navigate = navigate;

// Intercept all document clicks on anchor links for client-side routing
document.addEventListener('click', (e) => {
  const target = (e.target as HTMLElement).closest('a');
  if (target && target.href) {
    try {
      const url = new URL(target.href);
      
      // Only handle links of the same origin
      if (url.origin === window.location.origin) {
        // Let the browser handle standard anchor scrolls on the same page (e.g., #features)
        if (url.hash && !url.hash.startsWith('#/')) {
          return;
        }

        let path = url.pathname;
        if (url.hash && url.hash.startsWith('#/')) {
          path = url.hash.substring(1);
        } else if (url.hash === '#' || url.hash === '#/') {
          path = '/';
        }

        // Only navigate client-side if it's not a new tab
        if (target.target !== '_blank') {
          e.preventDefault();
          window.navigate(path);
        }
      }
    } catch {
      // Ignore URL parsing errors
    }
  }
});
