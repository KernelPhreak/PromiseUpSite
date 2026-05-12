import React from 'react';
import { cn } from '@/lib/utils';

const SelectContext = React.createContext(null);

export function Select({ value, onValueChange, children }) {
  return <SelectContext.Provider value={{ value, onValueChange }}>{children}</SelectContext.Provider>;
}

export function SelectTrigger({ className, children }) {
  const ctx = React.useContext(SelectContext);
  const options = React.Children.toArray(children).flatMap((child) => child?.props?.children ? React.Children.toArray(child.props.children) : []);
  return (
    <select
      value={ctx?.value || ''}
      onChange={(e) => ctx?.onValueChange?.(e.target.value)}
      className={cn('flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', className)}
    >
      <option value="" disabled>Select...</option>
      {options.map((option) => option)}
    </select>
  );
}
export function SelectValue() { return null; }
export function SelectContent({ children }) { return <>{children}</>; }
export function SelectItem({ value, children }) { return <option value={value}>{children}</option>; }
