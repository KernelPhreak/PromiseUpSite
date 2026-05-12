import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/api/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Heart,
  Camera,
  BookOpen,
  Gift,
  Paintbrush,
  PartyPopper,
  Package,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

const DONATION_IMAGE =
  'https://media.base44.com/images/public/69fce2b17d3b204f67fcabe8/79fa5372a_generated_a6b5c612.png';

const impactCards = [
  {
    amount: '$10',
    impact: 'Helps provide printed photos or basic supplies',
    icon: Camera,
  },
  {
    amount: '$25',
    impact: 'Helps support a student or event participant',
    icon: BookOpen,
  },
  {
    amount: '$50',
    impact: 'Helps fund community outreach materials',
    icon: Gift,
  },
  {
    amount: '$100',
    impact: 'Helps sponsor a free photo/event setup',
    icon: PartyPopper,
  },
];

const itemDonations = [
  {
    icon: BookOpen,
    title: 'School Supplies',
    description:
      'Backpacks, notebooks, pens, pencils, folders, binders, art supplies, and hygiene items.',
  },
  {
    icon: Camera,
    title: 'Photography Supplies',
    description:
      'Cameras, lenses, memory cards, batteries, lighting equipment, and printing supplies.',
  },
  {
    icon: Paintbrush,
    title: 'Backdrops & Props',
    description:
      'Photography backdrops, stands, props for portrait sessions, and seasonal decorations.',
  },
  {
    icon: Gift,
    title: 'Hobby Materials',
    description:
      'Art supplies, craft kits, sports equipment, musical instruments, and cooking supplies.',
  },
  {
    icon: Package,
    title: 'Event Supplies',
    description:
      'Tables, chairs, tents, signage, food/drink supplies, and general event materials.',
  },
];

const donationTypes = [
  { value: 'monetary', label: 'Monetary Donation' },
  { value: 'school_supplies', label: 'School Supplies' },
  { value: 'photography_supplies', label: 'Photography Supplies' },
  { value: 'backdrops_props', label: 'Backdrops & Props' },
  { value: 'hobby_materials', label: 'Hobby Materials' },
  { value: 'event_supplies', label: 'Event Supplies' },
  { value: 'other', label: 'Other' },
];

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  donation_type: '',
  message: '',
};

