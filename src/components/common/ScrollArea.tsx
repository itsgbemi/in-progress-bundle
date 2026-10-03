import React, { forwardRef, useRef, useImperativeHandle, useState, useEffect, useCallback } from 'react';

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  maxHeight?: string | number;
  maxWidth?: string | number;
  orientation?: 'vertical' | 'horizontal' | 'both';
  scrollbar?: 'custom' | 'thin' | 'none';
  showScrollButtons?: boolean;
  scrollStep?: number;
  children: React.ReactNode;
}

/**
 * Reusable ScrollArea component with a custom scrollbar that includes
 * custom double chevron directional arrows above and below the draggable thumb.
 */
export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  (
    {
      maxHeight,
      maxWidth,
      orientation = 'vertical',
      scrollbar = 'custom',
      showScrollButtons = true,
      scrollStep = 40,
      className = '',
      style,
      children,
      ...props
    },
    ref
  ) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => scrollContainerRef.current as HTMLDivElement);

    const [hasOverflow, setHasOverflow] = useState(false);
    const [thumbTop, setThumbTop] = useState(0);
    const [thumbHeight, setThumbHeight] = useState(24);

    const updateScrollbar = useCallback(() => {
      const el = scrollContainerRef.current;
      const track = trackRef.current;
      if (!el) return;

      const overflow = el.scrollHeight > el.clientHeight + 1;
      setHasOverflow(overflow);
      if (!overflow) return;

      const trackHeight = track ? track.clientHeight : Math.max(20, el.clientHeight - 36);
      const ratio = el.clientHeight / el.scrollHeight;
      const calculatedHeight = Math.max(18, Math.min(trackHeight * ratio, trackHeight - 8));
      setThumbHeight(calculatedHeight);

      const scrollRange = el.scrollHeight - el.clientHeight;
      const thumbTravel = Math.max(0, trackHeight - calculatedHeight);
      const currentTop = scrollRange > 0 ? (el.scrollTop / scrollRange) * thumbTravel : 0;
      setThumbTop(Math.max(0, Math.min(currentTop, thumbTravel)));
    }, []);

    useEffect(() => {
      const el = scrollContainerRef.current;
      if (!el) return;

      updateScrollbar();

      // Listen for scroll events
      const handleScroll = () => {
        updateScrollbar();
      };
      el.addEventListener('scroll', handleScroll, { passive: true });

      // Observe content size changes (e.g. expanding dropdown items)
      let resizeObserver: ResizeObserver | null = null;
      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(() => {
          updateScrollbar();
        });
        resizeObserver.observe(el);
        if (el.firstElementChild) {
          resizeObserver.observe(el.firstElementChild);
        }
      }

      window.addEventListener('resize', updateScrollbar);

      return () => {
        el.removeEventListener('scroll', handleScroll);
        resizeObserver?.disconnect();
        window.removeEventListener('resize', updateScrollbar);
      };
    }, [updateScrollbar]);

    // Thumb dragging
    const handleThumbMouseDown = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const el = scrollContainerRef.current;
      const track = trackRef.current;
      if (!el || !track) return;

      const startY = e.clientY;
      const startScrollTop = el.scrollTop;
      const trackHeight = track.clientHeight;
      const scrollRange = el.scrollHeight - el.clientHeight;
      const thumbTravel = Math.max(1, trackHeight - thumbHeight);

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const deltaY = moveEvent.clientY - startY;
        const scrollDelta = (deltaY / thumbTravel) * scrollRange;
        el.scrollTop = startScrollTop + scrollDelta;
      };

      const handleMouseUp = () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    };

    // Track click to jump
    const handleTrackClick = (e: React.MouseEvent) => {
      const el = scrollContainerRef.current;
      const track = trackRef.current;
      if (!el || !track) return;

      const rect = track.getBoundingClientRect();
      const clickY = e.clientY - rect.top;
      const thumbCenter = thumbTop + thumbHeight / 2;

      if (clickY < thumbCenter) {
        el.scrollBy({ top: -el.clientHeight * 0.75, behavior: 'smooth' });
      } else {
        el.scrollBy({ top: el.clientHeight * 0.75, behavior: 'smooth' });
      }
    };

    // Smooth step scroll with hold-to-repeat
    const startScrolling = (direction: -1 | 1) => {
      const el = scrollContainerRef.current;
      if (!el) return;

      el.scrollBy({ top: direction * scrollStep, behavior: 'smooth' });

      let timeout: any = null;
      let interval: any = null;

      timeout = setTimeout(() => {
        interval = setInterval(() => {
          el.scrollBy({ top: direction * (scrollStep * 0.8), behavior: 'auto' });
        }, 60);
      }, 250);

      const stop = () => {
        clearTimeout(timeout);
        clearInterval(interval);
        window.removeEventListener('mouseup', stop);
      };

      window.addEventListener('mouseup', stop);
    };

    const overflowClass =
      orientation === 'vertical'
        ? 'overflow-y-auto overflow-x-hidden'
        : orientation === 'horizontal'
        ? 'overflow-x-auto overflow-y-hidden'
        : 'overflow-auto';

    const containerStyle: React.CSSProperties = {
      ...(maxHeight !== undefined
        ? { maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight }
        : {}),
      ...(maxWidth !== undefined
        ? { maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth }
        : {}),
      ...style,
    };

    // If custom scrollbar is disabled, return native scrollable area
    if (scrollbar === 'none' || scrollbar === 'thin') {
      return (
        <div
          ref={scrollContainerRef}
          style={containerStyle}
          className={`${overflowClass} ${scrollbar === 'none' ? 'no-scrollbar' : 'scrollbar-thin'} ${className}`.trim()}
          {...props}
        >
          {children}
        </div>
      );
    }

    return (
      <div
        style={containerStyle}
        className="relative flex min-w-0 w-full overflow-hidden"
      >
        {/* Inner Scrollable Container */}
        <div
          ref={scrollContainerRef}
          onScroll={(e) => {
            updateScrollbar();
            props.onScroll?.(e);
          }}
          className={`flex-1 min-w-0 ${overflowClass} no-scrollbar ${className}`.trim()}
          {...props}
        >
          {children}
        </div>

        {/* Custom Scrollbar with Up Arrow, Track & Thumb, Down Arrow */}
        {hasOverflow && (
          <div
            className="w-3.5 shrink-0 flex flex-col items-center select-none my-0.5 mr-0.5 transition-opacity opacity-50 hover:opacity-90"
            aria-hidden="true"
          >
            {/* Scroll Up Arrow (above the Thumb) */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                startScrolling(-1);
              }}
              className="w-3.5 h-3.5 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 active:text-slate-700 dark:active:text-slate-200 transition-colors cursor-pointer shrink-0"
              title="Scroll up"
              aria-label="Scroll up"
            >
              <svg
                viewBox="0 0 16 16"
                className="w-2.5 h-2.5 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                style={{ transform: 'rotate(180deg)' }}
              >
                <g>
                  <path d="M3 2v2l5 5 5-5v-2l-5 5z" fill="currentColor" />
                  <path d="M3 7v2l5 5 5-5v-2l-5 5z" fill="currentColor" />
                </g>
              </svg>
            </button>

            {/* Scrollbar Track & Thumb */}
            <div
              ref={trackRef}
              onClick={handleTrackClick}
              className="flex-1 w-full relative cursor-pointer my-0.5"
            >
              <div
                onMouseDown={handleThumbMouseDown}
                style={{
                  top: `${thumbTop}px`,
                  height: `${thumbHeight}px`,
                }}
                className="absolute left-1/2 -translate-x-1/2 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500 active:bg-slate-500 dark:active:bg-slate-400 cursor-grab active:cursor-grabbing transition-colors"
              />
            </div>

            {/* Scroll Down Arrow (below the Thumb) */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                startScrolling(1);
              }}
              className="w-3.5 h-3.5 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 active:text-slate-700 dark:active:text-slate-200 transition-colors cursor-pointer shrink-0"
              title="Scroll down"
              aria-label="Scroll down"
            >
              <svg
                viewBox="0 0 16 16"
                className="w-2.5 h-2.5 fill-current"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g>
                  <path d="M3 2v2l5 5 5-5v-2l-5 5z" fill="currentColor" />
                  <path d="M3 7v2l5 5 5-5v-2l-5 5z" fill="currentColor" />
                </g>
              </svg>
            </button>
          </div>
        )}
      </div>
    );
  }
);

ScrollArea.displayName = 'ScrollArea';
