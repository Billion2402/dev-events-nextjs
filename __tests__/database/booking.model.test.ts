import mongoose from 'mongoose';
import Booking, { IBooking } from '@/database/booking.model';
import Event from '@/database/event.model';

describe('Booking Model', () => {
  let testEventId: mongoose.Types.ObjectId;

  const validEventData = {
    title: 'Test Event',
    description: 'Test Description',
    overview: 'Test Overview',
    image: 'https://example.com/image.jpg',
    venue: 'Test Venue',
    location: 'Test Location',
    date: '2024-12-15',
    time: '09:00',
    mode: 'online',
    audience: 'Developers',
    agenda: ['Item 1'],
    organizer: 'Test Organizer',
    tags: ['test'],
  };

  beforeEach(async () => {
    // Create a test event for bookings
    const event = await Event.create(validEventData);
    testEventId = event._id as mongoose.Types.ObjectId;
  });

  const validBookingData = () => ({
    eventId: testEventId,
    email: 'test@example.com',
  });

  describe('Schema Validation', () => {
    describe('Required Fields', () => {
      it('should create a booking with valid data', async () => {
        const booking = new Booking(validBookingData());
        const savedBooking = await booking.save();

        expect(savedBooking._id).toBeDefined();
        expect(savedBooking.eventId.toString()).toBe(testEventId.toString());
        expect(savedBooking.email).toBe('test@example.com');
        expect(savedBooking.createdAt).toBeDefined();
        expect(savedBooking.updatedAt).toBeDefined();
      });

      it('should fail when eventId is missing', async () => {
        const bookingData = validBookingData();
        delete (bookingData as any).eventId;
        const booking = new Booking(bookingData);

        await expect(booking.save()).rejects.toThrow(/Event ID is required/);
      });

      it('should fail when email is missing', async () => {
        const bookingData = validBookingData();
        delete (bookingData as any).email;
        const booking = new Booking(bookingData);

        await expect(booking.save()).rejects.toThrow(/Email is required/);
      });
    });

    describe('Email Validation', () => {
      it('should accept a valid email address', async () => {
        const booking = new Booking({
          ...validBookingData(),
          email: 'user@example.com',
        });
        const savedBooking = await booking.save();
        expect(savedBooking.email).toBe('user@example.com');
      });

      it('should accept email with subdomains', async () => {
        const booking = new Booking({
          ...validBookingData(),
          email: 'user@mail.example.com',
        });
        const savedBooking = await booking.save();
        expect(savedBooking.email).toBe('user@mail.example.com');
      });

      it('should accept email with plus sign', async () => {
        const booking = new Booking({
          ...validBookingData(),
          email: 'user+tag@example.com',
        });
        const savedBooking = await booking.save();
        expect(savedBooking.email).toBe('user+tag@example.com');
      });

      it('should accept email with dots', async () => {
        const booking = new Booking({
          ...validBookingData(),
          email: 'first.last@example.com',
        });
        const savedBooking = await booking.save();
        expect(savedBooking.email).toBe('first.last@example.com');
      });

      it('should accept email with hyphens in domain', async () => {
        const booking = new Booking({
          ...validBookingData(),
          email: 'user@my-domain.com',
        });
        const savedBooking = await booking.save();
        expect(savedBooking.email).toBe('user@my-domain.com');
      });

      it('should accept email with numbers', async () => {
        const booking = new Booking({
          ...validBookingData(),
          email: 'user123@example456.com',
        });
        const savedBooking = await booking.save();
        expect(savedBooking.email).toBe('user123@example456.com');
      });

      it('should accept email with special characters', async () => {
        const booking = new Booking({
          ...validBookingData(),
          email: "user!#$%&'*+/=?^_`{|}~@example.com",
        });
        const savedBooking = await booking.save();
        expect(savedBooking.email).toBe("user!#$%&'*+/=?^_`{|}~@example.com");
      });

      it('should fail for email without @ symbol', async () => {
        const booking = new Booking({
          ...validBookingData(),
          email: 'userexample.com',
        });
        await expect(booking.save()).rejects.toThrow(
          /Please provide a valid email address/
        );
      });

      it('should fail for email without domain', async () => {
        const booking = new Booking({
          ...validBookingData(),
          email: 'user@',
        });
        await expect(booking.save()).rejects.toThrow(
          /Please provide a valid email address/
        );
      });

      it('should fail for email without local part', async () => {
        const booking = new Booking({
          ...validBookingData(),
          email: '@example.com',
        });
        await expect(booking.save()).rejects.toThrow(
          /Please provide a valid email address/
        );
      });

      it('should fail for email with spaces', async () => {
        const booking = new Booking({
          ...validBookingData(),
          email: 'user @example.com',
        });
        await expect(booking.save()).rejects.toThrow(
          /Please provide a valid email address/
        );
      });

      it('should fail for email with double @', async () => {
        const booking = new Booking({
          ...validBookingData(),
          email: 'user@@example.com',
        });
        await expect(booking.save()).rejects.toThrow(
          /Please provide a valid email address/
        );
      });

      it('should fail for email with invalid domain', async () => {
        const booking = new Booking({
          ...validBookingData(),
          email: 'user@.com',
        });
        await expect(booking.save()).rejects.toThrow(
          /Please provide a valid email address/
        );
      });

      it('should fail for empty email string', async () => {
        const booking = new Booking({
          ...validBookingData(),
          email: '',
        });
        await expect(booking.save()).rejects.toThrow();
      });
    });

    describe('Email Normalization', () => {
      it('should convert email to lowercase', async () => {
        const booking = new Booking({
          ...validBookingData(),
          email: 'USER@EXAMPLE.COM',
        });
        const savedBooking = await booking.save();
        expect(savedBooking.email).toBe('user@example.com');
      });

      it('should convert mixed case email to lowercase', async () => {
        const booking = new Booking({
          ...validBookingData(),
          email: 'UsEr@ExAmPlE.CoM',
        });
        const savedBooking = await booking.save();
        expect(savedBooking.email).toBe('user@example.com');
      });

      it('should trim whitespace from email', async () => {
        const booking = new Booking({
          ...validBookingData(),
          email: '  user@example.com  ',
        });
        const savedBooking = await booking.save();
        expect(savedBooking.email).toBe('user@example.com');
      });

      it('should trim and lowercase email', async () => {
        const booking = new Booking({
          ...validBookingData(),
          email: '  USER@EXAMPLE.COM  ',
        });
        const savedBooking = await booking.save();
        expect(savedBooking.email).toBe('user@example.com');
      });
    });
  });

  describe('Event Validation Pre-save Hook', () => {
    it('should succeed when eventId references an existing event', async () => {
      const booking = new Booking(validBookingData());
      const savedBooking = await booking.save();
      expect(savedBooking.eventId.toString()).toBe(testEventId.toString());
    });

    it('should fail when eventId references a non-existent event', async () => {
      const fakeEventId = new mongoose.Types.ObjectId();
      const booking = new Booking({
        eventId: fakeEventId,
        email: 'test@example.com',
      });

      await expect(booking.save()).rejects.toThrow(/does not exist/);
    });

    it('should fail with invalid eventId format', async () => {
      const booking = new Booking({
        eventId: 'invalid-id' as any,
        email: 'test@example.com',
      });

      await expect(booking.save()).rejects.toThrow();
    });

    it('should validate eventId on update', async () => {
      const booking = new Booking(validBookingData());
      const savedBooking = await booking.save();

      const newEvent = await Event.create({
        ...validEventData,
        title: 'Another Event',
      });
      savedBooking.eventId = newEvent._id as mongoose.Types.ObjectId;

      await expect(savedBooking.save()).resolves.toBeDefined();
    });

    it('should fail validation when updating to non-existent eventId', async () => {
      const booking = new Booking(validBookingData());
      const savedBooking = await booking.save();

      const fakeEventId = new mongoose.Types.ObjectId();
      savedBooking.eventId = fakeEventId;

      await expect(savedBooking.save()).rejects.toThrow(/does not exist/);
    });

    it('should not re-validate eventId if not modified', async () => {
      const booking = new Booking(validBookingData());
      const savedBooking = await booking.save();

      // Delete the event
      await Event.deleteOne({ _id: testEventId });

      // Update email only (should succeed as eventId not modified)
      savedBooking.email = 'newemail@example.com';
      await expect(savedBooking.save()).resolves.toBeDefined();
    });
  });

  describe('Unique Constraint', () => {
    it('should allow different users to book the same event', async () => {
      const booking1 = new Booking({
        eventId: testEventId,
        email: 'user1@example.com',
      });
      const booking2 = new Booking({
        eventId: testEventId,
        email: 'user2@example.com',
      });

      await booking1.save();
      await booking2.save();

      const count = await Booking.countDocuments({ eventId: testEventId });
      expect(count).toBe(2);
    });

    it('should allow same user to book different events', async () => {
      const event2 = await Event.create({
        ...validEventData,
        title: 'Second Event',
      });

      const booking1 = new Booking({
        eventId: testEventId,
        email: 'user@example.com',
      });
      const booking2 = new Booking({
        eventId: event2._id,
        email: 'user@example.com',
      });

      await booking1.save();
      await booking2.save();

      const count = await Booking.countDocuments({ email: 'user@example.com' });
      expect(count).toBe(2);
    });

    it('should prevent duplicate booking for same event and email', async () => {
      const booking1 = new Booking({
        eventId: testEventId,
        email: 'user@example.com',
      });
      await booking1.save();

      const booking2 = new Booking({
        eventId: testEventId,
        email: 'user@example.com',
      });

      await expect(booking2.save()).rejects.toThrow(/duplicate key/);
    });

    it('should prevent duplicate even with different case emails', async () => {
      const booking1 = new Booking({
        eventId: testEventId,
        email: 'user@example.com',
      });
      await booking1.save();

      const booking2 = new Booking({
        eventId: testEventId,
        email: 'USER@EXAMPLE.COM',
      });

      await expect(booking2.save()).rejects.toThrow(/duplicate key/);
    });

    it('should prevent duplicate even with whitespace differences', async () => {
      const booking1 = new Booking({
        eventId: testEventId,
        email: 'user@example.com',
      });
      await booking1.save();

      const booking2 = new Booking({
        eventId: testEventId,
        email: '  user@example.com  ',
      });

      await expect(booking2.save()).rejects.toThrow(/duplicate key/);
    });
  });

  describe('Timestamps', () => {
    it('should automatically add createdAt timestamp', async () => {
      const booking = new Booking(validBookingData());
      const savedBooking = await booking.save();
      expect(savedBooking.createdAt).toBeInstanceOf(Date);
    });

    it('should automatically add updatedAt timestamp', async () => {
      const booking = new Booking(validBookingData());
      const savedBooking = await booking.save();
      expect(savedBooking.updatedAt).toBeInstanceOf(Date);
    });

    it('should update updatedAt when document is modified', async () => {
      const booking = new Booking(validBookingData());
      const savedBooking = await booking.save();
      const originalUpdatedAt = savedBooking.updatedAt;

      await new Promise((resolve) => setTimeout(resolve, 10));

      savedBooking.email = 'newemail@example.com';
      await savedBooking.save();

      expect(savedBooking.updatedAt.getTime()).toBeGreaterThan(
        originalUpdatedAt.getTime()
      );
    });

    it('should not change createdAt when document is modified', async () => {
      const booking = new Booking(validBookingData());
      const savedBooking = await booking.save();
      const originalCreatedAt = savedBooking.createdAt;

      savedBooking.email = 'newemail@example.com';
      await savedBooking.save();

      expect(savedBooking.createdAt.getTime()).toBe(originalCreatedAt.getTime());
    });
  });

  describe('Indexes', () => {
    it('should have an index on eventId', async () => {
      const indexes = Booking.schema.indexes();
      const eventIdIndex = indexes.find((idx) => idx[0].eventId === 1);
      expect(eventIdIndex).toBeDefined();
    });

    it('should have an index on email', async () => {
      const indexes = Booking.schema.indexes();
      const emailIndex = indexes.find((idx) => idx[0].email === 1);
      expect(emailIndex).toBeDefined();
    });

    it('should have a compound index on eventId and createdAt', async () => {
      const indexes = Booking.schema.indexes();
      const compoundIndex = indexes.find(
        (idx) => idx[0].eventId && idx[0].createdAt
      );
      expect(compoundIndex).toBeDefined();
    });

    it('should have a unique compound index on eventId and email', async () => {
      const indexes = Booking.schema.indexes();
      const uniqueIndex = indexes.find(
        (idx) => idx[0].eventId && idx[0].email && idx[1].unique
      );
      expect(uniqueIndex).toBeDefined();
    });
  });

  describe('Query Operations', () => {
    beforeEach(async () => {
      await Booking.create([
        { eventId: testEventId, email: 'user1@example.com' },
        { eventId: testEventId, email: 'user2@example.com' },
        { eventId: testEventId, email: 'user3@example.com' },
      ]);
    });

    it('should find all bookings for an event', async () => {
      const bookings = await Booking.find({ eventId: testEventId });
      expect(bookings).toHaveLength(3);
    });

    it('should find booking by email', async () => {
      const booking = await Booking.findOne({ email: 'user1@example.com' });
      expect(booking).toBeDefined();
      expect(booking!.email).toBe('user1@example.com');
    });

    it('should count bookings for an event', async () => {
      const count = await Booking.countDocuments({ eventId: testEventId });
      expect(count).toBe(3);
    });

    it('should populate event details', async () => {
      const booking = await Booking.findOne({ email: 'user1@example.com' }).populate('eventId');
      expect(booking).toBeDefined();
      expect((booking!.eventId as any).title).toBe('Test Event');
    });

    it('should update booking email', async () => {
      const booking = await Booking.findOne({ email: 'user1@example.com' });
      booking!.email = 'updated@example.com';
      await booking!.save();

      const updatedBooking = await Booking.findById(booking!._id);
      expect(updatedBooking!.email).toBe('updated@example.com');
    });

    it('should delete booking', async () => {
      const booking = await Booking.findOne({ email: 'user1@example.com' });
      await Booking.deleteOne({ _id: booking!._id });

      const deletedBooking = await Booking.findById(booking!._id);
      expect(deletedBooking).toBeNull();
    });

    it('should find bookings sorted by creation date', async () => {
      const bookings = await Booking.find({ eventId: testEventId }).sort({ createdAt: -1 });
      expect(bookings).toHaveLength(3);
      expect(bookings[0].createdAt.getTime()).toBeGreaterThanOrEqual(
        bookings[1].createdAt.getTime()
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle booking with very long email', async () => {
      const longEmail = `${'a'.repeat(50)}@${'example'.repeat(10)}.com`;
      const booking = new Booking({
        eventId: testEventId,
        email: longEmail,
      });
      const savedBooking = await booking.save();
      expect(savedBooking.email).toBe(longEmail.toLowerCase());
    });

    it('should handle multiple bookings created simultaneously', async () => {
      const bookingPromises = Array.from({ length: 5 }, (_, i) =>
        Booking.create({
          eventId: testEventId,
          email: `user${i}@example.com`,
        })
      );

      const bookings = await Promise.all(bookingPromises);
      expect(bookings).toHaveLength(5);
    });

    it('should handle booking after event is deleted (referential integrity)', async () => {
      const booking = new Booking(validBookingData());
      await booking.save();

      // Delete the event
      await Event.deleteOne({ _id: testEventId });

      // The booking should still exist
      const existingBooking = await Booking.findById(booking._id);
      expect(existingBooking).toBeDefined();
    });
  });

  describe('Model Methods', () => {
    it('should convert booking to JSON', async () => {
      const booking = new Booking(validBookingData());
      const savedBooking = await booking.save();
      const json = savedBooking.toJSON();

      expect(json).toHaveProperty('_id');
      expect(json).toHaveProperty('eventId');
      expect(json).toHaveProperty('email');
      expect(json).toHaveProperty('createdAt');
      expect(json).toHaveProperty('updatedAt');
    });

    it('should convert booking to object', async () => {
      const booking = new Booking(validBookingData());
      const savedBooking = await booking.save();
      const obj = savedBooking.toObject();

      expect(obj).toHaveProperty('_id');
      expect(obj).toHaveProperty('eventId');
      expect(obj).toHaveProperty('email');
    });
  });
});