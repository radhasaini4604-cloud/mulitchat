import { useState, useEffect, useRef } from 'react';
import { parseMarkdown } from '../../Main_chat/utils/markdownParser';

interface TypewriterProps {
  text: string;
  speed?: number; // base typing speed in ms
  onComplete?: () => void;
  isStopped?: boolean;
  onTextUpdate?: () => void;
}

/**
 * Premium typewriter component simulating realistic typing flow with a glowing cursor dot.
 */
export function Typewriter({ text, speed = 12, onComplete, isStopped, onTextUpdate }: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const textRef = useRef(text);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (isStopped) {
      setIsTyping(false);
      onCompleteRef.current?.();
      return;
    }

    textRef.current = text;
    setDisplayedText('');
    setIsTyping(true);

    if (!text) {
      setIsTyping(false);
      onCompleteRef.current?.();
      return;
    }

    let currentIndex = 0;
    let timerId: any;

    const type = () => {
      if (currentIndex < text.length) {
        const nextChar = text.charAt(currentIndex);
        setDisplayedText((prev) => prev + nextChar);
        currentIndex++;
        
        // Add subtle timing jitter to feel organic like ChatGPT typing
        const jitter = (Math.random() - 0.5) * speed * 0.4;
        timerId = setTimeout(type, Math.max(1, speed + jitter));
      } else {
        setIsTyping(false);
        onCompleteRef.current?.();
      }
    };

    timerId = setTimeout(type, speed);

    return () => clearTimeout(timerId);
  }, [text, speed, isStopped]);

  useEffect(() => {
    if (onTextUpdate) {
      onTextUpdate();
    }
  }, [displayedText, onTextUpdate]);

  const htmlContent = parseMarkdown(displayedText);

  return (
    <div 
      className={`assistant-markdown-content ${isTyping ? 'streaming' : ''}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
