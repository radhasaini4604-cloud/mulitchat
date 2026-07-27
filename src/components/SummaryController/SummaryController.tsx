import { useState, useEffect } from 'react';
import { SummaryModal } from '../SummaryModal/SummaryModal';
import { getMessages as getDBMessages, getChats, saveChat } from '../../Main_chat/utils/db';
import { queryGemini } from '../../Main_chat/utils/aiHandler';
import { parseMarkdown } from '../../Main_chat/utils/markdownParser';

export function SummaryController() {
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [summaryTitle, setSummaryTitle] = useState('');
  const [summaryText, setSummaryText] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [summarySessionId, setSummarySessionId] = useState<string | null>(null);

  useEffect(() => {
    const handleRequestSummary = async (e: Event) => {
      const customEvent = e as CustomEvent<{ sessionId: string; chatTitle: string; summary?: string }>;
      const { sessionId, chatTitle, summary } = customEvent.detail;

      setSummaryTitle(chatTitle);
      setSummaryError(null);
      setSummarySessionId(sessionId);

      if (summary) {
        setSummaryOpen(true);
        setSummaryLoading(false);
        setSummaryText(summary);
        return;
      }

      setSummaryOpen(true);
      setSummaryLoading(true);
      setSummaryText('');

      try {
        const dbMsgs = await getDBMessages(sessionId);
        let prompt = '';
        if (dbMsgs.length > 0) {
          const history = dbMsgs
            .map(m => `${m.sender === 'user' ? 'User' : 'Nothric'}: ${m.text}`)
            .join('\n\n');
          prompt = `Please provide a clean, professional markdown summary of this chat conversation titled "${chatTitle}". Focus on key discussion points, main questions asked, and any action items or conclusions. Avoid unnecessary pleasantries and structure it beautifully with lists and bold text:\n\n${history}`;
        } else {
          prompt = `The user wants a summary of a chat titled "${chatTitle}". However, there are no messages in this chat yet. Please provide a brief, professional, and inspiring outline/overview of what this topic typically covers, and how a user can get started with it. Use clean markdown formatting.`;
        }

        const result = await queryGemini(prompt, undefined, 'gemini-2.5-flash-lite');
        setSummaryText(result);

        // Save summary to chat session in DB
        const chats = await getChats();
        const chatSession = chats.find(c => c.id === sessionId);
        if (chatSession) {
          chatSession.summary = result;
          await saveChat(chatSession);
          window.dispatchEvent(new Event('chat-sessions-updated'));
        }
      } catch (err: any) {
        console.error('Failed to summarize chat:', err);
        setSummaryError(err.message || 'Failed to generate summary.');
      } finally {
        setSummaryLoading(false);
      }
    };

    window.addEventListener('request-chat-summary', handleRequestSummary);
    return () => {
      window.removeEventListener('request-chat-summary', handleRequestSummary);
    };
  }, []);

  const handleExportSummary = (format: 'pdf' | 'txt' | 'md') => {
    if (!summaryText) return;

    if (format === 'pdf') {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${summaryTitle}</title>
              <style>
                body {
                  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                  line-height: 1.6;
                  color: #334155;
                  padding: 40px;
                  max-width: 800px;
                  margin: 0 auto;
                }
                h1, h2, h3, h4, h5, h6 {
                  color: #0f172a;
                  font-weight: 600;
                }
                pre {
                  background: #f1f5f9;
                  padding: 16px;
                  border-radius: 8px;
                  overflow-x: auto;
                }
                code {
                  font-family: monospace;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin: 20px 0;
                }
                th, td {
                  border: 1px solid #e2e8f0;
                  padding: 8px 12px;
                  text-align: left;
                }
                th {
                  background-color: #f8fafc;
                }
                ul, ol {
                  padding-left: 20px;
                }
                li {
                  margin-bottom: 4px;
                }
              </style>
            </head>
            <body>
              <h1>Chat Summary: ${summaryTitle}</h1>
              <div class="summary-body">${parseMarkdown(summaryText)}</div>
              <script>
                window.onload = function() {
                  window.print();
                  window.close();
                };
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    } else if (format === 'txt') {
      const plainText = summaryText
        .replace(/[#*`_-]/g, '')
        .trim();
      const blob = new Blob([plainText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${summaryTitle.replace(/\s+/g, '_')}_summary.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const blob = new Blob([summaryText], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${summaryTitle.replace(/\s+/g, '_')}_summary.md`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleResummarize = async () => {
    if (!summarySessionId) return;
    setSummaryLoading(true);
    setSummaryError(null);
    setSummaryText('');

    try {
      const dbMsgs = await getDBMessages(summarySessionId);
      let prompt = '';
      if (dbMsgs.length > 0) {
        const history = dbMsgs
          .map(m => `${m.sender === 'user' ? 'User' : 'Nothric'}: ${m.text}`)
          .join('\n\n');
        prompt = `Please provide a clean, professional markdown summary of this chat conversation titled "${summaryTitle}". Focus on key discussion points, main questions asked, and any action items or conclusions. Avoid unnecessary pleasantries and structure it beautifully with lists and bold text:\n\n${history}`;
      } else {
        prompt = `The user wants a summary of a chat titled "${summaryTitle}". However, there are no messages in this chat yet. Please provide a brief, professional, and inspiring outline/overview of what this topic typically covers, and how a user can get started with it. Use clean markdown formatting.`;
      }

      const result = await queryGemini(prompt, undefined, 'gemini-2.5-flash-lite');
      setSummaryText(result);

      // Save summary to chat session in DB
      const chats = await getChats();
      const chatSession = chats.find(c => c.id === summarySessionId);
      if (chatSession) {
        chatSession.summary = result;
        await saveChat(chatSession);
        window.dispatchEvent(new Event('chat-sessions-updated'));
      }
    } catch (err: any) {
      console.error('Failed to summarize chat:', err);
      setSummaryError(err.message || 'Failed to generate summary.');
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleDeleteSummary = async () => {
    if (!summarySessionId) return;
    try {
      const chats = await getChats();
      const chatSession = chats.find(c => c.id === summarySessionId);
      if (chatSession) {
        delete chatSession.summary;
        await saveChat(chatSession);
        window.dispatchEvent(new Event('chat-sessions-updated'));
      }
      setSummaryText('');
      setSummaryOpen(false);
    } catch (err) {
      console.error('Failed to delete summary:', err);
    }
  };

  return (
    <SummaryModal
      isOpen={summaryOpen}
      onClose={() => setSummaryOpen(false)}
      chatTitle={summaryTitle}
      summaryText={summaryText}
      isLoading={summaryLoading}
      error={summaryError}
      onExport={handleExportSummary}
      onResummarize={handleResummarize}
      onDeleteSummary={handleDeleteSummary}
    />
  );
}
