import React, { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Heart, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/events', label: 'Events' },
  { to: '/about', label: 'About' },
  { to: '/donate', label: 'Donate' },
  { to: '/contact', label: 'Contact' },
];

function NavItems({ onClick }) {
  return links.map((link) => (
    <NavLink
      key={link.to}
      to={link.to}
      onClick={onClick}
      className={({ isActive }) => cn('font-inter text-sm font-medium transition-colors hover:text-primary', isActive ? 'text-primary' : 'text-foreground')}
    >
      {link.label}
    </NavLink>
  ));
}

export default function PublicLayout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-outfit font-bold text-xl text-foreground">Promise Up</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8"><NavItems /></nav>
          <button className="md:hidden" type="button" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <nav className="md:hidden border-t border-border bg-background px-6 py-5 flex flex-col gap-4">
            <NavItems onClick={() => setOpen(false)} />
          </nav>
        )}
      </header>

      <main><Outlet /></main>

      <footer className="border-t border-border bg-muted/30 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between gap-4">
          <p className="font-inter text-sm text-muted-foreground">© {new Date().getFullYear()} Promise Up. Free community services for Southeast Missouri.</p>
          <Link to="/admin" className="font-inter text-sm text-muted-foreground hover:text-primary">Admin</Link>
        </div>
      </footer>
    </div>
  );
}
