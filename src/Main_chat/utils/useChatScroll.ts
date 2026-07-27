import { useRef, useState, useCallback, useEffect } from 'react';

export function useChatScroll() {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);
  const prevScrollTopRef = useRef<number>(0);
  const scrollCallsRef = useRef<number>(0);
  const scrollSchedulerIdRef = useRef<number | null>(null);
  const isAutoScrollingRef = useRef(false);
  const touchStartYRef = useRef<number>(0);
  const targetScrollTopRef = useRef<number | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  const [isAtBottom, setIsAtBottom] = useState(true);

  // Clean up animation frame on unmount
  // 100% True Lenis-Style Liquid Momentum Scroll (non-passive wheel event interceptor)
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const onNativeWheel = (e: WheelEvent) => {
      // Allow trackpad horizontal pinch/swipe, but intercept vertical wheel to override Chrome jumpiness
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      if (container.scrollHeight <= container.clientHeight) return;

      e.preventDefault();

      if (e.deltaY < 0) {
        isAtBottomRef.current = false;
        setIsAtBottom(false);
      }

      if (targetScrollTopRef.current === null) {
        targetScrollTopRef.current = container.scrollTop;
      }

      const maxScroll = container.scrollHeight - container.clientHeight;
      const stepDelta = e.deltaY * 0.95;
      targetScrollTopRef.current = Math.max(0, Math.min(maxScroll, targetScrollTopRef.current + stepDelta));

      if (!animFrameIdRef.current) {
        const lerpStep = () => {
          const target = targetScrollTopRef.current;
          const c = messagesContainerRef.current;
          if (target === null || !c) {
            animFrameIdRef.current = null;
            return;
          }

          const current = c.scrollTop;
          const diff = target - current;

          // Silky 10% LERP factor for buttery Lenis inertia physics
          if (Math.abs(diff) > 0.3) {
            isAutoScrollingRef.current = true;
            c.scrollTop += diff * 0.10;
            animFrameIdRef.current = requestAnimationFrame(lerpStep);
          } else {
            c.scrollTop = target;
            targetScrollTopRef.current = null;
            animFrameIdRef.current = null;
          }
        };
        animFrameIdRef.current = requestAnimationFrame(lerpStep);
      }
    };

    container.addEventListener('wheel', onNativeWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', onNativeWheel);
      if (scrollSchedulerIdRef.current) {
        cancelAnimationFrame(scrollSchedulerIdRef.current);
      }
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  const handleWheel = useCallback((_e: React.WheelEvent<HTMLDivElement>) => {
    // Handled natively by non-passive listener for 100% buttery smooth Lenis scrolling
  }, []);

  const scheduleScrollToBottom = useCallback(() => {
    if (!isAtBottomRef.current) return;
    if (scrollSchedulerIdRef.current) return;

    scrollSchedulerIdRef.current = requestAnimationFrame(() => {
      scrollSchedulerIdRef.current = null;
      if (!isAtBottomRef.current) return;
      const container = messagesContainerRef.current;
      if (container) {
        const newScrollTop = container.scrollHeight - container.clientHeight;
        if (Math.abs(container.scrollTop - newScrollTop) > 1) {
          scrollCallsRef.current++;
          isAutoScrollingRef.current = true;
          container.scrollTop = newScrollTop;
        }
      }
    });
  }, []);

  const handleJumpToBottom = useCallback(() => {
    isAtBottomRef.current = true;
    setIsAtBottom(true);
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, []);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = container;
    const maxScroll = scrollHeight - clientHeight;

    const scrollTopChanged = Math.abs(scrollTop - prevScrollTopRef.current) > 1;
    const threshold = Math.max(100, clientHeight / 2);
    const atBottom = maxScroll - scrollTop <= threshold;
    const scrolledUp = scrollTop < prevScrollTopRef.current - 1;

    if (isAutoScrollingRef.current) {
      isAutoScrollingRef.current = false;
      prevScrollTopRef.current = scrollTop;
      return;
    }

    if (maxScroll > 0) {
      if (scrollTopChanged && scrolledUp) {
        // Disable auto-scroll instantly when the viewport is scrolled upward
        // but only if we have scrolled up past the threshold
        if (!atBottom) {
          isAtBottomRef.current = false;
          setIsAtBottom(false);
        }
      } else if (atBottom) {
        isAtBottomRef.current = true;
        setIsAtBottom(true);
      }
    }

    prevScrollTopRef.current = scrollTop;
  }, []);



  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    touchStartYRef.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const container = messagesContainerRef.current;
    const touchY = e.touches[0].clientY;
    // Swipe down on screen moves page scroll viewport UP
    if (touchY > touchStartYRef.current + 5 && container && container.scrollHeight > container.clientHeight) {
      isAtBottomRef.current = false;
      setIsAtBottom(false);
    }
  }, []);

  return {
    messagesContainerRef,
    isAtBottom,
    setIsAtBottom,
    isAtBottomRef,
    scrollCallsRef,
    scheduleScrollToBottom,
    handleJumpToBottom,
    handleScroll,
    handleWheel,
    handleTouchStart,
    handleTouchMove
  };
}
