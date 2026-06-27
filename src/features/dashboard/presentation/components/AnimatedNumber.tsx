"use client";

import { useEffect, useState } from "react";

type Props = {
  value: number;
};

export default function AnimatedNumber({ value }: Props) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const start = current;
    const end = value;
    if (start === end) return;

    const duration = 800; // ms
    const startTime = performance.now();

    let animationFrameId: number;

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing: easeOutQuad
      const ease = progress * (2 - progress);
      const nextValue = Math.floor(start + (end - start) * ease);
      
      setCurrent(nextValue);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(update);
      } else {
        setCurrent(end);
      }
    };

    animationFrameId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <>{current}</>;
}
