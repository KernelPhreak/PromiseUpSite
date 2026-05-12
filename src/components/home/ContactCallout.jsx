import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, School, Users, Church, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactCallout() {
  return (
    <section className="py-20 sm:py-28 bg-foreground text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-primary/10 blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-primary/5 blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-outfit font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight">
            Schools, families, nonprofits, churches — we're here for you.
          </h2>
          <p className="mt-6 font-inter text-lg text-white/70 max-w-2xl mx-auto">
            Whether you need services, want to partner, or would like to volunteer — we'd love to connect with you.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-5 py-2.5">
              <School className="w-5 h-5 text-primary" />
              <span className="font-inter text-sm">Schools</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-5 py-2.5">
              <Users className="w-5 h-5 text-primary" />
              <span className="font-inter text-sm">Families</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-5 py-2.5">
              <Church className="w-5 h-5 text-primary" />
              <span className="font-inter text-sm">Churches</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-5 py-2.5">
              <Building2 className="w-5 h-5 text-primary" />
              <span className="font-inter text-sm">Community Partners</span>
            </div>
          </div>

          <Link to="/contact" className="inline-block mt-10">
            <Button size="lg" className="rounded-full font-inter font-semibold bg-primary text-primary-foreground hover:bg-primary/90 px-10 h-14 text-base">
              Get In Touch
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}