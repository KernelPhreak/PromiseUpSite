import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const emptyForm = {
  name: '',
  role: '',
  bio: '',
  photo_url: '',
  ask_me_about: '',
  order: 0,
};

export default function AdminBoard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const {
    data: members = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['admin-board'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('board_members')
        .select('*')
        .order('order', { ascending: true });

      if (error) {
        console.error('Error loading board members:', error);
        throw error;
      }

      return data || [];
    },
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const { data: created, error } = await supabase
        .from('board_members')
        .insert([data])
        .select()
        .single();

      if (error) {
        console.error('Error creating board member:', error);
        throw error;
      }

      return created;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-board'] });
      closeDialog();
      toast({ title: 'Board member added' });
    },
    onError: (error) => {
      toast({
        title: 'Could not add board member',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const { data: updated, error } = await supabase
        .from('board_members')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating board member:', error);
        throw error;
      }

      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-board'] });
      closeDialog();
      toast({ title: 'Board member updated' });
    },
    onError: (error) => {
      toast({
        title: 'Could not update board member',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('board_members')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting board member:', error);
        throw error;
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-board'] });
      toast({ title: 'Board member removed' });
    },
    onError: (error) => {
      toast({
        title: 'Could not remove board member',
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

  const openEdit = (member) => {
    setEditing(member);
    setForm({
      name: member.name || '',
      role: member.role || '',
      bio: member.bio || '',
      photo_url: member.photo_url || '',
      ask_me_about: member.ask_me_about || '',
      order: member.order || 0,
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
      name: form.name,
      role: form.role,
      bio: form.bio,
      photo_url: form.photo_url,
      ask_me_about: form.ask_me_about,
      order: Number(form.order) || 0,
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
          Board Members
        </h1>

        <Button
          onClick={openCreate}
          className="rounded-full font-inter bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Member
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="font-inter text-muted-foreground">
            Loading board members...
          </p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="font-inter text-destructive">
            Could not load board members.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {members.map((member) => (
            <div
              key={member.id}
              className="bg-card rounded-2xl p-6 shadow-sm border border-border/50 flex items-center gap-4"
            >
              {member.photo_url ? (
                <img
                  src={member.photo_url}
                  alt={member.name}
                  className="w-16 h-16 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="font-outfit font-bold text-xl text-primary">
                    {member.name?.[0]}
                  </span>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h3 className="font-outfit font-bold text-foreground">
                  {member.name}
                </h3>

                <p className="font-inter text-sm text-primary">
                  {member.role}
                </p>

                {member.bio && (
                  <p className="font-inter text-xs text-muted-foreground mt-1 truncate">
                    {member.bio}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEdit(member)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const confirmed = window.confirm(
                      `Remove ${member.name}?`
                    );

                    if (confirmed) {
                      deleteMutation.mutate(member.id);
                    }
                  }}
                  className="text-destructive"
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          {members.length === 0 && (
            <div className="text-center py-12 col-span-2">
              <p className="font-inter text-muted-foreground">
                No board members yet.
              </p>
            </div>
          )}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-outfit">
              {editing ? 'Edit Board Member' : 'Add Board Member'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Role *</Label>
                <Input
                  value={form.role}
                  onChange={(e) =>
                    setForm({ ...form, role: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Photo URL</Label>
              <Input
                value={form.photo_url}
                onChange={(e) =>
                  setForm({ ...form, photo_url: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ask Me About</Label>
                <Input
                  value={form.ask_me_about}
                  onChange={(e) =>
                    setForm({ ...form, ask_me_about: e.target.value })
                  }
                  placeholder="e.g. volunteering"
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
            </div>

            <Button
              type="submit"
              disabled={isSaving}
              className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSaving
                ? 'Saving...'
                : editing
                  ? 'Update Member'
                  : 'Add Member'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}