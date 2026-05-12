import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const DONATION_IMAGE = 'https://media.base44.com/images/public/69fce2b17d3b204f67fcabe8/79fa5372a_generated_a6b5c612.png';

export default function DonationCallout() {
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="rounded-3xl overflow-hidden shadow-lg">
              <img
                src={DONATION_IMAGE}
                alt="Hands passing a donation box filled with school supplies, warm golden lighting"
                className="w-full h-[300px] sm:h-[400px] object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <p className="font-inter text-sm font-semibold text-primary uppercase tracking-wider mb-3">Support Our Mission</p>
            <h2 className="font-outfit font-bold text-3xl sm:text-4xl text-foreground leading-tight">
              Your generosity keeps every service <span className="text-primary">completely free.</span>
            </h2>
            <p className="mt-4 font-inter text-lg text-muted-foreground leading-relaxed">
              Every dollar and donated item goes directly toward supporting at-risk youth, families, and community members in Southeast Missouri.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-8">
              {[
                { amount: '$10', impact: 'Printed photos or basic supplies' },
                { amount: '$25', impact: 'Support a student participant' },
                { amount: '$50', impact: 'Community outreach materials' },
                { amount: '$100', impact: 'Sponsor a free event setup' },
              ].map((item) => (
                <div key={item.amount} className="bg-card rounded-2xl p-4 shadow-sm">
                  <p className="font-outfit font-bold text-xl text-primary">{item.amount}</p>
                  <p className="font-inter text-sm text-muted-foreground mt-1">{item.impact}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 mt-8">
              <Link to="/donate">
                <Button size="lg" className="rounded-full font-inter font-semibold bg-primary text-primary-foreground hover:bg-primary/90 px-8">
                  <Heart className="w-5 h-5 mr-2" />
                  Donate Now
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="rounded-full font-inter font-semibold px-8">
                  Donate Items <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}