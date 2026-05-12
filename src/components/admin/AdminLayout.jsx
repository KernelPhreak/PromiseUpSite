import React from 'react';
import { NavLink, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Briefcase, Calendar, Heart, LayoutDashboard, LogOut, Mail, Users } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const nav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/services', label: 'Services', icon: Briefcase },
  { to: '/admin/events', label: 'Events', icon: Calendar },
  { to: '/admin/board', label: 'Board', icon: Users },
  { to: '/admin/messages', label: 'Messages', icon: Mail },
  { to: '/admin/donations', label: 'Donations', icon: Heart },
];

export default function AdminLayout() {
  const location = useLocation();
  const { isAuthenticated, isAdmin, signOut, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <aside className="hidden lg:flex w-72 bg-card border-r border-border p-6 flex-col">
        <div className="mb-8">
          <p className="font-outfit font-bold text-2xl text-foreground">Promise Up</p>
          <p className="font-inter text-sm text-muted-foreground">Admin Dashboard</p>
        </div>
        <nav className="space-y-2 flex-1">
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/admin'} className={({ isActive }) => cn('flex items-center gap-3 rounded-xl px-4 py-3 font-inter text-sm font-medium transition-colors', isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}>
              <item.icon className="w-4 h-4" /> {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="pt-4 border-t border-border space-y-3">
          <p className="font-inter text-xs text-muted-foreground truncate">{user?.email}</p>
          <Button variant="outline" className="w-full justify-start" onClick={signOut}><LogOut className="w-4 h-4 mr-2" /> Sign out</Button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="lg:hidden bg-card border-b border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <p className="font-outfit font-bold text-xl">Promise Up Admin</p>
            <Button variant="outline" size="sm" onClick={signOut}>Sign out</Button>
          </div>
          <nav className="flex gap-2 overflow-x-auto pb-1">
            {nav.map((item) => <NavLink key={item.to} to={item.to} end={item.to === '/admin'} className={({ isActive }) => cn('shrink-0 rounded-full px-3 py-2 text-sm', isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>{item.label}</NavLink>)}
          </nav>
        </header>
        <main className="p-4 sm:p-6 lg:p-10"><Outlet /></main>
      </div>
    </div>
  );
}
