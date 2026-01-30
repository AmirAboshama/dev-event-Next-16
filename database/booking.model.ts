import { Schema, model, models, Document, Types } from 'mongoose';
import Event from './event.model';

// TypeScript interface for Booking document
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (email: string) {
          // RFC 5322 compliant email validation regex
          const emailRegex =
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
          return emailRegex.test(email);
        },
        message: 'Please provide a valid email address',
      },
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Pre-save hook to validate that event exists
BookingSchema.pre('save', async function () {
  const booking = this as IBooking;

  // Validate eventId only if new or modified
  if (booking.isNew || booking.isModified('eventId')) {
    let eventExists;

    try {
      eventExists = await Event.findById(booking.eventId).select('_id');
    } catch {
      const error = new Error('Invalid event ID format or database error');
      error.name = 'ValidationError';
      throw error;
    }

    if (!eventExists) {
      const error = new Error(
        `Event with ID ${booking.eventId.toString()} does not exist`
      );
      error.name = 'ValidationError';
      throw error;
    }
  }
});

// 🔹 Indexes
BookingSchema.index({ eventId: 1 });
BookingSchema.index({ eventId: 1, createdAt: -1 });
BookingSchema.index({ email: 1 });

// 🔒 Enforce one booking per event per email
BookingSchema.index(
  { eventId: 1, email: 1 },
  { unique: true, name: 'uniq_event_email' }
);

const Booking =
  models.Booking || model<IBooking>('Booking', BookingSchema);

export default Booking;
