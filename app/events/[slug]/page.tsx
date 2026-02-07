// import BookEvent from "@/components/BookEvent";
// import { IEvent } from "@/database";
// import { get } from "http";
// import Image from "next/image";
// import { notFound } from "next/navigation";
// import { getSimilarEventsBySlug } from "@/lib/actions/events.actions";
// import EventCard from "@/components/EventCard";
// import { cacheLife } from "next/cache";

// const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

// const EventDetailsItem = ({
//   icon,
//   alt,
//   label,
// }: {
//   icon: string;
//   alt: string;
//   label: string;
// }) => (
//   <div className="flex-row-gab-2 items-center">
//     <Image src={icon} alt={alt} width={17} height={17} />
//     <p>{label}</p>
//   </div>
// );

// const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
//   <div className="agenda flex-col-gab-2">
//     <h2>Agenda</h2>
//     <ul>
//       {agendaItems.map((item) => (
//         <li key={item}>{item}</li>
//       ))}
//     </ul>
//   </div>
// );

// const EventTags = ({ tags }: { tags: string[] }) => (
//   <div className="tags flex-row-gab-1.5 flex-wrap">
//     {tags.map((tag) => (
//       <div key={tag} className="pill">
//         {tag}
//       </div>
//     ))}
//   </div>
// );

// const EventDetailsPage = async ({
//   params,
// }: {
//  params: Promise<{ slug: string }>;}) => {
//   'use cache';
//   cacheLife('hours');
//   const { slug } = await  params;

//   let event;
//   try {
//     const res = await fetch(`${BASE_URL}/api/events/${slug}`, {
//       next: { revalidate: 60 },
//     });

//     if (!res.ok) {
//       if (res.status === 404) return notFound();
//       throw new Error(`Failed to fetch event: ${res.statusText}`);
//     }

//     const data = await res.json();
//     event = data.event;

//     if (!event) return notFound();
//   } catch (error) {
//     console.error("Error fetching event:", error);
//     return notFound();
//   }

//   const {
//     title,
//     description,
//     date,
//     location,
//     image,
//     overview,
//     mode,
//     time,
//     agenda,
//     audiance,
//     tags,
//     orgnizer,
//   } = event;

// const agendaItems = Array.isArray(agenda) ? agenda : [];
// const tagItems = Array.isArray(tags) ? tags : [];


//   if (!description) return notFound();
//   const booking = 10;
// const similerEvents:IEvent[]=await getSimilarEventsBySlug(slug);

//   return (
//     <section id="event">
//       <div className="header">
//         <h1>{title}</h1>
//         <p>{description}</p>
//       </div>

//       <div className="details">
//         <div className="content">
//           <Image
//             src={image || "/images/placeholder.png"}
//             alt="event-banner"
//             width={800}
//             height={800}
//             className="banner-image"
//           />

//           <section className="flex-col-gab-2">
//             <h2>Overview</h2>
//             <p>{overview}</p>
//           </section>

//           <section className="flex-col-gab-2">
//             <h2>Event Details</h2>
//             <EventDetailsItem
//               icon="/icons/calendar.svg"
//               alt="calendar-icon"
//               label={date}
//             />
//             <EventDetailsItem
//               icon="/icons/clock.svg"
//               alt="time-icon"
//               label={time}
//             />
//             <EventDetailsItem
//               icon="/icons/pin.svg"
//               alt="location-icon"
//               label={location}
//             />
//             <EventDetailsItem
//               icon="/icons/mode.svg"
//               alt="mode-icon"
//               label={mode}
//             />
//             <EventDetailsItem
//               icon="/icons/audience.svg"
//               alt="audience-icon"
//               label={audiance}
//             />
//           </section>

//           {agendaItems.length > 0 && <EventAgenda agendaItems={agendaItems} />}

//           <section className="flex-col-gab-2">
//             <h2>About the Organizer</h2>
//             <p>{orgnizer}</p>
//           </section>

//           {tagItems.length > 0 && <EventTags tags={tagItems} />}
//         </div>

//         <aside className="booking">
//           <div className="signup-card">
//             <h2>Book Event</h2>
//             {booking > 0 ? (
//               <p className="text-sm">
//                 Join {booking} people already booked this event
//               </p>
//             ) : (
//               <p className="text-sm">Be the first to book your spot</p>
//             )}
//             <BookEvent eventId={event._id} slug={slug} />
//           </div>
//         </aside>
//       </div>
//       <div className="flex w-full flex-col gap=4 pt-20">
//         <h2>Similar Events</h2>
//         <div className="events">


//           {similerEvents && similerEvents.length > 0 &&similerEvents.map((similerEvent: IEvent) => (
// <EventCard key={similerEvent._id} {...similerEvent} />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default EventDetailsPage;
import {Suspense} from "react";
import EventDetails from "@/components/EventDetails";

const EventDetailsPage = async ({ params }: { params: Promise<{ slug: string }>}) => {
    const slug = params.then((p) => p.slug);

    return (
        <main>
            <Suspense fallback={<div>Loading...</div>}>
                <EventDetails params={slug} />
            </Suspense>
        </main>
    )
}
export default EventDetailsPage