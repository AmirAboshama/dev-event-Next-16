import Image from "next/image";
import { notFound } from "next/navigation";

 const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
 const EventDetailsItem=({icon,alt,label}:{icon:string,alt:string,label:string})=>(
    <div className="flex-row-gab-2 items-center">
<Image src={icon} alt={alt} width={17} height={17}/>
  <p>{label}</p>
      </div>)

const EventAgenda=({agendaItems}:{ agendaItems:string[]})=>(
  <div className="agenda flex-col-gab-2">
    <h2>agenda</h2>
    <ul>
      {agendaItems.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
)

const EventTags=({tags}:{tags:string[]})=>(
  <div className="tags flex-row-gab-1.5 flex-wrap">

 {tags.map((tag) => ( <div key={tag} className="pill">{tag}</div> ))}

    </div> )
const EventDetailsPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;

    let event;
    try {
      const request= await fetch(`${BASE_URL}/api/events/${slug}`, {
  next: { revalidate: 60 }
});


      if (!request.ok) {
        if (request.status === 404) { 
          return notFound();
        }
        throw new Error(`Failed to fetch event data:${request.statusText}`);
    }
    const response=await request.json();
    event=response.event;

if(!event){
  return notFound();
}
    }catch (error) {
      console.error('Error fetching event data:', error);
      return notFound();
    }
    const request = await fetch(  `${BASE_URL}/api/events/${slug}` );
    const {event:{title, description, date, location,image,overview,mode,time,agenda,audiance,tags, orgnizer}} = await request.json();

    if(!description){
        return notFound();
    }
  return (
    <section id="event ">
      <div className="header"> 
        <h1>event describtion </h1>
        <p >{description}</p>
      </div>


      <div className="details"> 
<div className="content">
  <Image src={image} alt="event-baner" width={800} height={800} className="baner-image"/>
  <section className="flex-col-gab-2">
<h2>overview</h2>
<p>{overview}</p>
  </section>
  <section className="flex-col-gab-2">
<h2>event-details</h2>
<EventDetailsItem icon="/icons/calendar.svg" alt="calendar-icon" label={date} />
<EventDetailsItem icon="/icons/clock.svg" alt="time-icon" label={time} />
<EventDetailsItem icon="/icons/pin.svg" alt="location-icon" label={location} />
<EventDetailsItem icon="/icons/mode.svg" alt="mode-icon" label={mode} />
<EventDetailsItem icon="/icons/audience.svg" alt="audiance-icon" label={audiance} />
  </section>
<EventAgenda agendaItems={JSON.parse(agenda[0])} />
<section className=" flex-col-gab-2">
<h1>
  about the orgnizer
</h1>
<p>{orgnizer}</p>
</section>

<EventTags tags={JSON.parse(tags[0])} />


</div>

<aside className="booking ">
  <p className="text-lg font-semiblod"> booking event </p>
</aside>
      </div>




    </section>
  )
}

export default EventDetailsPage
