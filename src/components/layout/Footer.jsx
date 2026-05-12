import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, MapPin, Phone, Facebook, Instagram } from 'lucide-react';

const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'Services', path: '/services' },
  { label: 'Events', path: '/events' },
  { label: 'About Us', path: '/about' },
  { label: 'Donate', path: '/donate' },
  { label: 'Contact', path: '/contact' },
];

export default function Footer() {
  return (
    <footer className="bg-foreground text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="font-outfit font-bold text-primary-foreground text-lg">P</span>
              </div>
              <span className="font-outfit font-bold text-xl">Promise Up</span>
            </div>
            <p className="font-inter text-white/70 leading-relaxed max-w-md">
              Removing barriers and creating opportunities through free photography, school support, community events, and hobby programs for those who need them most.
            </p>
            <div className="flex gap-3 mt-6">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-outfit font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="font-inter text-white/70 hover:text-primary transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-outfit font-semibold text-lg mb-4">Get In Touch</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="font-inter text-white/70 text-sm">Cape Girardeau, Southeast Missouri</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <a href="mailto:info@promiseup.org" className="font-inter text-white/70 text-sm hover:text-primary transition-colors">info@promiseup.org</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span className="font-inter text-white/70 text-sm">(573) 555-0100</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-inter text-white/50 text-sm">
            © {new Date().getFullYear()} Promise Up. All rights reserved.
          </p>
          <p className="font-inter text-white/50 text-sm flex items-center gap-1">
            Based in Cape Girardeau — here for you <Heart className="w-3 h-3 text-primary" />
          </p>
        </div>
      </div>
    </footer>
  );
}