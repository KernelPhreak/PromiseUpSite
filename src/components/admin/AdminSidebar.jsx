import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Calendar, Users, Mail, Heart, ArrowLeft } from 'lucide-react';

const adminLinks = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Services', path: '/admin/services', icon: Briefcase },
  { label: 'Events', path: '/admin/events', icon: Calendar },
  { label: 'Board Members', path: '/admin/board', icon: Users },
  { label: 'Messages', path: '/admin/messages', icon: Mail },
  { label: 'Donations', path: '/admin/donations', icon: Heart },
];

export default function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen p-6 hidden lg:block">
      <Link to="/" className="flex items-center gap-2 mb-8 text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span className="font-inter text-sm">Back to Site</span>
      </Link>

      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <span className="font-outfit font-bold text-primary-foreground text-sm">P</span>
        </div>
        <span className="font-outfit font-bold text-foreground">Admin</span>
      </div>

      <nav className="space-y-1">
        {adminLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-inter font-medium transition-all ${
              location.pathname === link.path
                ? 'bg-primary/10 text-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <link.icon className="w-5 h-5" />
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}