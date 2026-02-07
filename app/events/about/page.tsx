import Image from "next/image";

const AboutPage = () => {
  return (
    <section className="w-full">
      
      {/* HERO IMAGE */}
      <div className="relative w-full h-[70vh]">
        <Image
          src="/images/event-full.png"   // ✅ المسار الصح
          alt="About DevEvent"
          fill
          priority
          className="object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <h1 className="text-white text-5xl font-bold text-center">
            About DevEvent
          </h1>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto py-20 px-6 text-center">
        <p className="text-white text-lg leading-8">
          DevEvent is your ultimate hub for discovering the most exciting
          developer events around the world. From hackathons and meetups to
          large-scale tech conferences, we bring everything together in one
          place.
        </p>

        <p className="text-white text-lg leading-8 mt-6">
          Our mission is to connect developers, inspire innovation, and help
          tech communities grow by making events easy to discover and attend.
        </p>
      </div>

    </section>
  );
};

export default AboutPage;
