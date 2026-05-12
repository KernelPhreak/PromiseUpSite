import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

const categories = [
  { value: 'photo_event', label: 'Photo Event' },
  { value: 'school_supplies', label: 'School Supplies' },
  { value: 'community_event', label: 'Community Event' },
  { value: 'hobby_event', label: 'Hobby Event' },
];

const emptyForm = {
  title: '',
  description: '',
  date: '',
  time: '',
  location: '',
  category: '',
  image_url: '',
  is_active: true,
};

export default function AdminEvents() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const {
    data: events = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['admin-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Error loading events:', error);
        throw error;
      }

      return data || [];
    },
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const { data: created, error } = await supabase
        .from('events')
        .insert([data])
        .select()
        .single();

      if (error) {
        console.error('Error creating event:', error);
        throw error;
      }

      return created;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      queryClient.invalidateQueries({ queryKey: ['events-preview'] });
      closeDialog();
      toast({ title: 'Event created' });
    },
    onError: (error) => {
      toast({
        title: 'Could not create event',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const { data: updated, error } = await supabase
        .from('events')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating event:', error);
        throw error;
      }

      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      queryClient.invalidateQueries({ queryKey: ['events-preview'] });
      closeDialog();
      toast({ title: 'Event updated' });
    },
    onError: (error) => {
      toast({
        title: 'Could not update event',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting event:', error);
        throw error;
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      queryClient.invalidateQueries({ queryKey: ['events-preview'] });
      toast({ title: 'Event deleted' });
    },
    onError: (error) => {
      toast({
        title: 'Could not delete event',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (event) => {
    setEditing(event);
    setForm({
      title: event.title || '',
      description: event.description || '',
      date: event.date || '',
      time: event.time || '',
      location: event.location || '',
      category: event.category || '',
      image_url: event.image_url || '',
      is_active: event.is_active ?? true,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditing(null);
    setForm(emptyForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      title: form.title,
      description: form.description,
      date: form.date,
      time: form.time,
      location: form.location,
      category: form.category,
      image_url: form.image_url,
      is_active: Boolean(form.is_active),
    };

    if (editing) {
      updateMutation.mutate({ id: editing.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-outfit font-bold text-3xl text-foreground">
          Events
        </h1>

        <Button
          onClick={openCreate}
          className="rounded-full font-inter bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Event
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="font-inter text-muted-foreground">Loading events...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="font-inter text-destructive">
            Could not load events.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-card rounded-2xl p-6 shadow-sm border border-border/50 flex items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-outfit font-bold text-lg text-foreground">
                    {event.title}
                  </h3>

                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {categories.find((c) => c.value === event.category)
                      ?.label || event.category}
                  </span>

                  {!event.is_active && (
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                      Draft
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground font-inter">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {event.date
                      ? format(new Date(`${event.date}T00:00:00`), 'MMM d, yyyy')
                      : 'No date'}
                  </span>

                  {event.location && <span>{event.location}</span>}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => openEdit(event)}
                  className="rounded-lg"
                >
                  <Pencil className="w-4 h-4" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const confirmed = window.confirm(
                      `Delete event "${event.title}"?`
                    );

                    if (confirmed) {
                      deleteMutation.mutate(event.id);
                    }
                  }}
                  className="rounded-lg text-destructive hover:text-destructive"
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          {events.length === 0 && (
            <div className="text-center py-12">
              <p className="font-inter text-muted-foreground">
                No events yet. Add your first event.
              </p>
            </div>
          )}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-outfit">
              {editing ? 'Edit Event' : 'Add Event'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Category *</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm({ ...form, category: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>

                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date *</Label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm({ ...form, date: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Time</Label>
                <Input
                  value={form.time}
                  onChange={(e) =>
                    setForm({ ...form, time: e.target.value })
                  }
                  placeholder="10:00 AM - 2:00 PM"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={form.location}
                onChange={(e) =>
                  setForm({ ...form, location: e.target.value })
                }
                placeholder="Event location"
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input
                value={form.image_url}
                onChange={(e) =>
                  setForm({ ...form, image_url: e.target.value })
                }
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={form.is_active}
                onCheckedChange={(v) =>
                  setForm({ ...form, is_active: v })
                }
              />
              <Label>Published</Label>
            </div>

            <Button
              type="submit"
              disabled={isSaving}
              className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSaving
                ? 'Saving...'
                : editing
                  ? 'Update Event'
                  : 'Create Event'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}