import React from 'react';
import { cn } from '@/lib/utils';
export function Badge({ className, variant = 'default', ...props }) {
  return <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold', variant === 'secondary' ? 'bg-secondary text-secondary-foreground' : 'bg-primary text-primary-foreground', className)} {...props} />;
}
