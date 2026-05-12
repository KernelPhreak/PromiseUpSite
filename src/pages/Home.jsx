import React from 'react';
import HeroSection from '../components/home/HeroSection';
import ServiceCards from '../components/home/ServiceCards';
import UpcomingEventsPreview from '../components/home/UpcomingEventsPreview';
import DonationCallout from '../components/home/DonationCallout';
import ContactCallout from '../components/home/ContactCallout';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <ServiceCards />
      <UpcomingEventsPreview />
      <DonationCallout />
      <ContactCallout />
    </div>
  );
}