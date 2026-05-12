import React, { useState } from 'react';
import { supabase } from '@/api/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

import {
  Mail,
  MapPin,
  Phone,
  Send,
  CheckCircle2,
  School,
  Users,
  Church,
  Building2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

const reasons = [
  { value: 'request_service', label: 'Request a Service' },
  { value: 'donate', label: 'Donate' },
  { value: 'volunteer', label: 'Volunteer' },
  { value: 'partner', label: 'Partner With Us' },
  { value: 'question', label: 'Ask a Question' },
];

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  reason: '',
  message: '',
};

export default function Contact() {
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
      reason: form.reason,
      message: form.message,
    };

    const { error } = await supabase
      .from('contact_messages')
      .insert([payload]);

    setSubmitting(false);

    if (error) {
      console.error('Error sending contact message:', error);

      toast({
        title: 'Message could not be sent',
        description: error.message,
        variant: 'destructive',
      });

      return;
    }

    setSubmitted(true);
    toast({
      title: 'Message sent!',
      description: "We'll get back to you soon.",
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
            Contact Us
          </p>

          <h1 className="font-outfit font-bold text-4xl sm:text-5xl text-foreground">
            We'd love to <span className="text-primary">hear from you.</span>
          </h1>

          <p className="mt-4 font-inter text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you need services, want to donate, volunteer, or partner —
            reach out and let's connect.
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Info Sidebar */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-card rounded-3xl p-8 shadow-sm space-y-6">
                <h3 className="font-outfit font-bold text-xl text-foreground">
                  Get In Touch
                </h3>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>

                  <div>
                    <p className="font-inter font-medium text-foreground">
                      Location
                    </p>
                    <p className="font-inter text-sm text-muted-foreground">
                      Cape Girardeau, Southeast Missouri
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>

                  <div>
                    <p className="font-inter font-medium text-foreground">
                      Email
                    </p>
                    <a
                      href="mailto:info@promiseup.org"
                      className="font-inter text-sm text-primary hover:underline"
                    >
                      info@promiseup.org
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>

                  <div>
                    <p className="font-inter font-medium text-foreground">
                      Phone
                    </p>
                    <p className="font-inter text-sm text-muted-foreground">
                      (573) 555-0100
                    </p>
                  </div>
                </div>
              </div>

              {/* Partner CTA */}
              <div className="bg-foreground text-white rounded-3xl p-8 mt-6">
                <h3 className="font-outfit font-bold text-xl mb-3">
                  We're here for:
                </h3>

                <div className="space-y-3">
                  {[
                    { icon: School, label: 'Schools & Districts' },
                    { icon: Users, label: 'Families & Youth' },
                    { icon: Church, label: 'Churches & Faith Groups' },
                    { icon: Building2, label: 'Nonprofits & Partners' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 text-primary" />
                      <span className="font-inter text-sm text-white/80">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="mt-4 font-inter text-sm text-white/60 leading-relaxed">
                  If you serve the community and want to collaborate, we want to
                  hear from you.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              {submitted ? (
                <div className="text-center py-20 bg-card rounded-3xl shadow-sm">
                  <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />

                  <h3 className="font-outfit font-bold text-2xl text-foreground mb-2">
                    Message Sent!
                  </h3>

                  <p className="font-inter text-muted-foreground mb-6">
                    We'll get back to you as soon as possible.
                  </p>

                  <Button
                    onClick={() => {
                      setSubmitted(false);
                      setForm(emptyForm);
                    }}
                    variant="outline"
                    className="rounded-full font-inter"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="bg-card rounded-3xl p-8 sm:p-10 shadow-sm space-y-6"
                >
                  <h3 className="font-outfit font-bold text-xl text-foreground mb-2">
                    Send Us a Message
                  </h3>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-inter font-medium">
                        Name *
                      </Label>
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
                      <Label className="font-inter font-medium">
                        Email *
                      </Label>
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
                        Reason *
                      </Label>
                      <select
                        required
                        value={form.reason}
                        onChange={(e) =>
                          setForm({ ...form, reason: e.target.value })
                        }
                        className="flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select a reason</option>

                        {reasons.map((r) => (
                          <option key={r.value} value={r.value}>
                            {r.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-inter font-medium">
                      Message *
                    </Label>
                    <Textarea
                      required
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      placeholder="How can we help you?"
                      className="rounded-xl min-h-[150px]"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={
                      submitting ||
                      !form.name ||
                      !form.email ||
                      !form.reason ||
                      !form.message
                    }
                    className="w-full rounded-full font-inter font-semibold bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base"
                  >
                    {submitting ? 'Sending...' : 'Send Message'}
                    <Send className="w-5 h-5 ml-2" />
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}