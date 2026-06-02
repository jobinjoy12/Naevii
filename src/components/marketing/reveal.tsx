'use client';


import { useEffect, useRef, useState } from 'react';


type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};


export function Reveal({
  children,
  className = '',
  delay = 0,
  y = 28,
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);


  useEffect(() => {
    const node = ref.current;
    if (!node) return;


    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(node);
        }
      },
      {
        threshold: 0.14,
        rootMargin: '0px 0px -8% 0px',
      }
    );


    observer.observe(node);


    return () => {
      observer.disconnect();
    };
  }, []);


  return (
    <div
      ref={ref}
      className={[
        'will-change-transform transition-[opacity,transform,filter] duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
        visible ? 'opacity-100 blur-0' : 'opacity-0 blur-[6px]',
        className,
      ].join(' ')}
      style={{
        transitionDelay: `${delay}ms`,
        transform: visible ? 'translate3d(0,0,0)' : `translate3d(0,${y}px,0)`,
      }}
    >
      {children}
    </div>
  );
}