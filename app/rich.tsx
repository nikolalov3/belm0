import React from 'react';

/** Renders copy strings with **bold** and _italic_ markers as <strong> / <em>. */
export function rich(text: string): React.ReactNode[] {
  return text.split(/(\*\*.+?\*\*|_.+?_)/g).map((part, i) => {
    if (part.startsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('_') && part.length > 2) return <em key={i}>{part.slice(1, -1)}</em>;
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

/** Yume wordmark drawn in currentColor (CSS mask), so it follows link and hover colours. */
export function YumeMark({ className = '' }: { className?: string }) {
  return <span className={`yume-mark ${className}`.trim()} role="img" aria-label="Yume" />;
}
