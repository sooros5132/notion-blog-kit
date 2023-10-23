'use client';

import { cn } from '@/lib/utils';
import { throttle } from 'lodash';
import { useState, useRef, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import { Button } from '../ui/button';

export function ScrollTopButton() {
  const [visibleScrollTopButton, setVisibleScrollTopButton] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const SvgBorderRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    let prevYOffset = window.scrollY || 0;
    const circumference = 87.9;

    const scrollEvent = () => {
      const gap = document.body.scrollHeight - window.innerHeight;
      const progress = 100 * (window.scrollY / gap);
      const correctProgress = Math.max(0, Math.min(progress || 0, 100));

      const dashoffset = (correctProgress / 100) * circumference;

      const svgBorderEl = SvgBorderRef.current;
      if (svgBorderEl) {
        svgBorderEl.style.strokeDashoffset = (circumference - dashoffset).toFixed(1);
        svgBorderEl.style.strokeDasharray = circumference.toFixed(1);
      }
      const nextYOffset = window.scrollY;
      if (
        window.scrollY < 100 ||
        Math.round(window.innerHeight + window.scrollY) >
          Math.round(document.body.scrollHeight - 50)
      ) {
        setVisibleScrollTopButton(false);
        return;
      } else {
        setVisibleScrollTopButton(true);
      }
      prevYOffset = nextYOffset;
    };

    const throttleScrollEvent = throttle(scrollEvent, 100);

    scrollEvent();
    window.addEventListener('scroll', throttleScrollEvent);
    return () => window.removeEventListener('scroll', throttleScrollEvent);
  }, []);

  const handleClickScrollTopButton = () => {
    if (window && window.scrollTo) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      const buttonEl = buttonRef.current;
      if (buttonEl) {
        // .focus() is safari support
        buttonEl.focus();
        setTimeout(() => {
          buttonEl.blur();
        }, 1000);
      }
    }
  };

  return (
    <div
      className={cn(
        'fixed bottom-3 right-3 z-10 transition-[opacity_scale] duration-300 rounded-full bg-background hover:scale-110',
        visibleScrollTopButton ? 'opacity-100' : 'pointer-events-none opacity-0'
      )}
    >
      <Button
        ref={buttonRef}
        size='icon'
        variant='ghost'
        tabIndex={-1}
        className='relative w-[30px] h-[30px] shadow-md rounded-full overflow-hidden ring-0 group hover:bg-background'
        onClick={handleClickScrollTopButton}
      >
        <FaArrowUp className='transition-transform duration-1000 group-focus:-translate-y-[200%] group-active:-translate-y-[200%]' />
        <svg
          ref={SvgBorderRef}
          className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[inherit] h-[inherit] stroke-green-500 fill-transparent stroke-2 -rotate-90 transition-all'
          viewBox='0 0 30 30'
        >
          <circle cx='15' cy='15' r='14' />
        </svg>
      </Button>
    </div>
  );
}
