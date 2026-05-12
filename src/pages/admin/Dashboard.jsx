import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';
import { Briefcase, Calendar, Users, Mail, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { data: services = [] } = useQuery({
    queryKey: ['admin-services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('id');

      if (error) {
        console.error('Error loading services count:', error);
        throw error;
      }

      return data || [];
    },
    initialData: [],
  });

  const { data: events = [] } = useQuery({
    queryKey: ['admin-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('id');

      if (error) {
        console.error('Error loading events count:', error);
        throw error;
      }

      return data || [];
    },
    initialData: [],
  });

  const { data: boardMembers = [] } = useQuery({
    queryKey: ['admin-board'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('board_members')
        .select('id');

      if (error) {
        console.error('Error loading board members count:', error);
        throw error;
      }

      return data || [];
    },
    initialData: [],
  });

  const { data: messages = [] } = useQuery({
    queryKey: ['admin-messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('id, is_read');

      if (error) {
        console.error('Error loading messages count:', error);
        throw error;
      }

      return data || [];
    },
    initialData: [],
  });

  const { data: donations = [] } = useQuery({
    queryKey: ['admin-donations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('donation_inquiries')
        .select('id, is_read');

      if (error) {
        console.error('Error loading donation inquiries count:', error);
        throw error;
      }

      return data || [];
    },
    initialData: [],
  });

  const unreadMessages = messages.filter((m) => !m.is_read).length;
  const unreadDonations = donations.filter((d) => !d.is_read).length;

  const stats = [
    {
      label: 'Services',
      count: services.length,
      icon: Briefcase,
      path: '/admin/services',
      color: 'bg-amber-100 text-amber-700',
    },
    {
      label: 'Events',
      count: events.length,
      icon: Calendar,
      path: '/admin/events',
      color: 'bg-blue-100 text-blue-700',
    },
    {
      label: 'Board Members',
      count: boardMembers.length,
      icon: Users,
      path: '/admin/board',
      color: 'bg-emerald-100 text-emerald-700',
    },
    {
      label: 'Messages',
      count: messages.length,
      badge: unreadMessages,
      icon: Mail,
      path: '/admin/messages',
      color: 'bg-purple-100 text-purple-700',
    },
    {
      label: 'Donation Inquiries',
      count: donations.length,
      badge: unreadDonations,
      icon: Heart,
      path: '/admin/donations',
      color: 'bg-pink-100 text-pink-700',
    },
  ];

  return (
    <div>
      <h1 className="font-outfit font-bold text-3xl text-foreground mb-8">
        Dashboard
      </h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Link key={stat.label} to={stat.path} className="block">
            <div className="bg-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-border/50">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}
                >
                  <stat.icon className="w-6 h-6" />
                </div>

                {stat.badge > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full px-2.5 py-1">
                    {stat.badge} new
                  </span>
                )}
              </div>

              <p className="font-outfit font-bold text-3xl text-foreground">
                {stat.count}
              </p>

              <p className="font-inter text-sm text-muted-foreground">
                {stat.label}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}