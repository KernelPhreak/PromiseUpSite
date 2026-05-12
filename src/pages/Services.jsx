import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';
import { Button } from '@/components/ui/button';
import {
  Camera,
  BookOpen,
  Users,
  Palette,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap = {
  Camera,
  BookOpen,
  Users,
  Palette,
  Sparkles,
};

const gradients = [
  'from-amber-50 to-orange-50',
  'from-blue-50 to-sky-50',
  'from-emerald-50 to-teal-50',
  'from-purple-50 to-pink-50',
  'from-rose-50 to-red-50',
  'from-cyan-50 to-teal-50',
];

export default function Services() {
  const {
    data: services = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('order', { ascending: true });

      if (error) {
        console.error('Error loading services:', error);
        throw error;
      }

      return data || [];
    },
    initialData: [],
  });

  return (
    <div className="pt-28 pb-20">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="font-inter text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Our Services
          </p>

          <h1 className="font-outfit font-bold text-4xl sm:text-5xl text-foreground">
            Everything we do is <span className="text-primary">free.</span>
          </h1>

          <p className="mt-4 font-inter text-lg text-muted-foreground max-w-2xl mx-auto">
            No fees, no applications, no hassle. Just real support for real
            people in our community.
          </p>
        </motion.div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {[1, 2].map((i) => (
            <div key={i} className="grid lg:grid-cols-2 gap-12 animate-pulse">
              <div className="h-[350px] bg-muted rounded-3xl" />

              <div className="space-y-4 py-8">
                <div className="h-6 bg-muted rounded w-32" />
                <div className="h-10 bg-muted rounded w-3/4" />
                <div className="h-20 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {!isLoading && error && (
        <div className="text-center py-20 max-w-7xl mx-auto px-4">
          <p className="font-inter text-destructive text-lg">
            Could not load services.
          </p>
        </div>
      )}

      {/* Service Sections */}
      {!isLoading && !error && (
        <div className="space-y-24">
          {services.map((service, i) => {
            const IconComponent = iconMap[service.icon] || Sparkles;
            const gradient = gradients[i % gradients.length];

            return (
              <motion.section
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6 }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
              >
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                    {service.image_url ? (
                      <div className="rounded-3xl overflow-hidden shadow-lg">
                        <img
                          src={service.image_url}
                          alt={service.title}
                          className="w-full h-[300px] sm:h-[400px] object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        className={`rounded-3xl bg-gradient-to-br ${gradient} h-[300px] sm:h-[400px] flex items-center justify-center`}
                      >
                        <IconComponent className="w-24 h-24 text-foreground/20" />
                      </div>
                    )}
                  </div>

                  <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                    <div
                      className={`inline-flex items-center gap-2 bg-gradient-to-r ${gradient} rounded-full px-4 py-2 mb-4`}
                    >
                      <IconComponent className="w-5 h-5 text-foreground" />
                      <span className="font-inter text-sm font-semibold text-foreground">
                        Free Service
                      </span>
                    </div>

                    <h2 className="font-outfit font-bold text-3xl sm:text-4xl text-foreground mb-4">
                      {service.title}
                    </h2>

                    <p className="font-inter text-muted-foreground leading-relaxed mb-6">
                      {service.description}
                    </p>

                    <div className="space-y-4 mb-6">
                      {service.who_it_helps && (
                        <div>
                          <h4 className="font-outfit font-semibold text-foreground mb-1">
                            Who It Helps
                          </h4>
                          <p className="font-inter text-sm text-muted-foreground">
                            {service.who_it_helps}
                          </p>
                        </div>
                      )}

                      {service.how_to_participate && (
                        <div>
                          <h4 className="font-outfit font-semibold text-foreground mb-1">
                            How to Participate
                          </h4>
                          <p className="font-inter text-sm text-muted-foreground">
                            {service.how_to_participate}
                          </p>
                        </div>
                      )}
                    </div>

                    <Link to="/contact">
                      <Button className="rounded-full font-inter font-semibold bg-primary text-primary-foreground hover:bg-primary/90 px-8">
                        Contact Us <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.section>
            );
          })}

          {services.length === 0 && (
            <div className="text-center py-20 max-w-7xl mx-auto px-4">
              <p className="font-inter text-muted-foreground text-lg">
                Services coming soon!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}