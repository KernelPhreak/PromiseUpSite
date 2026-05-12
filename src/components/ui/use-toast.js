import { toast as sonnerToast } from 'sonner';
export function useToast() {
  return {
    toast({ title, description, variant } = {}) {
      const message = title || description || 'Done';
      const opts = description && title ? { description } : undefined;
      if (variant === 'destructive') return sonnerToast.error(message, opts);
      return sonnerToast.success(message, opts);
    },
  };
}
