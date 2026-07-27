import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useChatScroll } from '../utils/useChatScroll';
import { StreamingRenderer } from '../renderers/StreamingRenderer';
import { CompletedRenderer } from '../renderers/CompletedRenderer';
import { ttsEngine } from '../../lib/ttsEngine';
import 'katex/dist/katex.min.css';
import './MessageItem.css';
import './ModelColumn.css';
import './ModelColumn.css';

const ThumbsIcon = ({ isFlipped = false, isFilled = false }: { isFlipped?: boolean; isFilled?: boolean }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 772 712"
    style={{
      transform: isFlipped ? 'scale(-1, -1)' : 'none',
      display: 'block',
      color: 'currentColor',
      transition: 'transform 0.2s ease'
    }}
  >
    <g
      fill={isFilled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={isFilled ? "0" : "32"}
    >
      <path
        d="M0 0 C20.39149193 12.75022362 31.56595777 33.45334855 37 56.26416016 C38.88680613 65.40222121 39.03798321 74.38810012 39.046875 83.68603516 C39.04788208 84.41663147 39.04888916 85.14722778 39.04992676 85.89996338 C39.03791822 98.8377552 38.07411113 111.37052205 35.796875 124.12353516 C35.65765625 124.94418457 35.5184375 125.76483398 35.375 126.61035156 C33.75975604 135.94848072 31.36397723 144.78669006 28.15625 153.70556641 C27.83253418 154.61745728 27.50881836 155.52934814 27.17529297 156.46887207 C26.3866348 158.68861015 25.59378399 160.90674882 24.796875 163.12353516 C26.76979774 163.15112663 26.76979774 163.15112663 28.78257751 163.17927551 C41.24210159 163.35532344 53.70133142 163.54592823 66.16042233 163.7504015 C72.56414163 163.85503906 78.96785477 163.95473456 85.37182617 164.04272461 C91.56421767 164.1279963 97.75626549 164.22678657 103.94830513 164.33453941 C106.29823106 164.37313558 108.64823927 164.40704617 110.99830437 164.43595314 C141.94382825 164.82443549 167.33255019 170.46052427 190.390625 192.61572266 C205.77762265 208.62009984 214.24372138 228.98180154 214.24197388 251.18103027 C213.99423056 263.56003038 211.21502292 275.55316702 208.671875 287.62353516 C208.15797262 290.13594908 207.64585993 292.64872972 207.13549805 295.16186523 C205.91724195 301.13988066 204.67759348 307.11317345 203.42950439 313.08502197 C202.60899058 317.02594229 201.80753877 320.97053676 201.01171875 324.91650391 C199.64513209 331.66053116 198.23083553 338.39354148 196.796875 345.12353516 C196.48871974 346.57551027 196.18061738 348.02749661 195.87255859 349.47949219 C193.55887002 360.37076661 191.20312209 371.25233007 188.796875 382.12353516 C188.37873535 384.01483154 188.37873535 384.01483154 187.95214844 385.94433594 C181.07153459 416.736575 169.7984435 443.98812852 142.23828125 461.99072266 C128.35081315 470.73978819 112.47483438 476.83668078 95.93286133 477.43554688 C94.80007248 477.47688751 93.66728363 477.51822815 92.50016785 477.56082153 C90.67670586 477.61893509 90.67670586 477.61893509 88.81640625 477.67822266 C87.53868851 477.72026825 86.26097076 477.76231384 84.9445343 477.80563354 C72.05799585 478.20797312 59.17289172 478.27557831 46.28051758 478.25390625 C42.440228 478.24847269 38.60005205 478.25393645 34.75976562 478.26025391 C-19.84582336 478.28045884 -72.54170323 467.79433754 -123.40625 447.99853516 C-124.58993164 447.53833984 -125.77361328 447.07814453 -126.99316406 446.60400391 C-134.60154619 443.09493567 -139.04694857 438.30352485 -142.32453728 430.73119164 C-143.86092294 426.17118479 -143.91433106 421.66244767 -144.01586914 416.88452148 C-144.05351568 415.76623396 -144.09116222 414.64794643 -144.12994957 413.49577141 C-144.24951951 409.71183082 -144.338888 405.92789064 -144.42578125 402.14306641 C-144.4619456 400.78701187 -144.49883824 399.43097658 -144.53642464 398.07496071 C-145.58459666 359.98551023 -145.61238205 321.87233401 -145.62739789 283.77118194 C-145.62781509 282.72399903 -145.62823228 281.67681612 -145.62866211 280.59790039 C-145.62906766 279.54900513 -145.6294732 278.50010987 -145.62989104 277.4194299 C-145.63533215 268.77051236 -145.66731322 260.12182179 -145.70406669 251.47298878 C-145.73874564 243.00877671 -145.75420936 234.54466716 -145.75490814 226.08038455 C-145.75569542 221.07747634 -145.7641972 216.07489035 -145.79290581 211.07205772 C-145.81907739 206.41638774 -145.82129734 201.7613104 -145.80525017 197.10560036 C-145.80344083 195.40848618 -145.81007962 193.71133731 -145.82606888 192.01429749 C-145.91960184 181.44318672 -145.40107284 172.6595609 -137.80078125 164.56494141 C-136.96417969 163.94490234 -136.12757813 163.32486328 -135.265625 162.68603516 C-134.31300781 161.95771484 -133.36039062 161.22939453 -132.37890625 160.47900391 C-131.33089844 159.70169922 -130.28289062 158.92439453 -129.203125 158.12353516 C-126.77529446 156.26275963 -124.36274801 154.38280711 -121.953125 152.49853516 C-121.35105225 152.02971924 -120.74897949 151.56090332 -120.12866211 151.07788086 C-116.42772756 148.16996707 -113.0112102 145.15388407 -109.7734375 141.72900391 C-108.00774601 139.92378201 -106.13065859 138.31674323 -104.203125 136.68603516 C-100.11407449 133.13749132 -96.62004324 129.31766226 -93.203125 125.12353516 C-92.4296875 124.17607422 -91.65625 123.22861328 -90.859375 122.25244141 C-80.96152797 109.8868908 -73.57248183 97.01917023 -68.203125 82.12353516 C-67.88601563 81.30369141 -67.56890625 80.48384766 -67.2421875 79.63916016 C-63.26557487 68.85112193 -62.97064568 57.43529199 -62.85461426 46.06570435 C-62.39693038 9.26908022 -62.39693038 9.26908022 -51.31640625 -2.95849609 C-36.44353694 -16.86817006 -15.30916429 -9.02655529 0 0 Z"
        transform="translate(439.203125,143.87646484375)"
      />
      <path
        d="M0 0 C7.06591488 6.77309318 11.08715973 12.51728747 11.37854004 22.43531799 C11.39581264 25.07720231 11.39713054 27.71604269 11.38476562 30.35766602 C11.38893967 31.82364581 11.39447066 33.28962226 11.40124416 34.75559235 C11.41309074 37.92024978 11.4156644 41.08473091 11.41108513 44.24940681 C11.40398176 49.33190999 11.41843563 54.4142189 11.43592834 59.49668884 C11.45909389 66.75381485 11.47372269 74.01090927 11.48245239 81.26806641 C11.5064496 100.02392027 11.58847494 118.77954376 11.68359375 137.53515625 C11.68814536 138.45992594 11.69269697 139.38469563 11.6973865 140.33748865 C11.89969555 181.08444783 12.82754018 221.78399177 14.56813049 262.49656677 C15.86161761 293.02430844 15.86161761 293.02430844 6 304 C-7.37258596 314.32734361 -22.36527461 312.6298563 -38.1875 310.75 C-57.6829958 308.22800775 -74.65378584 301.28853901 -87.1015625 285.30078125 C-94.14194717 274.80012241 -96.74006947 263.75606403 -98.5 251.375 C-98.65391708 250.32736984 -98.65391708 250.32736984 -98.8109436 249.25857544 C-101.48042083 231.02450692 -103.24474299 212.69119775 -104.80145264 194.33288574 C-104.98488437 192.17760519 -105.17371028 190.02286823 -105.36376953 187.86816406 C-108.94163257 146.05355604 -108.08426061 103.22902248 -104.5625 61.4375 C-104.50105804 60.70451691 -104.43961609 59.97153381 -104.37631226 59.21633911 C-102.64061204 38.86507435 -100.8491615 20.69804628 -84.25 6.6875 C-64.57054748 -7.92981024 -20.83401455 -16.86761899 0 0 Z"
        transform="translate(248,300)"
      />
    </g>
  </svg>
);


interface Message {
  id: string;
  sender: 'user' | 'model';
  text: string;
  attachments?: any[];
  isSearching?: boolean;
  searchQuery?: string;
  searchSources?: any[];
  isGenerating?: boolean;
  isStreamCompleted?: boolean;
  model?: string;
}

interface ModelColumnProps {
  model: string;
  messages: Message[];
  isExpanded: boolean;
  isAnyExpanded: boolean;
  onToggleExpand: () => void;
  isStopped?: boolean;
  onTypewriterComplete: (msgId: string) => void;
  onPreviewFile?: (file: any) => void;
  onRetry?: (msgId: string, modelName: string) => void;
  onEditMessage?: (msgId: string, newText: string) => void;
  index?: number;
  activeModelsCount?: number;
}

export function ModelColumn({
  model,
  messages,
  isExpanded,
  isAnyExpanded,
  onToggleExpand,
  isStopped: _isStopped,
  onTypewriterComplete,
  onPreviewFile,
  onRetry,
  onEditMessage,
  index = 0,
  activeModelsCount = 3
}: ModelColumnProps) {
  const isShrunk = isAnyExpanded && !isExpanded;

  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [dislikedIds, setDislikedIds] = useState<string[]>([]);
  const [feedbacks, setFeedbacks] = useState<Record<string, string>>({});
  const [selectedCategories, setSelectedCategories] = useState<Record<string, string[]>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [isScrolling, setIsScrolling] = useState(false);
  const [showJumpBtn, setShowJumpBtn] = useState(false);
  const scrollTimeoutRef = useRef<any>(null);

  const [isDownloadDropdownOpen, setIsDownloadDropdownOpen] = useState(false);
  const downloadDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (downloadDropdownRef.current && !downloadDropdownRef.current.contains(event.target as Node)) {
        setIsDownloadDropdownOpen(false);
      }
    }
    if (isDownloadDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDownloadDropdownOpen]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = container;
    const maxScroll = scrollHeight - clientHeight;
    const distanceFromBottom = maxScroll - scrollTop;

    // Show button only if user scrolled up by at least one full viewport height
    setShowJumpBtn(distanceFromBottom >= clientHeight);

    setIsScrolling(true);
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 850);
  };

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  const [isPlayingTts, setIsPlayingTts] = useState(false);
  const [isLoadingTts, setIsLoadingTts] = useState(false);
  const [activeTtsId, setActiveTtsId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = ttsEngine.registerStateCallback((activeId, isSpeaking, isLoading) => {
      setIsPlayingTts(isSpeaking && !isLoading);
      setIsLoadingTts(isSpeaking && isLoading);
      setActiveTtsId(activeId);
    });
    return () => {
      unsubscribe();
      if (ttsEngine.getSpeakingState().isSpeaking) {
        ttsEngine.stop();
      }
    };
  }, []);

  const handleSpeakClick = (msgId: string, text: string) => {
    ttsEngine.toggleSpeak(msgId, text);
  };

  const scroll = useChatScroll();
  const prevMessageCountRef = useRef(0);
  const geminiScrollUntilRef = useRef(0);

  // Auto-scroll: Gemini-style scroll-up
  useEffect(() => {
    const container = scroll.messagesContainerRef.current;
    if (!container) return;

    const prevCount = prevMessageCountRef.current;
    const currentCount = messages.length;
    prevMessageCountRef.current = currentCount;

    const now = Date.now();

    // Initial load of history: scroll instantly to bottom
    if (prevCount === 0 && currentCount > 0) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          container.scrollTop = container.scrollHeight - container.clientHeight;
          scroll.isAtBottomRef.current = true;
        });
      });
      return;
    }

    // New messages were added (normally 2: user + model)
    if (currentCount > prevCount && prevCount > 0) {
      const newUserMsg = [...messages].reverse().find(m => m.sender === 'user');

      if (newUserMsg) {
        // Gemini-style: scroll user message to fixed position from top
        geminiScrollUntilRef.current = now + 1500;
        scroll.isAtBottomRef.current = true; // reset bottom ref for the new response
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const userMsgEl = container.querySelector(`[data-msg-id="${newUserMsg.id}"]`) as HTMLElement | null;
            if (userMsgEl) {
              const scrollTarget = userMsgEl.offsetTop - 80; // exactly matching testscroll.tsx
              container.scrollTo({
                top: scrollTarget,
                behavior: 'smooth'
              });
            }
          });
        });
        return;
      }
    }
  }, [messages, scroll]);

  // Handle typing/streaming text update
  const handleTextUpdate = useCallback(() => {
    scroll.scheduleScrollToBottom();
  }, [scroll]);

  const handleCopy = (text: string, msgId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (text: string, sender: string) => {
    const friendlyModelName = providerMap[model.toLowerCase()] || model;
    const header = `Nothric | ${friendlyModelName}\n--------------------------------------------------\n\n`;
    const fullText = header + text;

    const element = document.createElement("a");
    const file = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const downloadUrl = URL.createObjectURL(file);
    element.href = downloadUrl;
    element.download = `${model.toLowerCase()}-${sender}-message.txt`;
    element.style.display = 'none';

    // Stop propagation to prevent single-page-app routing intercepts
    element.onclick = (e) => e.stopPropagation();

    document.body.appendChild(element);
    element.click();

    setTimeout(() => {
      document.body.removeChild(element);
      URL.revokeObjectURL(downloadUrl);
    }, 150);
  };

  const handleDownloadThreadTxt = () => {
    const friendlyModelName = providerMap[model.toLowerCase()] || model;
    let content = `Nothric Chat Export - ${friendlyModelName}\n`;
    content += `Exported on: ${new Date().toLocaleString()}\n`;
    content += `==================================================\n\n`;

    messages.forEach((msg) => {
      const senderName = msg.sender === 'user' ? 'User' : friendlyModelName;
      content += `${senderName}:\n${msg.text}\n`;
      content += `--------------------------------------------------\n\n`;
    });

    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const downloadUrl = URL.createObjectURL(file);
    element.href = downloadUrl;
    element.download = `nothric-${model.toLowerCase()}-chat-export.txt`;
    element.style.display = 'none';
    element.onclick = (e) => e.stopPropagation();
    document.body.appendChild(element);
    element.click();
    setTimeout(() => {
      document.body.removeChild(element);
      URL.revokeObjectURL(downloadUrl);
    }, 150);
  };

  const handleDownloadThreadMd = () => {
    const friendlyModelName = providerMap[model.toLowerCase()] || model;
    let content = `# Nothric Chat Export - ${friendlyModelName}\n\n`;
    content += `*Exported on: ${new Date().toLocaleString()}*\n\n`;
    content += `---\n\n`;

    messages.forEach((msg) => {
      const senderName = msg.sender === 'user' ? '**User**' : `**${friendlyModelName}**`;
      content += `### ${senderName}\n\n${msg.text}\n\n---\n\n`;
    });

    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const downloadUrl = URL.createObjectURL(file);
    element.href = downloadUrl;
    element.download = `nothric-${model.toLowerCase()}-chat-export.md`;
    element.style.display = 'none';
    element.onclick = (e) => e.stopPropagation();
    document.body.appendChild(element);
    element.click();
    setTimeout(() => {
      document.body.removeChild(element);
      URL.revokeObjectURL(downloadUrl);
    }, 150);
  };

  const handleDownloadThreadPdf = () => {
    const friendlyModelName = providerMap[model.toLowerCase()] || model;
    
    // Create a hidden iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);
    
    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (!doc) return;
    
    // Write HTML content
    let html = `
      <html>
        <head>
          <title>Nothric Chat - ${friendlyModelName}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              padding: 40px;
              color: #1e293b;
              line-height: 1.6;
            }
            .header {
              border-bottom: 2px solid #e2e8f0;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .header h1 {
              font-size: 24px;
              color: #0f172a;
              margin: 0 0 6px 0;
            }
            .header p {
              font-size: 13px;
              color: #64748b;
              margin: 0;
            }
            .message-container {
              margin-bottom: 30px;
              page-break-inside: avoid;
            }
            .sender-name {
              font-size: 14px;
              font-weight: 600;
              margin-bottom: 6px;
              color: #0f172a;
            }
            .user-sender {
              color: #2563eb;
            }
            .model-sender {
              color: #10b981;
            }
            .message-body {
              font-size: 14px;
              white-space: pre-wrap;
              background-color: #f8fafc;
              padding: 16px;
              border-radius: 8px;
              border: 1px solid #e2e8f0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Nothric Chat Export</h1>
            <p><strong>Model:</strong> ${friendlyModelName} | <strong>Exported:</strong> ${new Date().toLocaleString()}</p>
          </div>
    `;
    
    messages.forEach((msg) => {
      const senderLabel = msg.sender === 'user' ? 'User' : friendlyModelName;
      const senderClass = msg.sender === 'user' ? 'user-sender' : 'model-sender';
      html += `
        <div class="message-container">
           <div class="sender-name ${senderClass}">${senderLabel}</div>
           <div class="message-body">${msg.text}</div>
        </div>
      `;
    });
    
    html += `
        </body>
      </html>
    `;
    
    doc.open();
    doc.write(html);
    doc.close();
    
    // Trigger print dialog
    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 500);
    }, 500);
  };

  const handleLike = (msgId: string) => {
    if (likedIds.includes(msgId)) {
      setLikedIds(likedIds.filter(id => id !== msgId));
    } else {
      setLikedIds([...likedIds, msgId]);
      setDislikedIds(dislikedIds.filter(id => id !== msgId)); // Remove from dislike if liked
    }
  };

  const handleDislike = (msgId: string) => {
    if (dislikedIds.includes(msgId)) {
      setDislikedIds(dislikedIds.filter(id => id !== msgId));
    } else {
      setDislikedIds([...dislikedIds, msgId]);
      setLikedIds(likedIds.filter(id => id !== msgId)); // Remove from like if disliked
    }
  };

  const handleFeedbackSubmit = (msgId: string) => {
    // Hide form by removing from dislikedIds
    setDislikedIds(dislikedIds.filter(id => id !== msgId));

    const feedbackText = feedbacks[msgId] || '';
    const categories = selectedCategories[msgId] || [];

    if (feedbackText.trim() || categories.length > 0) {
      const friendlyModel = providerMap[model.toLowerCase()] || model;
      alert(`Feedback submitted for ${friendlyModel}:\nCategories: ${categories.join(', ')}\nComment: "${feedbackText}"`);
    }

    // Clear feedback and category state for this message
    setFeedbacks(prev => {
      const updated = { ...prev };
      delete updated[msgId];
      return updated;
    });
    setSelectedCategories(prev => {
      const updated = { ...prev };
      delete updated[msgId];
      return updated;
    });
  };

  const providerMap: Record<string, string> = {
    auto: 'Auto Nothric',
    gemini: 'Gemini 2.5 Flash',
    gpt: 'GPT 120B',
    qwen: 'Qwen Coder',
    mistral: 'Mistral Large',
    cohere: 'Command R+',
    nemotron: 'Nemotron 120B',
  };

  const getModelLogo = (modelKey: string) => {
    const key = modelKey.toLowerCase();
    const logoStyle = {
      width: '16px',
      height: '16px',
      display: 'inline-block',
      verticalAlign: 'middle',
      flexShrink: 0
    };

    switch (key) {
      case 'gemini': // Gemini
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" style={{ ...logoStyle, color: '#1a73e8' }}>
            <path d="M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81" />
          </svg>
        );
      case 'gpt': // GPT 120B (OpenAI)
        return (
          <svg viewBox="0 0 512 509.639" style={logoStyle}>
            <path fill="#fff" d="M115.612 0h280.775C459.974 0 512 52.026 512 115.612v278.415c0 63.587-52.026 115.613-115.613 115.613H115.612C52.026 509.64 0 457.614 0 394.027V115.612C0 52.026 52.026 0 115.612 0z"/>
            <path fill-rule="nonzero" d="M412.037 221.764a90.834 90.834 0 004.648-28.67 90.79 90.79 0 00-12.443-45.87c-16.37-28.496-46.738-46.089-79.605-46.089-6.466 0-12.943.683-19.264 2.04a90.765 90.765 0 00-67.881-30.515h-.576c-.059.002-.149.002-.216.002-39.807 0-75.108 25.686-87.346 63.554-25.626 5.239-47.748 21.31-60.682 44.03a91.873 91.873 0 00-12.407 46.077 91.833 91.833 0 0023.694 61.553 90.802 90.802 0 00-4.649 28.67 90.804 90.804 0 0012.442 45.87c16.369 28.504 46.74 46.087 79.61 46.087a91.81 91.81 0 0019.253-2.04 90.783 90.783 0 0067.887 30.516h.576l.234-.001c39.829 0 75.119-25.686 87.357-63.588 25.626-5.242 47.748-21.312 60.682-44.033a91.718 91.718 0 0012.383-46.035 91.83 91.83 0 00-23.693-61.553l-.004-.005zM275.102 413.161h-.094a68.146 68.146 0 01-43.611-15.8 56.936 56.936 0 002.155-1.221l72.54-41.901a11.799 11.799 0 005.962-10.251V241.651l30.661 17.704c.326.163.55.479.596.84v84.693c-.042 37.653-30.554 68.198-68.21 68.273h.001zm-146.689-62.649a68.128 68.128 0 01-9.152-34.085c0-3.904.341-7.817 1.005-11.663.539.323 1.48.897 2.155 1.285l72.54 41.901a11.832 11.832 0 0011.918-.002l88.563-51.137v35.408a1.1 1.1 0 01-.438.94l-73.33 42.339a68.43 68.43 0 01-34.11 9.12 68.359 68.359 0 01-59.15-34.11l-.001.004zm-19.083-158.36a68.044 68.044 0 0135.538-29.934c0 .625-.036 1.731-.036 2.5v83.801l-.001.07a11.79 11.79 0 005.954 10.242l88.564 51.13-30.661 17.704a1.096 1.096 0 01-1.034.093l-73.337-42.375a68.36 68.36 0 01-34.095-59.143 68.412 68.412 0 019.112-34.085l-.004-.003zm251.907 58.621l-88.563-51.137 30.661-17.697a1.097 1.097 0 011.034-.094l73.337 42.339c21.109 12.195 34.132 34.746 34.132 59.132 0 28.604-17.849 54.199-44.686 64.078v-86.308c.004-.032.004-.065.004-.096 0-4.219-2.261-8.119-5.919-10.217zm30.518-45.93c-.539-.331-1.48-.898-2.155-1.286l-72.54-41.901a11.842 11.842 0 00-5.958-1.611c-2.092 0-4.15.558-5.957 1.611l-88.564 51.137v-35.408l-.001-.061a1.1 1.1 0 01.44-.88l73.33-42.303a68.301 68.301 0 0134.108-9.129c37.704 0 68.281 30.577 68.281 68.281a68.69 68.69 0 01-.984 11.545v.005zm-191.843 63.109l-30.668-17.704a1.09 1.09 0 01-.596-.84v-84.692c.016-37.685 30.593-68.236 68.281-68.236a68.332 68.332 0 0143.689 15.804 63.09 63.09 0 00-2.155 1.222l-72.54 41.9a11.794 11.794 0 00-5.961 10.248v.068l-.05 102.23zm16.655-35.91l39.445-22.782 39.444 22.767v45.55l-39.444 22.767-39.445-22.767v-45.535z"/>
          </svg>
        );
      case 'qwen': // Qwen Coder
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" style={{ ...logoStyle, color: '#8b5cf6' }}>
            <path d="M12.604 1.34c.393.69.784 1.382 1.174 2.075a.18.18 0 00.157.091h5.552c.174 0 .322.11.446.327l1.454 2.57c.19.337.24.478.024.837-.26.43-.513.864-.76 1.3l-.367.658c-.106.196-.223.28-.04.512l2.652 4.637c.172.301.111.494-.043.77-.437.785-.882 1.564-1.335 2.34-.159.272-.352.375-.68.37-.777-.016-1.552-.01-2.327.016a.099.099 0 00-.081.05 575.097 575.097 0 01-2.705 4.74c-.169.293-.38.363-.725.364-.997.003-2.002.004-3.017.002a.537.537 0 01-.465-.271l-1.335-2.323a.09.09 0 00-.083-.049H4.982c-.285.03-.553-.001-.805-.092l-1.603-2.77a.543.543 0 01-.002-.54l1.207-2.12a.198.198 0 000-.197 550.951 550.951 0 01-1.875-3.272l-.79-1.395c-.16-.31-.173-.496.095-.965.465-.813.927-1.625 1.387-2.436.132-.234.304-.334.584-.335a338.3 338.3 0 012.589-.001.124.124 0 00.107-.063l2.806-4.895a.488.488 0 01.422-.246c.524-.001 1.053 0 1.583-.006L11.704 1c.341-.003.724.032.9.34zm-3.432.403a.06.06 0 00-.052.03L6.254 6.788a.157.157 0 01-.135.078H3.253c-.056 0-.07.025-.041.074l5.81 10.156c.025.042.013.062-.034.063l-2.795.015a.218.218 0 00-.2.116l-1.32 2.31c-.044.078-.021.118.068.118l5.716.008c.046 0 .08.02.104.061l1.403 2.454c.046.081.092.082.139 0l5.006-8.76.783-1.382a.055.055 0 01.096 0l1.424 2.53a.122.122 0 00.107.062l2.763-.02a.04.04 0 00.035-.02.041.041 0 000-.04l-2.9-5.086a.108.108 0 010-.113l.293-.507 1.12-1.977c.024-.041.012-.062-.035-.062H9.2c-.059 0-.073-.026-.043-.077l1.434-2.505a.107.107 0 000-.114L9.225 1.774a.06.06 0 00-.053-.031zm6.29 8.02c.046 0 .058.02.034.06 l-.832 1.465-2.613 4.585a.056.056 0 01-.05.029.058.058 0 01-.05-.029L8.498 9.841c-.02-.034-.01-.052.028-.054l.216-.012 6.722-.012z" />
          </svg>
        );
      case 'mistral': // Mistral Nemo
        return (
          <svg viewBox="0 0 512 512" style={logoStyle}>
            <g transform="translate(6 79.299) scale(1.96335)">
              <g transform="scale(1.33333)">
                <path fill="#ffd800" d="M27.153 0h27.169v27.089H27.153zM135.815 0h27.169v27.089h-27.169z"/>
                <path fill="#ffaf00" d="M27.153 27.091h54.329V54.18H27.153zM108.661 27.091h54.329V54.18h-54.329z"/>
                <path fill="#ff8205" d="M27.153 54.168h135.819v27.089H27.153z"/>
                <path fill="#fa500f" d="M27.153 81.259h27.169v27.09H27.153zM81.492 81.259h27.169v27.09H81.492zM135.815 81.259h27.169v27.09h-27.169z"/>
                <path fill="#e10500" d="M-.001 108.339h81.489v27.09H-.001zM108.661 108.339h81.498v27.09h-81.498z"/>
              </g>
            </g>
          </svg>
        );
      case 'cohere': // Command R+
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" style={{ ...logoStyle, color: '#059669' }}>
            <path d="M8.128 14.099c.592 0 1.77-.033 3.398-.703 1.897-.781 5.672-2.2 8.395-3.656 1.905-1.018 2.74-2.366 2.74-4.18A4.56 4.56 0 0018.1 1H7.549A6.55 6.55 0 001 7.55c0 3.617 2.745 6.549 7.128 6.549z" />
            <path d="M9.912 18.61a4.387 4.387 0 012.705-4.052l3.323-1.38c3.361-1.394 7.06 1.076 7.06 4.715a5.104 5.104 0 01-5.105 5.104l-3.597-.001a4.386 4.386 0 01-4.386-4.387z" />
            <path d="M4.776 14.962A3.775 3.775 0 001 18.738v.489a3.776 3.776 0 007.551 0v-.49a3.775 3.775 0 00-3.775-3.775z" />
          </svg>
        );
      case 'nemotron': // Nemotron 30b
        return (
          <svg viewBox="0 0 64 64" fill="currentColor" style={{ ...logoStyle, color: '#76b900' }}>
            <path d="M23.862 23.46v-3.816l1.13-.047c10.46-.33 17.313 8.998 17.313 8.998s-7.396 10.27-15.335 10.27a9.73 9.73 0 0 1-3.086-.495v-11.59c4.075.495 4.9 2.285 7.326 6.36l5.44-4.57s-3.98-5.206-10.67-5.206c-.707-.024-1.413.024-2.12.094m0-12.626v5.7l1.13-.07c14.534-.495 24.026 11.92 24.026 11.92S38.136 41.622 26.806 41.622c-.99 0-1.955-.094-2.92-.26v3.533c.8.094 1.625.165 2.426.165 10.553 0 18.185-5.394 25.58-11.754 1.225.99 6.242 3.368 7.28 4.405-7.02 5.89-23.39 10.623-32.67 10.623a23.24 23.24 0 0 1-2.591-.141v4.97H64v-42.33zm0 27.536v3.015C14.1 39.644 11.4 29.49 11.4 29.49s4.688-5.182 12.46-6.03v3.298h-.024c-4.075-.495-7.28 3.32-7.28 3.32s1.814 6.43 7.302 8.29M6.548 29.067s5.77-8.527 17.337-9.422v-3.11C11.07 17.572 0 28.408 0 28.408s6.266 18.138 23.862 19.787v-3.298c-12.908-1.602-17.313-15.83-17.313-15.83z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`model-column-card ${isShrunk ? 'shrunk' : ''} ${isExpanded ? 'expanded' : ''} ${(model === 'auto' || activeModelsCount === 1) ? 'auto-layout-column' : ''}`}
      style={{ animationDelay: `${index * 75}ms` }}
    >
      <div className="model-column-header">
        <div
          className="model-name-wrapper"
          onClick={() => window.open(`/${model.toLowerCase()}`, '_blank')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          {getModelLogo(model)}
          <span className="model-name">{providerMap[model.toLowerCase()] || model}</span>
        </div>
        <div className="column-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
          {isExpanded && (
            <div className="column-download-container" ref={downloadDropdownRef}>
              <button
                className="column-download-btn"
                aria-label="Download chat thread"
                type="button"
                onClick={() => setIsDownloadDropdownOpen(!isDownloadDropdownOpen)}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="1" className="download-icon-svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 3C12.5523 3 13 3.44772 13 4V12.5858L15.2929 10.2929C15.6834 9.90237 16.3166 9.90237 16.7071 10.2929C17.0976 10.6834 17.0976 11.3166 16.7071 11.7071L12.7071 15.7071C12.5196 15.8946 12.2652 16 12 16C11.7348 16 11.4804 15.8946 11.2929 15.7071L7.2929 11.7071C6.90238 11.3166 6.90238 10.6834 7.2929 10.2929C7.68342 9.90237 8.31659 9.90237 8.70711 10.2929L11 12.5858V4C11 3.44772 11.4477 3 12 3ZM4.00001 14C4.55229 14 5.00001 14.4477 5.00001 15C5.00001 15.9772 5.00485 16.3198 5.05765 16.5853C5.29437 17.7753 6.22466 18.7056 7.41474 18.9424C7.68018 18.9952 8.02276 19 9.00001 19H15C15.9772 19 16.3198 18.9952 16.5853 18.9424C17.7753 18.7056 18.7056 17.7753 18.9424 16.5853C18.9952 16.3198 19 15.9772 19 15C19 14.4477 19.4477 14 20 14C20.5523 14 21 14.4477 21 15C21 15.0392 21 15.0777 21 15.1157C21.0002 15.9334 21.0004 16.4906 20.9039 16.9755C20.5094 18.9589 18.9589 20.5094 16.9755 20.9039C16.4907 21.0004 15.9334 21.0002 15.1158 21C15.0778 21 15.0392 21 15 21H9.00001C8.96084 21 8.92225 21 8.88423 21C8.06664 21.0002 7.50935 21.0004 7.02456 20.9039C5.0411 20.5094 3.49061 18.9589 3.09608 16.9755C2.99965 16.4906 2.99978 15.9334 2.99999 15.1158C3 15.0777 3.00001 15.0392 3.00001 15C3.00001 14.4477 3.44772 14 4.00001 14Z" fill="currentColor"></path>
                </svg>
              </button>
              
              {isDownloadDropdownOpen && (
                <div className="column-download-dropdown">
                  <button type="button" onClick={() => { handleDownloadThreadTxt(); setIsDownloadDropdownOpen(false); }}>TXT</button>
                  <button type="button" onClick={() => { handleDownloadThreadMd(); setIsDownloadDropdownOpen(false); }}>Markdown (.md)</button>
                  <button type="button" onClick={() => { handleDownloadThreadPdf(); setIsDownloadDropdownOpen(false); }}>PDF</button>
                </div>
              )}
            </div>
          )}

          <button
            className="column-fullscreen-btn"
            aria-label={isExpanded ? "Exit Fullscreen" : "Toggle Fullscreen"}
            type="button"
            onClick={onToggleExpand}
          >
            {isExpanded ? (
              /* Collapse SVG */
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="4 14 10 14 10 20" />
                <polyline points="20 10 14 10 14 4" />
                <line x1="14" y1="10" x2="21" y2="3" />
                <line x1="10" y1="14" x2="3" y2="21" />
              </svg>
            ) : (
              /* Expand SVG */
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 3 21 3 21 9" />
                <polyline points="9 21 3 21 3 15" />
                <line x1="21" y1="3" x2="14" y2="10" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div
        className={`model-response-body ${isScrolling ? 'scrolling' : ''} ${activeModelsCount <= 2 ? 'hide-scrollbar' : ''}`}
        ref={scroll.messagesContainerRef}
        onScroll={(e) => {
          scroll.handleScroll(e);
          handleScroll(e);
        }}
        onWheel={scroll.handleWheel}
        onTouchStart={scroll.handleTouchStart}
        onTouchMove={scroll.handleTouchMove}
      >
        <div className="messages-list">
          {messages.map((msg, _index) => {
            const isLiked = likedIds.includes(msg.id);
            const isDisliked = dislikedIds.includes(msg.id);
            const isCopied = copiedId === msg.id;
            const hasAttachments = msg.attachments && msg.attachments.length > 0;
            
            const ripMarker = "🪦 RIP to the rest of that response. 🚫📖 The ending remains a mystery. 🕵️";
            const hasRip = msg.text && msg.text.includes(ripMarker);
            const cleanText = hasRip ? msg.text.replace(ripMarker, '').trim() : msg.text;

            return (
              <div key={msg.id} data-msg-id={msg.id} className={`chat-message-wrapper ${msg.sender} ${isDisliked ? 'has-feedback' : ''} ${editingMsgId === msg.id ? 'is-editing' : ''}`}>
                <div className={`chat-message-container ${msg.sender}`}>
                  {(cleanText || msg.sender === 'user') && (
                    <div className="chat-message-bubble">
                    {hasAttachments && (
                      <div className="message-attachments-container" style={{ marginBottom: '8px' }}>
                        {msg.attachments!.map((file: any, idx: number) => {
                          const isImage = file.type === 'image';
                          const isPdf = file.type === 'pdf';
                          const isFolder = file.type === 'directory';

                          const imageUrl = file.url || (file.base64 ? `data:image/png;base64,${file.base64}` : undefined);
                          if (isImage && imageUrl) {
                            return (
                              <div
                                key={idx}
                                className="message-attachment-image-wrapper clickable"
                                onClick={() => onPreviewFile && onPreviewFile({ ...file, url: imageUrl })}
                                style={{ cursor: 'pointer', maxWidth: '100%', borderRadius: '8px', overflow: 'hidden', marginBottom: '4px' }}
                              >
                                <img src={imageUrl} alt={file.name} style={{ width: '100%', display: 'block', maxHeight: '180px', objectFit: 'cover' }} />
                              </div>
                            );
                          }

                          let typeLabel = 'FILE';
                          let iconBgClass = 'icon-bg-file';
                          let iconSvg = (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="attachment-svg-white">
                              <path d="M11.1 22H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.589 3.588A2.4 2.4 0 0 1 20 8v3.25" />
                              <path d="M14 2v5a1 1 0 0 0 1 1h5" />
                              <path d="m21 22-2.88-2.88" />
                              <circle cx="16" cy="17" r="3" />
                            </svg>
                          );

                          if (isPdf) {
                            typeLabel = 'PDF';
                            iconBgClass = 'icon-bg-pdf';
                            iconSvg = (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="attachment-svg-white">
                                <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
                                <path d="M14 2v5a1 1 0 0 0 1 1h5" />
                                <path d="M10 9H8" />
                                <path d="M16 13H8" />
                                <path d="M16 17H8" />
                              </svg>
                            );
                          } else if (isFolder) {
                            typeLabel = 'FOLDER';
                            iconBgClass = 'icon-bg-folder';
                            iconSvg = (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="attachment-svg-white">
                                <path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2" />
                              </svg>
                            );
                          }

                          return (
                            <div
                              key={idx}
                              className="message-attachment-card clickable"
                              style={{ cursor: 'pointer', marginBottom: '4px' }}
                              onClick={() => onPreviewFile && onPreviewFile(file)}
                            >
                              <div className={`attached-card-icon-box ${iconBgClass}`} style={{ width: '28px', height: '28px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isPdf ? '#ef4444' : isFolder ? '#eab308' : '#3b82f6', color: '#fff' }}>
                                {iconSvg}
                              </div>
                              <div className="attached-card-info" style={{ display: 'flex', flexDirection: 'column' }}>
                                <span className="attached-card-name" style={{ fontSize: '0.75rem', fontWeight: 500, maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={file.name}>{file.name}</span>
                                <span className="attached-card-type" style={{ fontSize: '0.6rem', color: '#64748b' }}>{typeLabel}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {msg.sender === 'model' ? (
                      <>
                        {msg.searchSources && msg.searchSources.length > 0 && (
                          <div className="message-search-sources-container" style={{ marginBottom: '8px' }}>
                            <div className="sources-header" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>
                              <svg className="sources-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="2" y1="12" x2="22" y2="12" />
                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                              </svg>
                              <span>Sources</span>
                            </div>
                            <div className="sources-list" style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
                              {msg.searchSources.map((source: any, idx: number) => (
                                <a
                                  key={idx}
                                  href={source.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="source-card"
                                  title={source.title}
                                  style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 6px', borderRadius: '6px', background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.04)', fontSize: '0.7rem', textDecoration: 'none', color: '#1e293b', whiteSpace: 'nowrap' }}
                                >
                                  {source.favicon && (
                                    <img
                                      src={source.favicon}
                                      alt=""
                                      style={{ width: '12px', height: '12px', borderRadius: '2px' }}
                                      onError={(e) => {
                                        (e.target as HTMLElement).style.display = 'none';
                                      }}
                                    />
                                  )}
                                  <span style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{source.title}</span>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                        {msg.isGenerating ? (
                          <StreamingRenderer
                            text={cleanText}
                            isCompleted={!!msg.isStreamCompleted}
                            onComplete={onTypewriterComplete ? () => onTypewriterComplete(msg.id) : () => { }}
                            onTextUpdate={handleTextUpdate}
                            isSearching={msg.isSearching}
                            searchQuery={msg.searchQuery}
                          />
                        ) : (
                          <CompletedRenderer text={cleanText} />
                        )}
                      </>
                    ) : (
                      msg.sender === 'user' && editingMsgId === msg.id ? (
                        <div className="user-edit-container" onClick={(e) => e.stopPropagation()}>
                          <textarea
                            className="user-edit-textarea"
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            rows={Math.max(2, editingText.split('\n').length)}
                            autoFocus
                          />
                          <div className="user-edit-actions">
                            <button
                              type="button"
                              className="user-edit-btn cancel"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingMsgId(null);
                              }}
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              className="user-edit-btn save"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onEditMessage) {
                                  onEditMessage(msg.id, editingText);
                                }
                                setEditingMsgId(null);
                              }}
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        msg.text
                      )
                    )}
                  </div>
                  )}
                  {msg.sender === 'user' && editingMsgId !== msg.id && (
                    <div className="user-message-actions">
                      <button
                        type="button"
                        className="user-action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setEditingMsgId(msg.id);
                          setEditingText(msg.text);
                        }}
                        title="Edit message"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil-icon lucide-pencil">
                          <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                          <path d="m15 5 4 4" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className={`user-action-btn ${isCopied ? 'copied' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleCopy(msg.text, msg.id);
                        }}
                        title="Copy message"
                      >
                        {isCopied ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy">
                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                          </svg>
                        )}
                      </button>
                    </div>
                  )}
                  {msg.sender === 'model' && !msg.isGenerating && cleanText && (
                    <div className="message-actions-toolbar">
                      <button
                        className={`msg-action-btn ${isCopied ? 'copied' : ''}`}
                        aria-label="Copy message"
                        type="button"
                        onClick={() => handleCopy(cleanText, msg.id)}
                      >
                        {isCopied ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                        )}
                      </button>

                      <button
                        className={`msg-action-btn ${isLiked ? 'liked' : ''}`}
                        aria-label="Like message"
                        type="button"
                        onClick={() => handleLike(msg.id)}
                      >
                        <ThumbsIcon isFilled={isLiked} />
                      </button>

                      <button
                        className={`msg-action-btn ${isDisliked ? 'disliked' : ''}`}
                        aria-label="Dislike message"
                        type="button"
                        onClick={() => handleDislike(msg.id)}
                      >
                        <ThumbsIcon isFlipped isFilled={isDisliked} />
                      </button>

                      <button
                        className="msg-action-btn"
                        aria-label="Download message"
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleDownload(cleanText, msg.sender);
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download">
                          <path d="M12 15V3" />
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                        </svg>
                      </button>

                      <button
                        className="msg-action-btn"
                        aria-label="Regenerate response"
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          if (onRetry) onRetry(msg.id, model);
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-cw">
                          <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                          <path d="M3 3v5h5" />
                          <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                          <path d="M16 16h5v5" />
                        </svg>
                      </button>

                      <button
                        className={`msg-action-btn ${activeTtsId === msg.id && isPlayingTts ? 'playing-tts' : ''} ${activeTtsId === msg.id && isLoadingTts ? 'loading-tts' : ''}`}
                        aria-label={activeTtsId === msg.id && isPlayingTts ? "Pause speech" : "Speak message"}
                        type="button"
                        onClick={() => handleSpeakClick(msg.id, cleanText)}
                      >
                        {activeTtsId === msg.id && isLoadingTts ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" className="lucide-spinner animate-spin">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1" style={{ opacity: 0.25 }}></circle>
                            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" style={{ opacity: 0.75 }}></path>
                          </svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-volume-2 ${activeTtsId === msg.id && isPlayingTts ? 'pulsing' : ''}`}>
                            <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" />
                            <path d="M16 9a5 5 0 0 1 0 6" />
                            <path d="M19.364 18.364a9 9 0 0 0 0-12.728" />
                          </svg>
                        )}
                      </button>

                      {/* Routed AI Model Logo indicator */}
                      {(model === 'auto' || activeModelsCount === 1) && (msg.model || (model !== 'auto' && model)) && (
                        <div 
                          className="msg-action-logo-indicator" 
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginLeft: 'auto',
                            padding: '3px 8px',
                            background: 'var(--sidebar-hover-bg, rgba(255,255,255,0.06))',
                            borderRadius: '8px',
                            gap: '6px',
                            fontSize: '11px',
                            color: 'var(--text-secondary, rgba(255,255,255,0.7))',
                            fontWeight: '500',
                            border: '1px solid var(--sidebar-border, rgba(255,255,255,0.15))'
                          }}
                        >
                          {getModelLogo(msg.model || model)}
                          <span>{providerMap[(msg.model || model).toLowerCase()] || (msg.model || model)}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {hasRip && (
                    <div className="stopped-dashed-line">
                      🪦 RIP to the rest of that response. 🚫📖 The ending remains a mystery. 🕵️
                    </div>
                  )}

                  {msg.sender === 'model' && isDisliked && createPortal(
                    <div className="feedback-modal-overlay" onClick={() => handleDislike(msg.id)}>
                      <div className="feedback-modal-container" onClick={(e) => e.stopPropagation()}>
                        <div className="feedback-form-title">What went wrong?</div>

                        <div className="feedback-categories-container">
                          {['Inaccurate info', 'Unhelpful response', 'Hard to read', 'Repetitive content', 'Too brief', 'Other'].map((cat) => {
                            const currentSelected = selectedCategories[msg.id] || [];
                            const isSelected = currentSelected.includes(cat);
                            const handleToggleCategory = () => {
                              const next = isSelected
                                ? currentSelected.filter(c => c !== cat)
                                : [...currentSelected, cat];
                              setSelectedCategories({
                                ...selectedCategories,
                                [msg.id]: next
                              });
                            };
                            return (
                              <button
                                key={cat}
                                type="button"
                                className={`feedback-category-pill ${isSelected ? 'selected' : ''}`}
                                onClick={handleToggleCategory}
                              >
                                {cat}
                              </button>
                            );
                          })}
                        </div>

                        <textarea
                          placeholder="Please type your feedback here..."
                          value={feedbacks[msg.id] || ''}
                          onChange={(e) => setFeedbacks({ ...feedbacks, [msg.id]: e.target.value })}
                          rows={4}
                        />

                        <div className="feedback-form-actions">
                          <button
                            type="button"
                            className="feedback-cancel-btn"
                            onClick={() => handleDislike(msg.id)}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="feedback-submit-btn"
                            onClick={() => handleFeedbackSubmit(msg.id)}
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>,
                    document.body
                  )}
                </div>
              </div>
            );
          })}
        </div>
          {/* Bottom gap so last message can be scrolled to the fixed top position */}
          <div style={{ height: '40px', flexShrink: 0 }} />
      </div>

      {/* Floating Jump to Latest Button */}
      {showJumpBtn && (
        <button className="jump-to-latest-btn" onClick={scroll.handleJumpToBottom}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="jump-icon">
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
          <span>Back to bottom</span>
        </button>
      )}
    </div>
  );
}
