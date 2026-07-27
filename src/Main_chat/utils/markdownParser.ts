import katex from 'katex';
import hljs from 'highlight.js';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function replaceAll(str: string, find: string, replace: string): string {
  return str.split(find).join(replace);
}

function formatMathLaTeX(math: string, isBlock: boolean): string {
  try {
    const decodedMath = math
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");

    return katex.renderToString(decodedMath, {
      displayMode: isBlock,
      throwOnError: false
    });
  } catch (error) {
    console.error("KaTeX error:", error);
    return math;
  }
}

function parseInlineStyles(text: string): string {
  let res = text;
  // Bold: **text**
  res = res.replace(/\*\*([\s\S]+?)\*\*/g, '<strong>$1</strong>');
  // Italic: *text*
  res = res.replace(/\*([\s\S]+?)\*/g, '<em>$1</em>');
  // Bold: __text__
  res = res.replace(/__([\s\S]+?)__/g, '<strong>$1</strong>');
  // Italic: _text_
  res = res.replace(/_([\s\S]+?)_/g, '<em>$1</em>');
  return res;
}

function getFileExtension(lang: string): string {
  const map: Record<string, string> = {
    javascript: 'js', js: 'js',
    typescript: 'ts', ts: 'ts',
    jsx: 'jsx', tsx: 'tsx',
    python: 'py', py: 'py',
    html: 'html', htm: 'htm',
    css: 'css',
    json: 'json',
    markdown: 'md', md: 'md',
    rust: 'rs', rs: 'rs',
    go: 'go',
    cpp: 'cpp', c: 'c',
    java: 'java',
    kotlin: 'kt', kt: 'kt',
    swift: 'swift',
    php: 'php',
    sql: 'sql',
    bash: 'sh', sh: 'sh',
    yaml: 'yaml', yml: 'yaml',
  };
  return map[lang.toLowerCase()] || 'txt';
}

function highlightCode(code: string, lang: string): string {
  const decoded = code
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  const cleanLang = (lang || '').toLowerCase().trim();
  if (['text', 'txt', 'markdown', 'md'].includes(cleanLang)) {
    return code;
  }

  try {
    if (cleanLang && hljs.getLanguage(cleanLang)) {
      return hljs.highlight(decoded, { language: cleanLang }).value;
    } else {
      return hljs.highlightAuto(decoded).value;
    }
  } catch (err) {
    console.error("Highlight.js error:", err);
    return code;
  }
}

