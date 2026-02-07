'use client'

import { createBooking } from '@/lib/actions/booking.actions';
import posthog from 'posthog-js';
import { useState } from 'react'

function BookEvent({eventId,slug}: {eventId: string,slug:string}) {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();

 const {success} = await createBooking({eventId,slug,email});
if(!success){
    setSubmitted(true);
    posthog.capture('booking_created', {eventId, slug, email});
}else{
    console.error("Booking creation failed");
    posthog.captureException("Booking creation failed");
}
      
    }
    return (

        <div id="book-event" className="book-event flex-col-gab-4">


            {submitted ? (
                <p className="text-sm">Thank you for signing up!</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">email Address</label>
                        <input
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            id="email"
                            placeholder='enter hyour email '
                        />
                    </div>
                    <button type="submit" className='button-submit'>Submit </button>
                </form>
            )}
        </div>
    )


}

export default BookEvent
