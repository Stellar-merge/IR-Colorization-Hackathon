import React, { useEffect, useState } from "react";

// 1. RevealSection: Staggers children using native CSS animation delay injection
export function RevealSection({ children, className, delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) {
  const childrenArray = React.Children.toArray(children);
  
  const childrenWithDelay = childrenArray.map((child, index) => {
    if (React.isValidElement(child)) {
      const typedChild = child as React.ReactElement<{ style?: React.CSSProperties }>;
      return React.cloneElement(typedChild, {
        style: {
          ...(typedChild.props.style || {}),
          animationDelay: `${delay + index * 0.12}s`,
        }
      });
    }
    return child;
  });

  return (
    <div className={className}>
      {childrenWithDelay}
    </div>
  );
}

// 2. FlickerText: Standard text span wrapper (flicker removed)
export function FlickerText({ children, className, delay = 0, style }: { children: React.ReactNode, className?: string, delay?: number, style?: React.CSSProperties }) {
  return (
    <span 
      className={className}
      style={style}
    >
      {children}
    </span>
  );
}

// 3. AnimatedHeading: Native CSS slide up and glow
export function AnimatedHeading({ children, className, delay = 0, style }: { children: React.ReactNode, className?: string, delay?: number, style?: React.CSSProperties }) {
  return (
    <div 
      className={`${className || ""} animate-heading`}
      style={{
        ...style,
        animationDelay: style?.animationDelay || `${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// 4. FadeCard: Native CSS scale/fade reveal
export function FadeCard({ children, className, style }: { children: React.ReactNode, className?: string, style?: React.CSSProperties }) {
  return (
    <div 
      className={`${className || ""} animate-fade-card`}
      style={style}
    >
      {children}
    </div>
  );
}

// 5. AnimatedImage: Native CSS zoom/blur-reduction reveal
export function AnimatedImage({ src, alt, className, style }: { src: string, alt: string, className?: string, style?: React.CSSProperties }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={`${className || ""} animate-image-reveal`}
      style={style}
    />
  );
}

// 6. AnimatedMetric: High-performance, pure JS requestAnimationFrame count up
export function AnimatedMetric({ value, className }: { value: number | string, className?: string }) {
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, "")) : value;
  const isNaN = Number.isNaN(numValue);
  
  const [displayVal, setDisplayVal] = useState(0);

  useEffect(() => {
    if (isNaN) return;
    
    const start = 0;
    const end = numValue;
    const duration = 1200; // 1.2s count up
    const startTime = performance.now();

    let animationFrameId: number;

    function update(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const ease = 1 - Math.pow(1 - progress, 4);
      
      setDisplayVal(start + (end - start) * ease);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(update);
      }
    }

    animationFrameId = requestAnimationFrame(update);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [numValue, isNaN]);

  if (isNaN) {
    return <span className={className}>{value}</span>;
  }

  let formatted = "";
  if (typeof value === 'string' && value.includes('.')) {
    const decimalParts = value.split('.')[1] || "";
    const precision = decimalParts.replace(/[^0-9]/g, "").length;
    formatted = displayVal.toFixed(precision);
  } else {
    formatted = Math.floor(displayVal).toString();
  }

  const suffix = typeof value === 'string' && value.includes('%') ? '%' : '';
  const timeSuffix = typeof value === 'string' && value.endsWith('s') ? 's' : '';

  return (
    <span className={className}>
      {formatted}{suffix}{timeSuffix}
    </span>
  );
}
