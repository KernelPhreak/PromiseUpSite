import React from 'react';
import { cn } from '@/lib/utils';
export function Dialog({ open, onOpenChange, children }) {
  if (!open) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onMouseDown={() => onOpenChange?.(false)}>{children}</div>;
}
export function DialogContent({ className, children, ...props }) {
  return <div className={cn('w-full max-w-lg rounded-2xl bg-card p-6 shadow-xl border border-border', className)} onMouseDown={(e) => e.stopPropagation()} {...props}>{children}</div>;
}
export function DialogHeader({ className, ...props }) { return <div className={cn('mb-4', className)} {...props} />; }
export function DialogTitle({ className, ...props }) { return <h2 className={cn('text-lg font-semibold', className)} {...props} />; }
