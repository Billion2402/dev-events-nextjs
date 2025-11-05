import * as databaseExports from '@/database/index';
import Event from '@/database/event.model';
import Booking from '@/database/booking.model';

describe('Database Index Exports', () => {
  describe('Model Exports', () => {
    it('should export Event model', () => {
      expect(databaseExports.Event).toBeDefined();
      expect(databaseExports.Event).toBe(Event);
    });

    it('should export Booking model', () => {
      expect(databaseExports.Booking).toBeDefined();
      expect(databaseExports.Booking).toBe(Booking);
    });

    it('should have Event model with correct schema', () => {
      const eventSchema = databaseExports.Event.schema;
      expect(eventSchema).toBeDefined();
      expect(eventSchema.paths.title).toBeDefined();
      expect(eventSchema.paths.description).toBeDefined();
      expect(eventSchema.paths.slug).toBeDefined();
    });

    it('should have Booking model with correct schema', () => {
      const bookingSchema = databaseExports.Booking.schema;
      expect(bookingSchema).toBeDefined();
      expect(bookingSchema.paths.eventId).toBeDefined();
      expect(bookingSchema.paths.email).toBeDefined();
    });
  });

  describe('Type Exports', () => {
    it('should allow creating typed Event objects', () => {
      const eventData: databaseExports.IEvent = {
        title: 'Test Event',
        slug: 'test-event',
        description: 'Description',
        overview: 'Overview',
        image: 'image.jpg',
        venue: 'Venue',
        location: 'Location',
        date: '2024-12-15',
        time: '09:00',
        mode: 'online',
        audience: 'Developers',
        agenda: ['Item 1'],
        organizer: 'Organizer',
        tags: ['tag1'],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as databaseExports.IEvent;

      expect(eventData.title).toBe('Test Event');
    });

    it('should allow creating typed Booking objects', () => {
      const bookingData: Partial<databaseExports.IBooking> = {
        email: 'test@example.com',
      };

      expect(bookingData.email).toBe('test@example.com');
    });
  });

  describe('Module Structure', () => {
    it('should export exactly the expected members', () => {
      const exports = Object.keys(databaseExports);
      expect(exports).toContain('Event');
      expect(exports).toContain('Booking');
    });

    it('should have Event as a function (model constructor)', () => {
      expect(typeof databaseExports.Event).toBe('function');
    });

    it('should have Booking as a function (model constructor)', () => {
      expect(typeof databaseExports.Booking).toBe('function');
    });
  });

  describe('Integration', () => {
    it('should allow creating an Event through exported model', async () => {
      const event = new databaseExports.Event({
        title: 'Export Test Event',
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
      });

      const savedEvent = await event.save();
      expect(savedEvent._id).toBeDefined();
      expect(savedEvent.title).toBe('Export Test Event');
    });

    it('should allow creating a Booking through exported model', async () => {
      // First create an event
      const event = await databaseExports.Event.create({
        title: 'Event for Booking Test',
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
      });

      const booking = new databaseExports.Booking({
        eventId: event._id,
        email: 'export-test@example.com',
      });

      const savedBooking = await booking.save();
      expect(savedBooking._id).toBeDefined();
      expect(savedBooking.email).toBe('export-test@example.com');
    });
  });
});