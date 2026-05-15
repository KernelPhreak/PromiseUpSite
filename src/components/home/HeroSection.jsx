import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const HERO_IMAGE = 'https://media.base44.com/images/public/69fce2b17d3b204f67fcabe8/59d58e7c2_generated_ab33a441.png';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
      
      {/* Decorative circles */}
      <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="font-inter text-sm font-medium text-foreground">100% Free Community Services</span>
            </div>

            <h1 className="font-outfit font-bold text-4xl sm:text-5xl lg:text-6xl text-foreground leading-tight text-balance">
              Free community support, photos, supplies, and events {' '}
              <span className="text-primary">powered by Promise Up.</span>
            </h1>

            <p className="mt-6 font-inter text-lg text-muted-foreground leading-relaxed max-w-xl">
              We remove barriers and create opportunities by offering free photography, school support, community events, and hobby programs for at-risk youth, families, and community members.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <Link to="/contact">
                <Button size="lg" className="rounded-full font-inter font-semibold bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12 text-base">
                  Request Services
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/donate">
                <Button size="lg" variant="outline" className="rounded-full font-inter font-semibold px-8 h-12 text-base border-2">
                  <Heart className="w-5 h-5 mr-2" />
                  Donate
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="ghost" className="rounded-full font-inter font-semibold px-8 h-12 text-base">
                  Contact Us
                </Button>
              </Link>
            </div>

            {/* Quick stats */}
            <div className="flex gap-8 mt-12">
              <div>
                <p className="font-outfit font-bold text-2xl text-foreground">100%</p>
                <p className="font-inter text-sm text-muted-foreground">Free Services</p>
              </div>
              <div className="w-px bg-border" />
              <div>
                <p className="font-outfit font-bold text-2xl text-foreground">SE Missouri</p>
                <p className="font-inter text-sm text-muted-foreground">Cape Girardeau Area</p>
              </div>
              <div className="w-px bg-border hidden sm:block" />
              <div className="hidden sm:block">
                <p className="font-outfit font-bold text-2xl text-foreground">500+</p>
                <p className="font-inter text-sm text-muted-foreground">Teens Served</p>
              </div>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-primary/10">
              <img
                src={HERO_IMAGE}
                alt="A young person smiling radiantly during a portrait session in warm golden-hour light"
                className="w-full h-[400px] sm:h-[500px] lg:h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 sm:left-8 bg-card rounded-2xl shadow-xl p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-outfit font-bold text-foreground">Every Service</p>
                <p className="font-inter text-sm text-muted-foreground">Completely Free</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}