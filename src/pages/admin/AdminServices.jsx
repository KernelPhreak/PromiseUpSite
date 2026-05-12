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
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const categories = [
  { value: 'photo_sessions', label: 'Photo Sessions' },
  { value: 'school_supplies', label: 'School Supplies' },
  { value: 'community_events', label: 'Community Events' },
  { value: 'hobby_events', label: 'Hobby Events' },
];

const emptyForm = {
  title: '',
  description: '',
  who_it_helps: '',
  how_to_participate: '',
  icon: '',
  image_url: '',
  category: '',
  order: 0,
  is_active: true,
};

export default function AdminServices() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const {
    data: services = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['admin-services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('order', { ascending: true });

      if (error) {
        console.error('Error loading services:', error);
        throw error;
      }

      return data || [];
    },
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const { data: created, error } = await supabase
        .from('services')
        .insert([data])
        .select()
        .single();

      if (error) {
        console.error('Error creating service:', error);
        throw error;
      }

      return created;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      queryClient.invalidateQueries({ queryKey: ['services'] });
      closeDialog();
      toast({ title: 'Service created' });
    },
    onError: (error) => {
      toast({
        title: 'Could not create service',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const { data: updated, error } = await supabase
        .from('services')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating service:', error);
        throw error;
      }

      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      queryClient.invalidateQueries({ queryKey: ['services'] });
      closeDialog();
      toast({ title: 'Service updated' });
    },
    onError: (error) => {
      toast({
        title: 'Could not update service',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting service:', error);
        throw error;
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({ title: 'Service deleted' });
    },
    onError: (error) => {
      toast({
        title: 'Could not delete service',
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

  const openEdit = (service) => {
    setEditing(service);
    setForm({
      title: service.title || '',
      description: service.description || '',
      who_it_helps: service.who_it_helps || '',
      how_to_participate: service.how_to_participate || '',
      icon: service.icon || '',
      image_url: service.image_url || '',
      category: service.category || '',
      order: service.order || 0,
      is_active: service.is_active ?? true,
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
      who_it_helps: form.who_it_helps,
      how_to_participate: form.how_to_participate,
      icon: form.icon,
      image_url: form.image_url,
      category: form.category,
      order: Number(form.order) || 0,
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
          Services
        </h1>

        <Button
          onClick={openCreate}
          className="rounded-full font-inter bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Service
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="font-inter text-muted-foreground">
            Loading services...
          </p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="font-inter text-destructive">
            Could not load services.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-card rounded-2xl p-6 shadow-sm border border-border/50 flex items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-outfit font-bold text-lg text-foreground truncate">
                    {service.title}
                  </h3>

                  {!service.is_active && (
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                      Inactive
                    </span>
                  )}
                </div>

                <p className="font-inter text-sm text-muted-foreground truncate">
                  {service.description}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => openEdit(service)}
                  className="rounded-lg"
                >
                  <Pencil className="w-4 h-4" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const confirmed = window.confirm(
                      `Delete service "${service.title}"?`
                    );

                    if (confirmed) {
                      deleteMutation.mutate(service.id);
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

          {services.length === 0 && (
            <div className="text-center py-12">
              <p className="font-inter text-muted-foreground">
                No services yet. Add your first service.
              </p>
            </div>
          )}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-outfit">
              {editing ? 'Edit Service' : 'Add Service'}
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
                onValueChange={(v) =>
                  setForm({ ...form, category: v })
                }
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
              <Label>Who It Helps</Label>
              <Textarea
                value={form.who_it_helps}
                onChange={(e) =>
                  setForm({ ...form, who_it_helps: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>How to Participate</Label>
              <Textarea
                value={form.how_to_participate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    how_to_participate: e.target.value,
                  })
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

            <div className="space-y-2">
              <Label>Display Order</Label>
              <Input
                type="number"
                value={form.order}
                onChange={(e) =>
                  setForm({
                    ...form,
                    order: parseInt(e.target.value, 10) || 0,
                  })
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
              <Label>Active</Label>
            </div>

            <Button
              type="submit"
              disabled={isSaving}
              className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSaving
                ? 'Saving...'
                : editing
                  ? 'Update Service'
                  : 'Create Service'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}