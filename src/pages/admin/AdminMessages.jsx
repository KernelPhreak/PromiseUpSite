import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, MailOpen, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

const reasonLabels = {
  request_service: 'Request Service',
  donate: 'Donate',
  volunteer: 'Volunteer',
  partner: 'Partner',
  question: 'Question',
};

export default function AdminMessages() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: messages = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['admin-messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_date', { ascending: false });

      if (error) {
        console.error('Error loading contact messages:', error);
        throw error;
      }

      return data || [];
    },
    initialData: [],
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const { data: updated, error } = await supabase
        .from('contact_messages')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating contact message:', error);
        throw error;
      }

      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
    },
    onError: (error) => {
      toast({
        title: 'Could not update message',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting contact message:', error);
        throw error;
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
      toast({ title: 'Message deleted' });
    },
    onError: (error) => {
      toast({
        title: 'Could not delete message',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return (
    <div>
      <h1 className="font-outfit font-bold text-3xl text-foreground mb-8">
        Contact Messages
      </h1>

      {isLoading ? (
        <div className="text-center py-12">
          <Mail className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4 animate-pulse" />
          <p className="font-inter text-muted-foreground">
            Loading messages...
          </p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <Mail className="w-12 h-12 text-destructive/30 mx-auto mb-4" />
          <p className="font-inter text-destructive">
            Could not load messages.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`bg-card rounded-2xl p-6 shadow-sm border transition-colors ${
                msg.is_read
                  ? 'border-border/50'
                  : 'border-primary/30 bg-primary/5'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-outfit font-bold text-foreground">
                    {msg.name}
                  </h3>

                  <Badge variant="secondary" className="font-inter text-xs">
                    {reasonLabels[msg.reason] || msg.reason}
                  </Badge>

                  {!msg.is_read && (
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
                        id: msg.id,
                        data: { is_read: !msg.is_read },
                      })
                    }
                    disabled={updateMutation.isPending}
                    title={msg.is_read ? 'Mark unread' : 'Mark read'}
                  >
                    {msg.is_read ? (
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
                        `Delete message from ${msg.name}?`
                      );

                      if (confirmed) {
                        deleteMutation.mutate(msg.id);
                      }
                    }}
                    className="text-destructive"
                    disabled={deleteMutation.isPending}
                    title="Delete message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <p className="font-inter text-sm text-muted-foreground mb-2">
                {msg.email} {msg.phone && `• ${msg.phone}`}
              </p>

              {msg.message && (
                <p className="font-inter text-foreground whitespace-pre-wrap">
                  {msg.message}
                </p>
              )}

              <p className="font-inter text-xs text-muted-foreground mt-3">
                {msg.created_date &&
                  format(new Date(msg.created_date), 'MMM d, yyyy h:mm a')}
              </p>
            </div>
          ))}

          {messages.length === 0 && (
            <div className="text-center py-12">
              <Mail className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
              <p className="font-inter text-muted-foreground">
                No messages yet.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}