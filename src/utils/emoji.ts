/**
 * Universal Authentic Apple / Mac 3D Emoji Renderer and DOM Observer
 * Replaces standard Unicode emojis across the entire web application
 * with genuine 100% official 3D Apple macOS / iOS high-res emoji graphics.
 */

// Precise ES2018 Unicode Extended_Pictographic regex (matches true emojis only, never apostrophes or quotes)
const EMOJI_REGEX = /\p{Extended_Pictographic}/gu;

/**
 * Converts a Unicode emoji char into exact Apple datasource hex codepoint format.
 */
export function emojiToHex(emoji: string): string {
  const codePoints: string[] = [];
  for (const char of emoji) {
    const hex = char.codePointAt(0)!.toString(16);
    if (hex !== 'fe0f') { // strip variation selector-16 for exact filename matching
      codePoints.push(hex);
    }
  }
  return codePoints.join('-');
}

/**
 * Get authentic 100% genuine Apple iOS/macOS 3D PNG emoji URL.
 */
export function getAppleEmojiUrl(emoji: string): string {
  const hex = emojiToHex(emoji);
  return `https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.0.1/img/apple/64/${hex}.png`;
}

/**
 * Parse plain text and replace Unicode emojis with HTML <img> elements rendering genuine Apple 3D emojis.
 */
export function parseEmojisToAppleHtml(text: string): string {
  if (!text) return text;
  return text.replace(EMOJI_REGEX, (emoji) => {
    const url = getAppleEmojiUrl(emoji);
    return `<img class="apple-emoji" src="${url}" alt="${emoji}" draggable="false" loading="lazy" onerror="this.replaceWith(this.getAttribute('alt') || '')" />`;
  });
}

/**
 * Replace emojis in text nodes within a container DOM element.
 */
export function replaceEmojisInNode(node: Node): void {
  if (node.nodeType === Node.TEXT_NODE) {
    const val = node.nodeValue;
    if (!val || !/\p{Extended_Pictographic}/u.test(val)) return;

    const parent = node.parentElement;
    if (!parent) return;

    const tag = parent.tagName.toLowerCase();
    if (['input', 'textarea', 'script', 'style', 'code', 'pre', 'noscript'].includes(tag)) return;
    if (parent.classList.contains('apple-emoji') || parent.classList.contains('apple-emoji-wrapper')) return;

    const span = document.createElement('span');
    span.className = 'apple-emoji-wrapper';
    span.innerHTML = parseEmojisToAppleHtml(val);
    parent.replaceChild(span, node);
    return;
  }

  if (node.nodeType === Node.ELEMENT_NODE) {
    const element = node as HTMLElement;
    const tag = element.tagName ? element.tagName.toLowerCase() : '';
    if (['input', 'textarea', 'script', 'style', 'code', 'pre', 'noscript'].includes(tag)) return;
    if (element.classList && (element.classList.contains('apple-emoji') || element.classList.contains('apple-emoji-wrapper'))) return;

    Array.from(node.childNodes).forEach(replaceEmojisInNode);
  }
}

/**
 * Initialize universal MutationObserver for live DOM emoji replacements across the whole web app.
 */
export function initUniversalEmojiObserver(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((addedNode) => {
          replaceEmojisInNode(addedNode);
        });
      } else if (mutation.type === 'characterData') {
        if (mutation.target) {
          replaceEmojisInNode(mutation.target);
        }
      }
    }
  });

  const startObserving = () => {
    replaceEmojisInNode(document.body);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startObserving);
  } else {
    startObserving();
  }
}
