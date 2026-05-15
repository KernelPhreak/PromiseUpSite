import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';
import { Heart, Eye, Sparkles, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const HERO_IMAGE =
  'https://media.base44.com/images/public/69fce2b17d3b204f67fcabe8/2e2ff1cdf_generated_f92241d0.png';

export default function About() {
  const {
    data: boardMembers = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['board-members'],
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

  return (
    <div className="pt-28 pb-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="font-inter text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            About Us
          </p>

          <h1 className="font-outfit font-bold text-4xl sm:text-5xl text-foreground">
            The story behind <span className="text-primary">Promise Up</span>
          </h1>
        </motion.div>
      </div>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="rounded-3xl overflow-hidden shadow-lg">
              <img
                src={HERO_IMAGE}
                alt="Community members gathered together at a warm outdoor event"
                className="w-full h-[400px] object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="space-y-10"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-primary" />
                </div>

                <h2 className="font-outfit font-bold text-2xl text-foreground">
                  Our Mission
                </h2>
              </div>

              <p className="font-inter text-muted-foreground leading-relaxed">
                Promise Up exists to remove barriers and create real
                opportunities for at-risk youth, underprivileged families, and
                community members. We provide free photography, school support,
                community events, and hobby programs, because everyone deserves
                access to the things that build confidence, connection, and
                hope.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-primary" />
                </div>

                <h2 className="font-outfit font-bold text-2xl text-foreground">
                  Our Vision
                </h2>
              </div>

              <p className="font-inter text-muted-foreground leading-relaxed">
                A community where no child, teen, or family is held back by
                financial circumstances. We envision a Southeast Missouri where
                every young person has access to enriching experiences, quality
                memories, and the essentials they need to thrive, all provided
                through the generosity and commitment of their neighbors.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="bg-muted/50 py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>

            <h2 className="font-outfit font-bold text-3xl sm:text-4xl text-foreground mb-6">
              Our Story
            </h2>

            <div className="font-inter text-muted-foreground leading-relaxed space-y-4 text-left sm:text-center">
              <p>
                Promise Up was born from a simple observation: too many young
                people in our community were missing out, not because of a lack
                of talent or desire, but because of a lack of resources. Kids
                who couldn't afford school photos. Families who struggled to buy
                basic supplies. Teens with no access to enriching activities.
              </p>

              <p>
                We started small, offering free portrait sessions to a handful
                of students. Word spread. The need was far greater than we
                imagined. So we grew, adding school supply drives, community
                events, and hobby programs. Each service was designed with one
                principle in mind:{' '}
                <strong>remove the barrier, and people will rise.</strong>
              </p>

              <p>
                Today, Promise Up serves the Cape Girardeau and Southeast
                Missouri area with a growing network of volunteers, donors, and
                community partners. We remain committed to keeping every single
                service free. Because when you promise to lift someone up, you
                follow through.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Board Members */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="font-inter text-sm font-semibold text-primary uppercase tracking-wider mb-3">
              Our Team
            </p>

            <h2 className="font-outfit font-bold text-3xl sm:text-4xl text-foreground">
              Meet the board
            </h2>

            <p className="mt-4 font-inter text-muted-foreground max-w-xl mx-auto">
              The people behind Promise Up are neighbors, parents, and community
              members, just like you.
            </p>
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
                Could not load board member information.
              </p>
            </div>
          ) : boardMembers.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {boardMembers.map((member, i) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="text-center group"
                >
                  <div className="relative w-40 h-40 mx-auto mb-5">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 scale-110" />

                    <img
                      src={member.photo_url || '/placeholder-avatar.jpg'}
                      alt={`Portrait of ${member.name}`}
                      className="relative w-40 h-40 rounded-full object-cover shadow-lg"
                    />
                  </div>

                  <h3 className="font-outfit font-bold text-lg text-foreground">
                    {member.name}
                  </h3>

                  <p className="font-inter text-sm text-primary font-medium">
                    {member.role}
                  </p>

                  {member.bio && (
                    <p className="font-inter text-sm text-muted-foreground mt-2 leading-relaxed">
                      {member.bio}
                    </p>
                  )}

                  {member.ask_me_about && (
                    <div className="mt-3 inline-flex items-center gap-1.5 bg-primary/10 rounded-full px-3 py-1.5">
                      <MessageCircle className="w-3.5 h-3.5 text-primary" />
                      <span className="font-inter text-xs font-medium text-foreground">
                        Ask me about {member.ask_me_about}
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="font-inter text-muted-foreground">
                Board member information coming soon.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}