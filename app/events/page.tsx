// app/events/page.tsx
import EventCard from "@/components/EventCard";
import { IEvent } from "@/database";
import { cacheLife } from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventsPage = async () => {
  'use cache';
  cacheLife('hours'); 

  const response = await fetch(`${BASE_URL}/api/events`);
  const { events } = await response.json();

  return (
    <section className="events-page">
      <h2 className="text-center text-2xl font-bold mb-10">All Events</h2>

      <ul className="events grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events && events.length > 0 ? (
          events.map((event: IEvent) => (
            <li key={event._id} className="list-none">
              <EventCard {...event} />
            </li>
          ))
        ) : (
          <p>No events found.</p>
        )}
      </ul>
    </section>
  );
};

export default EventsPage;
