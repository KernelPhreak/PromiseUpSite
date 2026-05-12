import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Mail, MailOpen, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

const typeLabels = {
  monetary: 'Monetary',
  school_supplies: 'School Supplies',
  photography_supplies: 'Photography Supplies',
  backdrops_props: 'Backdrops & Props',
  hobby_materials: 'Hobby Materials',
  event_supplies: 'Event Supplies',
  other: 'Other',
};

export default function AdminDonations() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: donations = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['admin-donations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('donation_inquiries')
        .select('*')
        .order('created_date', { ascending: false });

      if (error) {
        console.error('Error loading donation inquiries:', error);
        throw error;
      }

      return data || [];
    },
    initialData: [],
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const { data: updated, error } = await supabase
        .from('donation_inquiries')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating donation inquiry:', error);
        throw error;
      }

      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-donations'] });
    },
    onError: (error) => {
      toast({
        title: 'Could not update donation inquiry',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('donation_inquiries')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting donation inquiry:', error);
        throw error;
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-donations'] });
      toast({ title: 'Donation inquiry deleted' });
    },
    onError: (error) => {
      toast({
        title: 'Could not delete donation inquiry',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return (
    <div>
      <h1 className="font-outfit font-bold text-3xl text-foreground mb-8">
        Donation Inquiries
      </h1>

      {isLoading ? (
        <div className="text-center py-12">
          <Heart className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4 animate-pulse" />
          <p className="font-inter text-muted-foreground">
            Loading donation inquiries...
          </p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <Heart className="w-12 h-12 text-destructive/30 mx-auto mb-4" />
          <p className="font-inter text-destructive">
            Could not load donation inquiries.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {donations.map((d) => (
            <div
              key={d.id}
              className={`bg-card rounded-2xl p-6 shadow-sm border transition-colors ${
                d.is_read
                  ? 'border-border/50'
                  : 'border-primary/30 bg-primary/5'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-outfit font-bold text-foreground">
                    {d.name}
                  </h3>

                  <Badge variant="secondary" className="font-inter text-xs">
                    {typeLabels[d.donation_type] || d.donation_type}
                  </Badge>

                  {!d.is_read && (
                    <Badge className="bg-primary text-primary-foreground text-xs">
                      New
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      updateMutation.mutate({
                        id: d.id,
                        data: { is_read: !d.is_read },
                      })
                    }
                    disabled={updateMutation.isPending}
                    title={d.is_read ? 'Mark as unread' : 'Mark as read'}
                  >
                    {d.is_read ? (
                      <MailOpen className="w-4 h-4" />
                    ) : (
                      <Mail className="w-4 h-4" />
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const confirmed = window.confirm(
                        `Delete donation inquiry from ${d.name}?`
                      );

                      if (confirmed) {
                        deleteMutation.mutate(d.id);
                      }
                    }}
                    className="text-destructive"
                    disabled={deleteMutation.isPending}
                    title="Delete inquiry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <p className="font-inter text-sm text-muted-foreground mb-2">
                {d.email} {d.phone && `• ${d.phone}`}
              </p>

              {d.message && (
                <p className="font-inter text-foreground whitespace-pre-wrap">
                  {d.message}
                </p>
              )}

              <p className="font-inter text-xs text-muted-foreground mt-3">
                {d.created_date &&
                  format(new Date(d.created_date), 'MMM d, yyyy h:mm a')}
              </p>
            </div>
          ))}

          {donations.length === 0 && (
            <div className="text-center py-12">
              <Heart className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
              <p className="font-inter text-muted-foreground">
                No donation inquiries yet.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}