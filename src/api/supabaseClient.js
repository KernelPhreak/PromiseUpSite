import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Keep this as a console error so the app can still render a helpful page during setup.
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env.local');
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

const entityTables = {
  Service: 'services',
  Event: 'events',
  BoardMember: 'board_members',
  ContactMessage: 'contact_messages',
  DonationInquiry: 'donation_inquiries',
};

function parseOrder(orderBy = '-created_date') {
  const raw = String(orderBy || '').trim();
  const ascending = !raw.startsWith('-');
  const column = raw.replace(/^-/, '') || 'created_date';
  return { column, ascending };
}

function cleanPayload(data = {}) {
  const copy = { ...data };
  // Never send Base44/Supabase generated fields during insert/update from forms.
  delete copy.id;
  delete copy.created_at;
  delete copy.created_date;
  delete copy.updated_at;
  return copy;
}

function createEntity(table) {
  return {
    async list(orderBy = '-created_date') {
      const { column, ascending } = parseOrder(orderBy);
      const { data, error } = await supabase.from(table).select('*').order(column, { ascending });
      if (error) throw error;
      return data ?? [];
    },

    async filter(filters = {}, orderBy = '-created_date') {
      const { column, ascending } = parseOrder(orderBy);
      let query = supabase.from(table).select('*');

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query = query.eq(key, value);
        }
      });

      const { data, error } = await query.order(column, { ascending });
      if (error) throw error;
      return data ?? [];
    },

    async create(data) {
      const { data: created, error } = await supabase
        .from(table)
        .insert(cleanPayload(data))
        .select('*')
        .single();
      if (error) throw error;
      return created;
    },

    async update(id, data) {
      const { data: updated, error } = await supabase
        .from(table)
        .update(cleanPayload(data))
        .eq('id', id)
        .select('*')
        .single();
      if (error) throw error;
      return updated;
    },

    async delete(id) {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      return true;
    },
  };
}

export const entities = Object.fromEntries(
  Object.entries(entityTables).map(([name, table]) => [name, createEntity(table)])
);
