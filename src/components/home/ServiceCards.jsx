import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, BookOpen, Users, Palette, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const services = [
  {
    icon: Camera,
    title: 'Free Photo Sessions',
    description: 'School photos, sports photos, prom, family portraits, and special community photo events, all completely free.',
    gradient: 'from-amber-50 to-orange-50',
  },
  {
    icon: BookOpen,
    title: 'Free School Supplies',
    description: 'Back-to-school items, basic supplies, and support for youth and families who need them most.',
    gradient: 'from-blue-50 to-sky-50',
  },
  {
    icon: Users,
    title: 'Free Community Events',
    description: 'Local events focused on outreach, connection, resources, and bringing the community together.',
    gradient: 'from-emerald-50 to-teal-50',
  },
  {
    icon: Palette,
    title: 'Free Hobby Events',
    description: 'Creative activities that help youth and families explore interests, learn skills, and build confidence.',
    gradient: 'from-purple-50 to-pink-50',
  },
];

export default function ServiceCards() {
  return (
    <section className="py-20 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="font-inter text-sm font-semibold text-primary uppercase tracking-wider mb-3">What We Offer</p>
          <h2 className="font-outfit font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground">
            Every service is free. Always.
          </h2>
          <p className="mt-4 font-inter text-lg text-muted-foreground max-w-2xl mx-auto">
            We believe everyone deserves access to opportunities. No cost, no catch, just community helping community.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link to="/services" className="block group">
                <div className={`bg-gradient-to-br ${service.gradient} rounded-3xl p-8 sm:p-10 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1`}>
                  <div className="w-14 h-14 rounded-2xl bg-white/80 flex items-center justify-center mb-6 shadow-sm">
                    <service.icon className="w-7 h-7 text-foreground" />
                  </div>
                  <h3 className="font-outfit font-bold text-xl sm:text-2xl text-foreground mb-3">{service.title}</h3>
                  <p className="font-inter text-muted-foreground leading-relaxed mb-6">{service.description}</p>
                  <div className="flex items-center gap-2 font-inter font-medium text-foreground group-hover:gap-3 transition-all">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}