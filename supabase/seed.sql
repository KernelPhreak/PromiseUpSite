insert into public.services (title, description, who_it_helps, how_to_participate, icon, category, "order", is_active)
values
('Free Photo Sessions', 'School, sports, prom, family, and community portraits at no cost.', 'At-risk youth, underprivileged families, and community members who need quality photos.', 'Use the contact page to request a session or partner on an event.', 'Camera', 'photo_sessions', 1, true),
('School Supplies', 'Backpacks, notebooks, hygiene items, and basic school essentials.', 'Students and families who need extra support.', 'Contact us for availability or to donate supplies.', 'BookOpen', 'school_supplies', 2, true),
('Community Events', 'Free outreach events, resource days, and local partnerships.', 'Families, youth, and neighbors across Southeast Missouri.', 'Watch the events page or contact us to collaborate.', 'Users', 'community_events', 3, true),
('Hobby Events', 'Starter hobby activities and community-building events.', 'Youth and families looking for positive, affordable hobbies.', 'Check upcoming events or suggest a hobby idea.', 'Palette', 'hobby_events', 4, true)
on conflict do nothing;
