import { cn } from '@/lib/utils';
import React from 'react';

export function Heading({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        'text-2xl font-semibold tracking-tight',
        className,
      )}
      {...props}
    >
      {children}
    </h1>
  );
}
