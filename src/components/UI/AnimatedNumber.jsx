import { useEffect, useRef } from 'react';

export default function AnimatedNumber({ value, duration = 600, decimals = 0, className = '' }) {
  const spanRef = useRef(null);
  const startValueRef = useRef(Number(value) || 0);
  const frameRef = useRef(null);

  useEffect(() => {
    const startVal = startValueRef.current;
    const endVal = Number(value) || 0;
    const diff = endVal - startVal;

    if (diff === 0) return;

    if (frameRef.current) cancelAnimationFrame(frameRef.current);

    let startTime = null;

    const format = (v) =>
      decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString();

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startVal + diff * eased;

      if (spanRef.current) spanRef.current.textContent = format(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        startValueRef.current = endVal;
        if (spanRef.current) spanRef.current.textContent = format(endVal);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [value, duration, decimals]);

  const initial =
    decimals > 0
      ? (Number(value) || 0).toFixed(decimals)
      : Math.round(Number(value) || 0).toLocaleString();

  return <span ref={spanRef} className={className}>{initial}</span>;
}
