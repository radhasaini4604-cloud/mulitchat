import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './navigation.ts'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext'
import { initUniversalEmojiObserver } from './utils/emoji'

// Initialize Mac-style 3D glossy emoji renderer for the whole website
initUniversalEmojiObserver();

// Universal scroll state handler: adds 'is-scrolling' class while an element is being scrolled
if (typeof window !== 'undefined') {
  const scrollTimers = new WeakMap<Element, number>();

  window.addEventListener(
    'scroll',
    (e) => {
      const target = e.target as Element;
      if (!target || !(target instanceof Element)) return;

      target.classList.add('is-scrolling');

      const existingTimer = scrollTimers.get(target);
      if (existingTimer) {
        window.clearTimeout(existingTimer);
      }

      const newTimer = window.setTimeout(() => {
        target.classList.remove('is-scrolling');
        scrollTimers.delete(target);
      }, 1000);

      scrollTimers.set(target, newTimer);
    },
    { capture: true, passive: true }
  );
}


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)

