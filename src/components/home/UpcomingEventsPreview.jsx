import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, ArrowRight, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const categoryLabels = {
  photo_event: 'Photo Event',
  school_supplies: 'School Supplies',
  community_event: 'Community Event',
  hobby_event: 'Hobby Event',
};

export default function UpcomingEventsPreview() {
  const today = new Date().toISOString().split('T')[0];

  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ['events-preview'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_active', true)
        .gte('date', today)
        .order('date', { ascending: true })
        .limit(3);

      if (error) {
        console.error('Error loading upcoming events:', error);
        throw error;
      }

      return data || [];
    },
    initialData: [],
  });

  return (
    <section className="py-20 sm:py-28 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <p className="font-inter text-sm font-semibold text-primary uppercase tracking-wider mb-3">
              Upcoming Events
            </p>
            <h2 className="font-outfit font-bold text-3xl sm:text-4xl text-foreground">
              Join us in the community
            </h2>
          </div>

          <Link to="/events">
            <Button variant="outline" className="rounded-full font-inter">
              View All Events <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-16 bg-card rounded-3xl">
            <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4 animate-pulse" />
            <p className="font-inter text-muted-foreground text-lg">
              Loading events...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-card rounded-3xl">
            <Calendar className="w-12 h-12 text-destructive/40 mx-auto mb-4" />
            <p className="font-inter text-muted-foreground text-lg">
              We couldn&apos;t load upcoming events right now.
            </p>
          </div>
        ) : events.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-card rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
              >
                {event.image_url && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                <div className="p-6">
                  <span className="inline-block font-inter text-xs font-semibold text-primary bg-primary/10 rounded-full px-3 py-1 mb-3">
                    {categoryLabels[event.category] || event.category}
                  </span>

                  <h3 className="font-outfit font-bold text-lg text-foreground mb-2">
                    {event.title}
                  </h3>

                  <div className="space-y-2 text-sm text-muted-foreground font-inter">
                    {event.date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        {format(new Date(`${event.date}T00:00:00`), 'MMMM d, yyyy')}
                      </div>
                    )}

                    {event.time && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        {event.time}
                      </div>
                    )}

                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        {event.location}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card rounded-3xl">
            <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="font-inter text-muted-foreground text-lg">
              New events are coming soon!
            </p>

            <Link to="/contact" className="mt-4 inline-block">
              <Button variant="outline" className="rounded-full font-inter mt-4">
                Contact us to suggest an event
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}