export default function Donate() {
  const { toast } = useToast();

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);

    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      donation_type: form.donation_type,
      message: form.message || null,
      is_read: false,
    };

    const { error } = await supabase
      .from('donation_inquiries')
      .insert([payload]);

    setSubmitting(false);

    if (error) {
      console.error('Error submitting donation inquiry:', error);

      toast({
        title: 'Donation inquiry could not be sent',
        description: error.message,
        variant: 'destructive',
      });

      return;
    }

    setSubmitted(true);
    setForm(emptyForm);

    toast({
      title: 'Thank you!',
      description: "We'll be in touch about your donation soon.",
    });
  };

  return (
    <div className="pt-28 pb-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="font-inter text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Donate
          </p>

          <h1 className="font-outfit font-bold text-4xl sm:text-5xl text-foreground">
            Help keep our services{' '}
            <span className="text-primary">free for everyone.</span>
          </h1>

          <p className="mt-4 font-inter text-lg text-muted-foreground max-w-2xl mx-auto">
            Your generosity — whether money or items — goes directly toward
            serving at-risk youth, families, and community members in Southeast
            Missouri.
          </p>
        </motion.div>
      </div>

      {/* Impact Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <h2 className="font-outfit font-bold text-2xl sm:text-3xl text-foreground text-center mb-10">
          Your Impact
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {impactCards.map((card, i) => (
            <motion.div
              key={card.amount}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-card rounded-3xl p-8 text-center shadow-sm hover:shadow-lg transition-all duration-300 border border-border/50"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <card.icon className="w-8 h-8 text-primary" />
              </div>

              <p className="font-outfit font-bold text-4xl text-primary mb-3">
                {card.amount}
              </p>

              <p className="font-inter text-sm text-muted-foreground leading-relaxed">
                {card.impact}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Hero image */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="rounded-3xl overflow-hidden shadow-lg">
          <img
            src={DONATION_IMAGE}
            alt="Hands passing a donation box filled with school supplies in warm golden light"
            className="w-full h-[250px] sm:h-[350px] object-cover"
          />
        </div>
      </section>

      {/* CashApp & Venmo */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-8">
          <h2 className="font-outfit font-bold text-2xl sm:text-3xl text-foreground">
            Send Money Directly
          </h2>

          <p className="mt-3 font-inter text-muted-foreground">
            Make an instant monetary donation via CashApp or Venmo — no account
            required for Venmo.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {/* CashApp */}
          <div className="bg-[#00D632]/10 border-2 border-[#00D632]/30 rounded-3xl p-8 text-center hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 rounded-2xl bg-[#00D632] flex items-center justify-center mx-auto mb-5">
              <span className="text-white font-bold text-2xl">$</span>
            </div>

            <h3 className="font-outfit font-bold text-xl text-foreground mb-1">
              CashApp
            </h3>

            <p className="font-inter text-2xl font-bold text-[#00D632] mb-2">
              $PromiseUpMO
            </p>

            <p className="font-inter text-sm text-muted-foreground mb-5">
              Send any amount instantly. 100% goes to our programs.
            </p>

            <a
              href="https://cash.app/$PromiseUpMO"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full rounded-full bg-[#00D632] text-white font-inter font-semibold py-3 hover:bg-[#00D632]/90 transition-colors"
            >
              Open CashApp
            </a>
          </div>

          {/* Venmo */}
          <div className="bg-[#3D95CE]/10 border-2 border-[#3D95CE]/30 rounded-3xl p-8 text-center hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 rounded-2xl bg-[#3D95CE] flex items-center justify-center mx-auto mb-5">
              <span className="text-white font-bold text-2xl">V</span>
            </div>

            <h3 className="font-outfit font-bold text-xl text-foreground mb-1">
              Venmo
            </h3>

            <p className="font-inter text-2xl font-bold text-[#3D95CE] mb-2">
              @PromiseUp-MO
            </p>

            <p className="font-inter text-sm text-muted-foreground mb-5">
              Quick and easy — send a note with "donation" so we know!
            </p>

            <a
              href="https://venmo.com/PromiseUp-MO"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full rounded-full bg-[#3D95CE] text-white font-inter font-semibold py-3 hover:bg-[#3D95CE]/90 transition-colors"
            >
              Open Venmo
            </a>
          </div>
        </div>
      </section>

      {/* Item Donations */}
      <section className="bg-muted/50 py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-outfit font-bold text-2xl sm:text-3xl text-foreground">
              Donate Items
            </h2>

            <p className="mt-3 font-inter text-muted-foreground max-w-xl mx-auto">
              We also accept physical donations. Every item makes a difference.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {itemDonations.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-card rounded-3xl p-8 shadow-sm"
              >
                <item.icon className="w-8 h-8 text-primary mb-4" />

                <h3 className="font-outfit font-bold text-lg text-foreground mb-2">
                  {item.title}
                </h3>

                <p className="font-inter text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Contact Form */}
      <section className="py-20 sm:py-28">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-outfit font-bold text-2xl sm:text-3xl text-foreground">
              Ready to Give?
            </h2>

            <p className="mt-3 font-inter text-muted-foreground">
              Fill out the form below and we'll connect with you about your
              donation.
            </p>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-card rounded-3xl shadow-sm"
            >
              <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />

              <h3 className="font-outfit font-bold text-2xl text-foreground mb-2">
                Thank You!
              </h3>

              <p className="font-inter text-muted-foreground mb-6">
                We'll be in touch about your donation soon.
              </p>

              <Button
                type="button"
                variant="outline"
                className="rounded-full font-inter"
                onClick={() => {
                  setSubmitted(false);
                  setForm(emptyForm);
                }}
              >
                Submit Another Donation
              </Button>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-card rounded-3xl p-8 sm:p-10 shadow-sm space-y-6"
            >
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-inter font-medium">Name *</Label>
                  <Input
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    placeholder="Your name"
                    className="rounded-xl h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-inter font-medium">Email *</Label>
                  <Input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="you@example.com"
                    className="rounded-xl h-12"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-inter font-medium">
                    Phone optional
                  </Label>
                  <Input
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    placeholder="(555) 555-5555"
                    className="rounded-xl h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-inter font-medium">
                    Donation Type *
                  </Label>
                  <Select
                    value={form.donation_type}
                    onValueChange={(v) =>
                      setForm({ ...form, donation_type: v })
                    }
                  >
                    <SelectTrigger className="rounded-xl h-12">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>

                    <SelectContent>
                      {donationTypes.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-inter font-medium">Message</Label>
                <Textarea
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  placeholder="Tell us about your donation or how you'd like to help..."
                  className="rounded-xl min-h-[120px]"
                />
              </div>

              <Button
                type="submit"
                disabled={
                  submitting ||
                  !form.name ||
                  !form.email ||
                  !form.donation_type
                }
                className="w-full rounded-full font-inter font-semibold bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base"
              >
                {submitting ? 'Sending...' : 'Submit Donation Inquiry'}
                <Heart className="w-5 h-5 ml-2" />
              </Button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}