import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const categories = [
  { value: 'all', label: 'All Events' },
  { value: 'photo_event', label: 'Photo Events' },
  { value: 'school_supplies', label: 'School Supplies' },
  { value: 'community_event', label: 'Community Events' },
  { value: 'hobby_event', label: 'Hobby Events' },
];

const categoryLabels = {
  photo_event: 'Photo Event',
  school_supplies: 'School Supplies',
  community_event: 'Community Event',
  hobby_event: 'Hobby Event',
};

export default function Events() {
  const [activeCategory, setActiveCategory] = useState('all');

  const {
    data: events = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_active', true)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error loading events:', error);
        throw error;
      }

      return data || [];
    },
    initialData: [],
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredEvents =
    activeCategory === 'all'
      ? events
      : events.filter((event) => event.category === activeCategory);

  const upcomingEvents = filteredEvents.filter((event) => {
    if (!event.date) return false;

    const eventDate = new Date(`${event.date}T00:00:00`);
    return eventDate >= today;
  });

  const pastEvents = filteredEvents.filter((event) => {
    if (!event.date) return false;

    const eventDate = new Date(`${event.date}T00:00:00`);
    return eventDate < today;
  });

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="font-inter text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Events
          </p>

          <h1 className="font-outfit font-bold text-4xl sm:text-5xl text-foreground">
            Community gatherings & activities
          </h1>

          <p className="mt-4 font-inter text-lg text-muted-foreground max-w-2xl mx-auto">
            Free events for everyone. Come as you are — we'd love to see you
            there.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {categories.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setActiveCategory(cat.value)}
              className={`px-5 py-2.5 rounded-full font-inter text-sm font-medium transition-all duration-200 ${
                activeCategory === cat.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-destructive/30 mx-auto mb-6" />
            <h3 className="font-outfit font-bold text-2xl text-foreground mb-2">
              Could not load events
            </h3>
            <p className="font-inter text-muted-foreground max-w-md mx-auto">
              Something went wrong while loading events. Please try again soon.
            </p>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-card rounded-3xl overflow-hidden animate-pulse"
              >
                <div className="h-52 bg-muted" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-muted rounded w-24" />
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && !error && (
          <>
            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
              <div className="mb-16">
                <h2 className="font-outfit font-bold text-2xl text-foreground mb-6">
                  Upcoming Events
                </h2>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingEvents.map((event, i) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.08 }}
                      className="bg-card rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
                    >
                      {event.image_url ? (
                        <div className="h-52 overflow-hidden">
                          <img
                            src={event.image_url}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      ) : (
                        <div className="h-52 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                          <Calendar className="w-16 h-16 text-primary/30" />
                        </div>
                      )}

                      <div className="p-6">
                        <span className="inline-block font-inter text-xs font-semibold text-primary bg-primary/10 rounded-full px-3 py-1 mb-3">
                          {categoryLabels[event.category] || event.category}
                        </span>

                        <h3 className="font-outfit font-bold text-xl text-foreground mb-3">
                          {event.title}
                        </h3>

                        {event.description && (
                          <p className="font-inter text-sm text-muted-foreground mb-4 line-clamp-2">
                            {event.description}
                          </p>
                        )}

                        <div className="space-y-2 text-sm text-muted-foreground font-inter">
                          {event.date && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-primary shrink-0" />
                              {format(
                                new Date(`${event.date}T00:00:00`),
                                'EEEE, MMMM d, yyyy'
                              )}
                            </div>
                          )}

                          {event.time && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-primary shrink-0" />
                              {event.time}
                            </div>
                          )}

                          {event.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-primary shrink-0" />
                              {event.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Past Events */}
            {pastEvents.length > 0 && (
              <div className="mb-16">
                <h2 className="font-outfit font-bold text-2xl text-foreground mb-6 text-muted-foreground">
                  Past Events
                </h2>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 opacity-70">
                  {pastEvents.map((event) => (
                    <div
                      key={event.id}
                      className="bg-card rounded-3xl overflow-hidden shadow-sm"
                    >
                      <div className="p-6">
                        <span className="inline-block font-inter text-xs font-semibold text-muted-foreground bg-muted rounded-full px-3 py-1 mb-3">
                          {categoryLabels[event.category] || event.category}
                        </span>

                        <h3 className="font-outfit font-bold text-lg text-foreground mb-2">
                          {event.title}
                        </h3>

                        {event.date && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground font-inter">
                            <Calendar className="w-4 h-4" />
                            {format(
                              new Date(`${event.date}T00:00:00`),
                              'MMMM d, yyyy'
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No events message */}
            {filteredEvents.length === 0 && (
              <div className="text-center py-20">
                <Calendar className="w-16 h-16 text-muted-foreground/20 mx-auto mb-6" />

                <h3 className="font-outfit font-bold text-2xl text-foreground mb-2">
                  No events found
                </h3>

                <p className="font-inter text-muted-foreground mb-6 max-w-md mx-auto">
                  No upcoming events right now, but we're always planning
                  something new. Contact us to partner or suggest an event!
                </p>

                <Link to="/contact">
                  <Button className="rounded-full font-inter font-semibold bg-primary text-primary-foreground hover:bg-primary/90 px-8">
                    Contact Us <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}