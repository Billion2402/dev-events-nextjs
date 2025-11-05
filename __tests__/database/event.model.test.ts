import mongoose from 'mongoose';
import Event, { IEvent } from '@/database/event.model';

describe('Event Model', () => {
  const validEventData = {
    title: 'React Conference 2024',
    description: 'A comprehensive conference about React and modern web development',
    overview: 'Join us for an exciting day of learning',
    image: 'https://example.com/image.jpg',
    venue: 'Tech Convention Center',
    location: 'San Francisco, CA',
    date: '2024-12-15',
    time: '09:00',
    mode: 'hybrid',
    audience: 'Developers and Tech Enthusiasts',
    agenda: ['Opening Keynote', 'Workshop Sessions', 'Networking'],
    organizer: 'Tech Events Inc',
    tags: ['react', 'javascript', 'web-development'],
  };

  describe('Schema Validation', () => {
    describe('Required Fields', () => {
      it('should create an event with all required fields', async () => {
        const event = new Event(validEventData);
        const savedEvent = await event.save();

        expect(savedEvent._id).toBeDefined();
        expect(savedEvent.title).toBe(validEventData.title);
        expect(savedEvent.description).toBe(validEventData.description);
        expect(savedEvent.slug).toBeDefined();
        expect(savedEvent.createdAt).toBeDefined();
        expect(savedEvent.updatedAt).toBeDefined();
      });

      it('should fail when title is missing', async () => {
        const eventData = { ...validEventData };
        delete (eventData as any).title;
        const event = new Event(eventData);

        await expect(event.save()).rejects.toThrow(/Title is required/);
      });

      it('should fail when description is missing', async () => {
        const eventData = { ...validEventData };
        delete (eventData as any).description;
        const event = new Event(eventData);

        await expect(event.save()).rejects.toThrow(/Description is required/);
      });

      it('should fail when overview is missing', async () => {
        const eventData = { ...validEventData };
        delete (eventData as any).overview;
        const event = new Event(eventData);

        await expect(event.save()).rejects.toThrow(/Overview is required/);
      });

      it('should fail when image is missing', async () => {
        const eventData = { ...validEventData };
        delete (eventData as any).image;
        const event = new Event(eventData);

        await expect(event.save()).rejects.toThrow(/Image URL is required/);
      });

      it('should fail when venue is missing', async () => {
        const eventData = { ...validEventData };
        delete (eventData as any).venue;
        const event = new Event(eventData);

        await expect(event.save()).rejects.toThrow(/Venue is required/);
      });

      it('should fail when location is missing', async () => {
        const eventData = { ...validEventData };
        delete (eventData as any).location;
        const event = new Event(eventData);

        await expect(event.save()).rejects.toThrow(/Location is required/);
      });

      it('should fail when date is missing', async () => {
        const eventData = { ...validEventData };
        delete (eventData as any).date;
        const event = new Event(eventData);

        await expect(event.save()).rejects.toThrow(/Date is required/);
      });

      it('should fail when time is missing', async () => {
        const eventData = { ...validEventData };
        delete (eventData as any).time;
        const event = new Event(eventData);

        await expect(event.save()).rejects.toThrow(/Time is required/);
      });

      it('should fail when mode is missing', async () => {
        const eventData = { ...validEventData };
        delete (eventData as any).mode;
        const event = new Event(eventData);

        await expect(event.save()).rejects.toThrow(/Mode is required/);
      });

      it('should fail when audience is missing', async () => {
        const eventData = { ...validEventData };
        delete (eventData as any).audience;
        const event = new Event(eventData);

        await expect(event.save()).rejects.toThrow(/Audience is required/);
      });

      it('should fail when organizer is missing', async () => {
        const eventData = { ...validEventData };
        delete (eventData as any).organizer;
        const event = new Event(eventData);

        await expect(event.save()).rejects.toThrow(/Organizer is required/);
      });
    });

    describe('Field Length Validation', () => {
      it('should fail when title exceeds 100 characters', async () => {
        const event = new Event({
          ...validEventData,
          title: 'a'.repeat(101),
        });

        await expect(event.save()).rejects.toThrow(/cannot exceed 100 characters/);
      });

      it('should succeed when title is exactly 100 characters', async () => {
        const event = new Event({
          ...validEventData,
          title: 'a'.repeat(100),
        });

        const savedEvent = await event.save();
        expect(savedEvent.title).toHaveLength(100);
      });

      it('should fail when description exceeds 1000 characters', async () => {
        const event = new Event({
          ...validEventData,
          description: 'a'.repeat(1001),
        });

        await expect(event.save()).rejects.toThrow(/cannot exceed 1000 characters/);
      });

      it('should succeed when description is exactly 1000 characters', async () => {
        const event = new Event({
          ...validEventData,
          description: 'a'.repeat(1000),
        });

        const savedEvent = await event.save();
        expect(savedEvent.description).toHaveLength(1000);
      });

      it('should fail when overview exceeds 500 characters', async () => {
        const event = new Event({
          ...validEventData,
          overview: 'a'.repeat(501),
        });

        await expect(event.save()).rejects.toThrow(/cannot exceed 500 characters/);
      });

      it('should succeed when overview is exactly 500 characters', async () => {
        const event = new Event({
          ...validEventData,
          overview: 'a'.repeat(500),
        });

        const savedEvent = await event.save();
        expect(savedEvent.overview).toHaveLength(500);
      });
    });

    describe('Mode Enum Validation', () => {
      it('should accept "online" as a valid mode', async () => {
        const event = new Event({ ...validEventData, mode: 'online' });
        const savedEvent = await event.save();
        expect(savedEvent.mode).toBe('online');
      });

      it('should accept "offline" as a valid mode', async () => {
        const event = new Event({ ...validEventData, mode: 'offline' });
        const savedEvent = await event.save();
        expect(savedEvent.mode).toBe('offline');
      });

      it('should accept "hybrid" as a valid mode', async () => {
        const event = new Event({ ...validEventData, mode: 'hybrid' });
        const savedEvent = await event.save();
        expect(savedEvent.mode).toBe('hybrid');
      });

      it('should fail when mode is invalid', async () => {
        const event = new Event({ ...validEventData, mode: 'invalid-mode' });
        await expect(event.save()).rejects.toThrow(/Mode must be either online, offline, or hybrid/);
      });
    });

    describe('Array Field Validation', () => {
      it('should fail when agenda is empty', async () => {
        const event = new Event({ ...validEventData, agenda: [] });
        await expect(event.save()).rejects.toThrow(/At least one agenda item is required/);
      });

      it('should succeed with single agenda item', async () => {
        const event = new Event({ ...validEventData, agenda: ['Single Item'] });
        const savedEvent = await event.save();
        expect(savedEvent.agenda).toHaveLength(1);
      });

      it('should succeed with multiple agenda items', async () => {
        const event = new Event({
          ...validEventData,
          agenda: ['Item 1', 'Item 2', 'Item 3'],
        });
        const savedEvent = await event.save();
        expect(savedEvent.agenda).toHaveLength(3);
      });

      it('should fail when tags array is empty', async () => {
        const event = new Event({ ...validEventData, tags: [] });
        await expect(event.save()).rejects.toThrow(/At least one tag is required/);
      });

      it('should succeed with single tag', async () => {
        const event = new Event({ ...validEventData, tags: ['single-tag'] });
        const savedEvent = await event.save();
        expect(savedEvent.tags).toHaveLength(1);
      });

      it('should succeed with multiple tags', async () => {
        const event = new Event({
          ...validEventData,
          tags: ['tag1', 'tag2', 'tag3'],
        });
        const savedEvent = await event.save();
        expect(savedEvent.tags).toHaveLength(3);
      });
    });

    describe('String Trimming', () => {
      it('should trim whitespace from title', async () => {
        const event = new Event({ ...validEventData, title: '  Trimmed Title  ' });
        const savedEvent = await event.save();
        expect(savedEvent.title).toBe('Trimmed Title');
      });

      it('should trim whitespace from description', async () => {
        const event = new Event({
          ...validEventData,
          description: '  Trimmed Description  ',
        });
        const savedEvent = await event.save();
        expect(savedEvent.description).toBe('Trimmed Description');
      });

      it('should trim whitespace from overview', async () => {
        const event = new Event({
          ...validEventData,
          overview: '  Trimmed Overview  ',
        });
        const savedEvent = await event.save();
        expect(savedEvent.overview).toBe('Trimmed Overview');
      });

      it('should trim whitespace from venue', async () => {
        const event = new Event({ ...validEventData, venue: '  Convention Center  ' });
        const savedEvent = await event.save();
        expect(savedEvent.venue).toBe('Convention Center');
      });

      it('should trim whitespace from location', async () => {
        const event = new Event({ ...validEventData, location: '  San Francisco  ' });
        const savedEvent = await event.save();
        expect(savedEvent.location).toBe('San Francisco');
      });
    });
  });

  describe('Slug Generation', () => {
    it('should generate a slug from title on creation', async () => {
      const event = new Event({ ...validEventData, title: 'React Conference 2024' });
      const savedEvent = await event.save();
      expect(savedEvent.slug).toBe('react-conference-2024');
    });

    it('should convert title to lowercase in slug', async () => {
      const event = new Event({ ...validEventData, title: 'UPPERCASE TITLE' });
      const savedEvent = await event.save();
      expect(savedEvent.slug).toBe('uppercase-title');
    });

    it('should replace spaces with hyphens in slug', async () => {
      const event = new Event({ ...validEventData, title: 'Multiple Word Title' });
      const savedEvent = await event.save();
      expect(savedEvent.slug).toBe('multiple-word-title');
    });

    it('should remove special characters from slug', async () => {
      const event = new Event({
        ...validEventData,
        title: 'Title with $pecial @#$ Characters!',
      });
      const savedEvent = await event.save();
      expect(savedEvent.slug).toBe('title-with-pecial-characters');
    });

    it('should replace multiple spaces with single hyphen', async () => {
      const event = new Event({
        ...validEventData,
        title: 'Title    with    multiple    spaces',
      });
      const savedEvent = await event.save();
      expect(savedEvent.slug).toBe('title-with-multiple-spaces');
    });

    it('should replace multiple hyphens with single hyphen', async () => {
      const event = new Event({ ...validEventData, title: 'Title---with---hyphens' });
      const savedEvent = await event.save();
      expect(savedEvent.slug).toBe('title-with-hyphens');
    });

    it('should remove leading and trailing hyphens', async () => {
      const event = new Event({ ...validEventData, title: '-Title with hyphens-' });
      const savedEvent = await event.save();
      expect(savedEvent.slug).toBe('title-with-hyphens');
    });

    it('should trim whitespace before generating slug', async () => {
      const event = new Event({ ...validEventData, title: '  Title with spaces  ' });
      const savedEvent = await event.save();
      expect(savedEvent.slug).toBe('title-with-spaces');
    });

    it('should regenerate slug when title is modified', async () => {
      const event = new Event(validEventData);
      const savedEvent = await event.save();
      const originalSlug = savedEvent.slug;

      savedEvent.title = 'Updated Title';
      await savedEvent.save();

      expect(savedEvent.slug).toBe('updated-title');
      expect(savedEvent.slug).not.toBe(originalSlug);
    });

    it('should enforce unique slug constraint', async () => {
      const event1 = new Event(validEventData);
      await event1.save();

      const event2 = new Event(validEventData);
      await expect(event2.save()).rejects.toThrow(/duplicate key/);
    });
  });

  describe('Date Normalization', () => {
    it('should normalize date to ISO format (YYYY-MM-DD)', async () => {
      const event = new Event({ ...validEventData, date: '2024-12-15' });
      const savedEvent = await event.save();
      expect(savedEvent.date).toBe('2024-12-15');
    });

    it('should handle date string with full ISO format', async () => {
      const event = new Event({
        ...validEventData,
        date: '2024-12-15T10:30:00.000Z',
      });
      const savedEvent = await event.save();
      expect(savedEvent.date).toBe('2024-12-15');
    });

    it('should handle date string in MM/DD/YYYY format', async () => {
      const event = new Event({ ...validEventData, date: '12/15/2024' });
      const savedEvent = await event.save();
      expect(savedEvent.date).toBe('2024-12-15');
    });

    it('should throw error for invalid date format', async () => {
      const event = new Event({ ...validEventData, date: 'invalid-date' });
      await expect(event.save()).rejects.toThrow(/Invalid date format/);
    });

    it('should throw error for empty date string', async () => {
      const event = new Event({ ...validEventData, date: '' });
      await expect(event.save()).rejects.toThrow();
    });

    it('should update normalized date when date is modified', async () => {
      const event = new Event(validEventData);
      const savedEvent = await event.save();

      savedEvent.date = '2025-01-20';
      await savedEvent.save();
      expect(savedEvent.date).toBe('2025-01-20');
    });
  });

  describe('Time Normalization', () => {
    it('should normalize 24-hour time format (HH:MM)', async () => {
      const event = new Event({ ...validEventData, time: '14:30' });
      const savedEvent = await event.save();
      expect(savedEvent.time).toBe('14:30');
    });

    it('should normalize single-digit hour to double-digit', async () => {
      const event = new Event({ ...validEventData, time: '9:00' });
      const savedEvent = await event.save();
      expect(savedEvent.time).toBe('09:00');
    });

    it('should convert 12-hour PM format to 24-hour', async () => {
      const event = new Event({ ...validEventData, time: '02:30 PM' });
      const savedEvent = await event.save();
      expect(savedEvent.time).toBe('14:30');
    });

    it('should convert 12-hour AM format to 24-hour', async () => {
      const event = new Event({ ...validEventData, time: '09:30 AM' });
      const savedEvent = await event.save();
      expect(savedEvent.time).toBe('09:30');
    });

    it('should handle 12:00 PM (noon) correctly', async () => {
      const event = new Event({ ...validEventData, time: '12:00 PM' });
      const savedEvent = await event.save();
      expect(savedEvent.time).toBe('12:00');
    });

    it('should handle 12:00 AM (midnight) correctly', async () => {
      const event = new Event({ ...validEventData, time: '12:00 AM' });
      const savedEvent = await event.save();
      expect(savedEvent.time).toBe('00:00');
    });

    it('should handle 12:30 PM correctly', async () => {
      const event = new Event({ ...validEventData, time: '12:30 PM' });
      const savedEvent = await event.save();
      expect(savedEvent.time).toBe('12:30');
    });

    it('should handle 12:30 AM correctly', async () => {
      const event = new Event({ ...validEventData, time: '12:30 AM' });
      const savedEvent = await event.save();
      expect(savedEvent.time).toBe('00:30');
    });

    it('should handle case-insensitive AM/PM', async () => {
      const event = new Event({ ...validEventData, time: '03:45 pm' });
      const savedEvent = await event.save();
      expect(savedEvent.time).toBe('15:45');
    });

    it('should throw error for invalid time format', async () => {
      const event = new Event({ ...validEventData, time: 'invalid-time' });
      await expect(event.save()).rejects.toThrow(/Invalid time format/);
    });

    it('should throw error for time with invalid hours', async () => {
      const event = new Event({ ...validEventData, time: '25:30' });
      await expect(event.save()).rejects.toThrow(/Invalid time values/);
    });

    it('should throw error for time with invalid minutes', async () => {
      const event = new Event({ ...validEventData, time: '14:60' });
      await expect(event.save()).rejects.toThrow(/Invalid time values/);
    });

    it('should throw error for negative hours', async () => {
      const event = new Event({ ...validEventData, time: '-1:30' });
      await expect(event.save()).rejects.toThrow();
    });

    it('should throw error for time without colon', async () => {
      const event = new Event({ ...validEventData, time: '1430' });
      await expect(event.save()).rejects.toThrow(/Invalid time format/);
    });
  });

  describe('Timestamps', () => {
    it('should automatically add createdAt timestamp', async () => {
      const event = new Event(validEventData);
      const savedEvent = await event.save();
      expect(savedEvent.createdAt).toBeInstanceOf(Date);
    });

    it('should automatically add updatedAt timestamp', async () => {
      const event = new Event(validEventData);
      const savedEvent = await event.save();
      expect(savedEvent.updatedAt).toBeInstanceOf(Date);
    });

    it('should update updatedAt when document is modified', async () => {
      const event = new Event(validEventData);
      const savedEvent = await event.save();
      const originalUpdatedAt = savedEvent.updatedAt;

      // Wait a bit to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 10));

      savedEvent.title = 'Updated Title';
      await savedEvent.save();

      expect(savedEvent.updatedAt.getTime()).toBeGreaterThan(
        originalUpdatedAt.getTime()
      );
    });

    it('should not change createdAt when document is modified', async () => {
      const event = new Event(validEventData);
      const savedEvent = await event.save();
      const originalCreatedAt = savedEvent.createdAt;

      savedEvent.title = 'Updated Title';
      await savedEvent.save();

      expect(savedEvent.createdAt.getTime()).toBe(originalCreatedAt.getTime());
    });
  });

  describe('Indexes', () => {
    it('should have a unique index on slug', async () => {
      const indexes = Event.schema.indexes();
      const slugIndex = indexes.find((idx) => idx[0].slug);
      expect(slugIndex).toBeDefined();
      expect(slugIndex![1].unique).toBe(true);
    });

    it('should have a compound index on date and mode', async () => {
      const indexes = Event.schema.indexes();
      const compoundIndex = indexes.find(
        (idx) => idx[0].date && idx[0].mode
      );
      expect(compoundIndex).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle event with minimal valid data', async () => {
      const minimalEvent = {
        title: 'E',
        description: 'D',
        overview: 'O',
        image: 'i',
        venue: 'V',
        location: 'L',
        date: '2024-01-01',
        time: '00:00',
        mode: 'online',
        audience: 'A',
        agenda: ['A'],
        organizer: 'O',
        tags: ['T'],
      };

      const event = new Event(minimalEvent);
      const savedEvent = await event.save();
      expect(savedEvent._id).toBeDefined();
    });

    it('should handle event with unicode characters in title', async () => {
      const event = new Event({
        ...validEventData,
        title: 'Événement Spécial 2024 中文 العربية',
      });
      const savedEvent = await event.save();
      expect(savedEvent.title).toContain('Événement');
      expect(savedEvent.slug).toBe('vnement-spcial-2024');
    });

    it('should handle very long agenda items', async () => {
      const longAgendaItem = 'a'.repeat(500);
      const event = new Event({
        ...validEventData,
        agenda: [longAgendaItem],
      });
      const savedEvent = await event.save();
      expect(savedEvent.agenda[0]).toBe(longAgendaItem);
    });

    it('should handle multiple events with different data', async () => {
      const event1 = new Event({ ...validEventData, title: 'Event 1' });
      const event2 = new Event({ ...validEventData, title: 'Event 2' });
      const event3 = new Event({ ...validEventData, title: 'Event 3' });

      await event1.save();
      await event2.save();
      await event3.save();

      const count = await Event.countDocuments();
      expect(count).toBe(3);
    });
  });

  describe('Query Operations', () => {
    beforeEach(async () => {
      // Create test events
      await Event.create([
        { ...validEventData, title: 'Online Event', mode: 'online' },
        { ...validEventData, title: 'Offline Event', mode: 'offline' },
        { ...validEventData, title: 'Hybrid Event', mode: 'hybrid' },
      ]);
    });

    it('should find events by mode', async () => {
      const onlineEvents = await Event.find({ mode: 'online' });
      expect(onlineEvents).toHaveLength(1);
      expect(onlineEvents[0].mode).toBe('online');
    });

    it('should find event by slug', async () => {
      const event = await Event.findOne({ slug: 'online-event' });
      expect(event).toBeDefined();
      expect(event!.title).toBe('Online Event');
    });

    it('should update event fields', async () => {
      const event = await Event.findOne({ slug: 'online-event' });
      event!.title = 'Updated Online Event';
      await event!.save();

      const updatedEvent = await Event.findById(event!._id);
      expect(updatedEvent!.title).toBe('Updated Online Event');
    });

    it('should delete event', async () => {
      const event = await Event.findOne({ slug: 'online-event' });
      await Event.deleteOne({ _id: event!._id });

      const deletedEvent = await Event.findById(event!._id);
      expect(deletedEvent).toBeNull();
    });
  });
});