export function parseMarkdown(text: string): string {
  const escapedText = escapeHtml(text);
  const codeBlocks: string[] = [];
  const inlineCodeBlocks: string[] = [];
  const mathBlocks: string[] = [];

  let textWithCodePlaceholders = escapedText;

  // Complete code blocks
  textWithCodePlaceholders = textWithCodePlaceholders.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, lang, code) => {
    const index = codeBlocks.length;
    const cleanLang = lang || 'code';
    const ext = getFileExtension(cleanLang);
    const highlighted = highlightCode(code.trim(), cleanLang);
    
    codeBlocks.push(
      `<div class="code-card-container">` +
        `<div class="code-card-header">` +
          `<div class="code-card-lang-wrapper">` +
            `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" strokeLinecap="round" strokeLinejoin="round" class="code-card-lang-icon"><path d="M12.034 12.681a.498.498 0 0 1 .647-.647l9 3.5a.5.5 0 0 1-.033.943l-3.444 1.068a1 1 0 0 0-.66.66l-1.067 3.443a.5.5 0 0 1-.943.033z"/><path d="M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6"/></svg>` +
            `<span class="code-card-lang">${cleanLang}</span>` +
          `</div>` +
          `<div class="code-card-actions">` +
            `<button class="code-card-action-btn code-card-download-btn" onclick="const text = this.closest('.code-card-container').querySelector('code').textContent; const blob = new Blob([text], {type: 'text/plain'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'code.' + '${ext}'; a.click(); URL.revokeObjectURL(url);" title="Download file">` +
              `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-download-icon lucide-download"><path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/></svg>` +
            `</button>` +
            `<button class="code-card-action-btn code-card-copy-btn" onclick="const text = this.closest('.code-card-container').querySelector('code').textContent; navigator.clipboard.writeText(text); const btn = this; btn.classList.add('copied'); setTimeout(() => btn.classList.remove('copied'), 2000);" title="Copy code">` +
              `<svg class="copy-svg" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-copy-icon lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>` +
              `<svg class="check-svg" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1" strokeLinecap="round" strokeLinejoin="round" style="display:none;"><polyline points="20 6 9 17 4 12"/></svg>` +
            `</button>` +
          `</div>` +
        `</div>` +
        `<pre class="code-block"><code class="language-${lang || 'text'}">${highlighted}</code></pre>` +
      `</div>`
    );
    return `CODEBLOCKPLACEHOLDER${index}`;
  });

  // Incomplete code blocks (streaming)
  textWithCodePlaceholders = textWithCodePlaceholders.replace(/```(\w*)\n([\s\S]*)$/g, (_match, lang, code) => {
    const index = codeBlocks.length;
    const cleanLang = lang || 'code';
    const ext = getFileExtension(cleanLang);
    const highlighted = highlightCode(code, cleanLang);
    
    codeBlocks.push(
      `<div class="code-card-container">` +
        `<div class="code-card-header">` +
          `<div class="code-card-lang-wrapper">` +
            `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" strokeLinecap="round" strokeLinejoin="round" class="code-card-lang-icon"><path d="M12.034 12.681a.498.498 0 0 1 .647-.647l9 3.5a.5.5 0 0 1-.033.943l-3.444 1.068a1 1 0 0 0-.66.66l-1.067 3.443a.5.5 0 0 1-.943.033z"/><path d="M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6"/></svg>` +
            `<span class="code-card-lang">${cleanLang}</span>` +
          `</div>` +
          `<div class="code-card-actions">` +
            `<button class="code-card-action-btn code-card-download-btn" onclick="const text = this.closest('.code-card-container').querySelector('code').textContent; const blob = new Blob([text], {type: 'text/plain'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'code.' + '${ext}'; a.click(); URL.revokeObjectURL(url);" title="Download file">` +
              `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-download-icon lucide-download"><path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/></svg>` +
            `</button>` +
            `<button class="code-card-action-btn code-card-copy-btn" onclick="const text = this.closest('.code-card-container').querySelector('code').textContent; navigator.clipboard.writeText(text); const btn = this; btn.classList.add('copied'); setTimeout(() => btn.classList.remove('copied'), 2000);" title="Copy code">` +
              `<svg class="copy-svg" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-copy-icon lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>` +
              `<svg class="check-svg" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1" strokeLinecap="round" strokeLinejoin="round" style="display:none;"><polyline points="20 6 9 17 4 12"/></svg>` +
            `</button>` +
          `</div>` +
        `</div>` +
        `<pre class="code-block"><code class="language-${lang || 'text'}">${highlighted}</code><span class="typing-cursor"></span></pre>` +
      `</div>`
    );
    return `CODEBLOCKPLACEHOLDER${index}`;
  });

  // Complete math blocks
  textWithCodePlaceholders = textWithCodePlaceholders.replace(/\$\$\n?([\s\S]*?)\n?\$\$/g, (_match, math) => {
    const index = mathBlocks.length;
    const processedMath = formatMathLaTeX(math, true);
    mathBlocks.push(processedMath);
    return `MATHBLOCKPLACEHOLDER${index}`;
  });

  textWithCodePlaceholders = textWithCodePlaceholders.replace(/\\\[\n?([\s\S]*?)\n?\\\]/g, (_match, math) => {
    const index = mathBlocks.length;
    const processedMath = formatMathLaTeX(math, true);
    mathBlocks.push(processedMath);
    return `MATHBLOCKPLACEHOLDER${index}`;
  });

  // Incomplete math blocks (streaming)
  textWithCodePlaceholders = textWithCodePlaceholders.replace(/\$\$\n?([\s\S]*)$/g, (_match, math) => {
    const index = mathBlocks.length;
    const processedMath = formatMathLaTeX(math, true);
    mathBlocks.push(processedMath);
    return `MATHBLOCKPLACEHOLDER${index}`;
  });

  // Inline math
  textWithCodePlaceholders = textWithCodePlaceholders.replace(/\$([^\$\n]+?)\$/g, (_match, math) => {
    const index = mathBlocks.length;
    const processedMath = formatMathLaTeX(math, false);
    mathBlocks.push(processedMath);
    return `MATHBLOCKPLACEHOLDER${index}`;
  });

  textWithCodePlaceholders = textWithCodePlaceholders.replace(/\\\(([\s\S]*?)\\\)/g, (_match, math) => {
    const index = mathBlocks.length;
    const processedMath = formatMathLaTeX(math, false);
    mathBlocks.push(processedMath);
    return `MATHBLOCKPLACEHOLDER${index}`;
  });

  // Inline code
  textWithCodePlaceholders = textWithCodePlaceholders.replace(/`([^`]+)`/g, (_match, code) => {
    const index = inlineCodeBlocks.length;
    // Check if the inline code content matches a standard file name pattern
    const isFileName = /\b[\w-]+\.(html|htm|css|js|ts|jsx|tsx|py|json|rs|go|sh|cpp|c|h|java|txt|md|yaml|yml)\b/i.test(code);
    const displayName = isFileName && !code.startsWith('/') && !code.startsWith('./') && !code.startsWith('../') ? `/${code}` : code;
    
    inlineCodeBlocks.push(`<code class="inline-code">${displayName}</code>`);
    return `INLINECODEPLACEHOLDER${index}`;
  });

  const lines = textWithCodePlaceholders.split('\n');
  const processedLines: string[] = [];
  let inList = false;
  let listType: 'ul' | 'ol' | null = null;
  let inTable = false;
  let tableHeaders: string[] = [];
  let tableRows: string[][] = [];
  
  // Accumulate text lines for a paragraph
  let paragraphBuffer: string[] = [];

  const flushParagraph = () => {
    if (paragraphBuffer.length > 0) {
      processedLines.push(`<p>${parseInlineStyles(paragraphBuffer.join(' '))}</p>`);
      paragraphBuffer = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // 1. Tables
    if (trimmed.startsWith('|') && trimmed.endsWith('|') && trimmed.length > 1) {
      flushParagraph();
      if (inList) {
        processedLines.push(listType === 'ul' ? '</ul>' : '</ol>');
        inList = false;
        listType = null;
      }

      const cells = line.split('|').map(c => c.trim()).slice(1, -1);
      const isSeparator = cells.every(c => /^:-*:?$/.test(c) || /^-+$/.test(c));

      if (isSeparator) {
        continue;
      }

      if (!inTable) {
        inTable = true;
        tableHeaders = cells;
        tableRows = [];
      } else {
        tableRows.push(cells);
      }
      continue;
    } else {
      if (inTable) {
        let tableHtml = '<div class="table-container"><table><thead><tr>';
        tableHeaders.forEach(h => {
          tableHtml += `<th>${parseInlineStyles(h)}</th>`;
        });
        tableHtml += '</tr></thead><tbody>';
        tableRows.forEach(row => {
          tableHtml += '<tr>';
          for (let j = 0; j < tableHeaders.length; j++) {
            tableHtml += `<td>${parseInlineStyles(row[j] || '')}</td>`;
          }
          tableHtml += '</tr>';
        });
        tableHtml += '</tbody></table></div>';
        processedLines.push(tableHtml);
        inTable = false;
        tableHeaders = [];
        tableRows = [];
      }
    }

    // 2. Lists
    const bulletMatch = line.match(/^(\s*)([*-+])\s+(.*)$/);
    const orderedMatch = line.match(/^(\s*)(\d+)\.\s+(.*)$/);

    if (bulletMatch) {
      flushParagraph();
      const content = bulletMatch[3];
      if (!inList || listType !== 'ul') {
        if (inList) {
          processedLines.push(listType === 'ul' ? '</ul>' : '</ol>');
        }
        processedLines.push('<ul>');
        inList = true;
        listType = 'ul';
      }
      processedLines.push(`<li>${parseInlineStyles(content)}</li>`);
      continue;
    } else if (orderedMatch) {
      flushParagraph();
      const content = orderedMatch[3];
      if (!inList || listType !== 'ol') {
        if (inList) {
          processedLines.push(listType === 'ul' ? '</ul>' : '</ol>');
        }
        processedLines.push('<ol>');
        inList = true;
        listType = 'ol';
      }
      processedLines.push(`<li>${parseInlineStyles(content)}</li>`);
      continue;
    } else {
      if (inList) {
        processedLines.push(listType === 'ul' ? '</ul>' : '</ol>');
        inList = false;
        listType = null;
      }
    }

    // 3. Headings
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph();
      const level = headingMatch[1].length;
      const content = headingMatch[2];
      processedLines.push(`<h${level}>${parseInlineStyles(content)}</h${level}>`);
      continue;
    }

    // 4. Blockquote
    if (trimmed.startsWith('&gt;') || trimmed.startsWith('>')) {
      flushParagraph();
      const content = trimmed.replace(/^(&gt;|>)\s?/, '');
      processedLines.push(`<blockquote>${parseInlineStyles(content)}</blockquote>`);
      continue;
    }

    // 5. Line breaks and paragraphs
    if (trimmed === '') {
      flushParagraph();
    } else {
      paragraphBuffer.push(line);
    }
  }

  flushParagraph();

  if (inTable) {
    let tableHtml = '<div class="table-container"><table><thead><tr>';
    tableHeaders.forEach(h => {
      tableHtml += `<th>${parseInlineStyles(h)}</th>`;
    });
    tableHtml += '</tr></thead><tbody>';
    tableRows.forEach(row => {
      tableHtml += '<tr>';
      for (let j = 0; j < tableHeaders.length; j++) {
        tableHtml += `<td>${parseInlineStyles(row[j] || '')}</td>`;
      }
      tableHtml += '</tr>';
    });
    tableHtml += '</tbody></table></div>';
    processedLines.push(tableHtml);
  }

  if (inList) {
    processedLines.push(listType === 'ul' ? '</ul>' : '</ol>');
  }

  let finalHtml = processedLines.join('\n');

  // Restore placeholders
  for (let i = 0; i < mathBlocks.length; i++) {
    finalHtml = replaceAll(finalHtml, `MATHBLOCKPLACEHOLDER${i}`, mathBlocks[i]);
  }

  for (let i = 0; i < inlineCodeBlocks.length; i++) {
    finalHtml = replaceAll(finalHtml, `INLINECODEPLACEHOLDER${i}`, inlineCodeBlocks[i]);
  }

  for (let i = 0; i < codeBlocks.length; i++) {
    finalHtml = replaceAll(finalHtml, `CODEBLOCKPLACEHOLDER${i}`, codeBlocks[i]);
  }

  return finalHtml;
}

export interface ParsedThinkingResult {
  thinking: string;
  response: string;
  isStillThinking: boolean;
}

export function parseThinkingText(text: string, isFinal: boolean = false): ParsedThinkingResult {
  const thinkStart = text.indexOf('<think>');
  if (thinkStart === -1) {
    return { thinking: '', response: text, isStillThinking: false };
  }

  const thinkEnd = text.indexOf('</think>');
  if (thinkEnd === -1) {
    // No closing tag yet. While actively streaming, treat it as "still thinking".
    // Once the message is final (saved/completed), never permanently hide the
    // model's output behind an unterminated <think> block — surface it as the
    // response instead so the message doesn't render as empty.
    const thinking = text.substring(thinkStart + 7);
    if (isFinal) {
      return { thinking, response: thinking, isStillThinking: false };
    }
    return { thinking, response: '', isStillThinking: true };
  } else {
    // Finished thinking
    const thinking = text.substring(thinkStart + 7, thinkEnd);
    const response = text.substring(thinkEnd + 8);
    return { thinking, response, isStillThinking: false };
  }
}
