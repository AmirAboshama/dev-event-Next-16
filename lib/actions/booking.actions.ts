'use server';

import connectDB from "@/lib/mongodb";
import Booking from "@/database/booking.model";
import { error } from "console";
import { serializeUseCacheCacheStore } from "next/dist/server/resume-data-cache/cache-store";


export const createBooking = async ({eventId, slug, email}: {eventId: string, slug: string, email: string}) => {

try {
    await connectDB();
  await Booking.create({eventId, slug, email}
    )

    return {success: true};

} catch(e){
console.error("create booking error");
return {success: false};

}}