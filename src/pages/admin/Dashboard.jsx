import React, { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';
import { Briefcase, Calendar, Users, Mail, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

async function getTableCount(tableName) {
  const { count, error } = await supabase
    .from(tableName)
    .select('*', {
      count: 'exact',
      head: true,
    });

  if (error) {
    console.error(`Error loading ${tableName} count:`, error);
    throw error;
  }

  return count || 0;
}

async function getUnreadCount(tableName) {
  const { count, error } = await supabase
    .from(tableName)
    .select('*', {
      count: 'exact',
      head: true,
    })
    .eq('is_read', false);

  if (error) {
    console.error(`Error loading ${tableName} unread count:`, error);
    throw error;
  }

  return count || 0;
}

export default function Dashboard() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('admin-dashboard-counts')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'services' },
        () => queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] })
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'events' },
        () => queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] })
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'board_members' },
        () => queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] })
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'contact_messages' },
        () => queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] })
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'donation_inquiries' },
        () => queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] })
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const { data: dashboardCounts = {}, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const [
        services,
        events,
        boardMembers,
        messages,
        unreadMessages,
        donations,
        unreadDonations,
      ] = await Promise.all([
        getTableCount('services'),
        getTableCount('events'),
        getTableCount('board_members'),
        getTableCount('contact_messages'),
        getUnreadCount('contact_messages'),
        getTableCount('donation_inquiries'),
        getUnreadCount('donation_inquiries'),
      ]);

      return {
        services,
        events,
        boardMembers,
        messages,
        unreadMessages,
        donations,
        unreadDonations,
      };
    },
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const stats = [
    {
      label: 'Services',
      count: dashboardCounts.services || 0,
      icon: Briefcase,
      path: '/admin/services',
      color: 'bg-amber-100 text-amber-700',
    },
    {
      label: 'Events',
      count: dashboardCounts.events || 0,
      icon: Calendar,
      path: '/admin/events',
      color: 'bg-blue-100 text-blue-700',
    },
    {
      label: 'Board Members',
      count: dashboardCounts.boardMembers || 0,
      icon: Users,
      path: '/admin/board',
      color: 'bg-emerald-100 text-emerald-700',
    },
    {
      label: 'Messages',
      count: dashboardCounts.messages || 0,
      badge: dashboardCounts.unreadMessages || 0,
      icon: Mail,
      path: '/admin/messages',
      color: 'bg-purple-100 text-purple-700',
    },
    {
      label: 'Donation Inquiries',
      count: dashboardCounts.donations || 0,
      badge: dashboardCounts.unreadDonations || 0,
      icon: Heart,
      path: '/admin/donations',
      color: 'bg-pink-100 text-pink-700',
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-outfit font-bold text-3xl text-foreground">
          Dashboard
        </h1>

        {isLoading && (
          <span className="font-inter text-sm text-muted-foreground">
            Updating counts...
          </span>
        )}
      </div>

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