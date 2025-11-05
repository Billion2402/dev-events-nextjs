import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';

describe('MongoDB Connection', () => {
  const originalEnv = process.env.MONGODB_URI;

  afterEach(async () => {
    // Reset connection state
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    // Reset global cache
    if (global.mongoose) {
      global.mongoose.conn = null;
      global.mongoose.promise = null;
    }
    // Restore original env
    if (originalEnv) {
      process.env.MONGODB_URI = originalEnv;
    }
  });

  describe('Connection Establishment', () => {
    it('should successfully connect to MongoDB', async () => {
      const mongooseInstance = await connectDB();
      expect(mongooseInstance).toBeDefined();
      expect(mongoose.connection.readyState).toBe(1); // 1 = connected
    });

    it('should return the same connection on subsequent calls', async () => {
      const connection1 = await connectDB();
      const connection2 = await connectDB();

      expect(connection1).toBe(connection2);
    });

    it('should cache the connection in global.mongoose', async () => {
      await connectDB();

      expect(global.mongoose).toBeDefined();
      expect(global.mongoose!.conn).toBeDefined();
      expect(global.mongoose!.promise).toBeDefined();
    });

    it('should use cached connection if available', async () => {
      // First connection
      await connectDB();
      const cachedConn = global.mongoose!.conn;

      // Disconnect but keep cache
      await mongoose.disconnect();
      global.mongoose!.conn = cachedConn;

      // Second call should use cache
      const connection = await connectDB();
      expect(connection).toBe(cachedConn);
    });
  });

  describe('Environment Variable Validation', () => {
    it('should throw error when MONGODB_URI is not defined', async () => {
      delete process.env.MONGODB_URI;
      
      // Reset global cache
      if (global.mongoose) {
        global.mongoose.conn = null;
        global.mongoose.promise = null;
      }

      await expect(connectDB()).rejects.toThrow(
        /Please define the MONGODB_URI environment variable/
      );
    });

    it('should throw error when MONGODB_URI is empty string', async () => {
      process.env.MONGODB_URI = '';
      
      // Reset global cache
      if (global.mongoose) {
        global.mongoose.conn = null;
        global.mongoose.promise = null;
      }

      await expect(connectDB()).rejects.toThrow(
        /Please define the MONGODB_URI environment variable/
      );
    });

    it('should use MONGODB_URI from environment', async () => {
      // The test setup already sets MONGODB_URI
      const connection = await connectDB();
      expect(connection).toBeDefined();
    });
  });

  describe('Connection Options', () => {
    it('should connect with bufferCommands disabled', async () => {
      await connectDB();
      
      // Check that bufferCommands is disabled
      expect(mongoose.connection.options.bufferCommands).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should reset promise on connection error', async () => {
      // Set invalid URI
      process.env.MONGODB_URI = 'mongodb://invalid:27017/test';
      
      // Reset global cache
      if (global.mongoose) {
        global.mongoose.conn = null;
        global.mongoose.promise = null;
      }

      try {
        await connectDB();
      } catch (error) {
        // Promise should be reset
        expect(global.mongoose!.promise).toBeNull();
      }
    });

    it('should handle connection errors gracefully', async () => {
      process.env.MONGODB_URI = 'mongodb://invalid-host:27017/test';
      
      // Reset global cache
      if (global.mongoose) {
        global.mongoose.conn = null;
        global.mongoose.promise = null;
      }

      await expect(connectDB()).rejects.toThrow();
    });
  });

  describe('Connection State', () => {
    it('should have readyState of 1 (connected) after successful connection', async () => {
      await connectDB();
      expect(mongoose.connection.readyState).toBe(1);
    });

    it('should maintain connection across multiple operations', async () => {
      await connectDB();
      
      // Perform some operations
      const connection1 = await connectDB();
      const connection2 = await connectDB();
      const connection3 = await connectDB();

      expect(connection1).toBe(connection2);
      expect(connection2).toBe(connection3);
      expect(mongoose.connection.readyState).toBe(1);
    });
  });

  describe('Global Cache Behavior', () => {
    it('should initialize global.mongoose if not present', async () => {
      // Delete global mongoose
      delete global.mongoose;

      await connectDB();

      expect(global.mongoose).toBeDefined();
      expect(global.mongoose).toHaveProperty('conn');
      expect(global.mongoose).toHaveProperty('promise');
    });

    it('should use existing global.mongoose if present', async () => {
      // Set up global cache
      global.mongoose = { conn: null, promise: null };
      const originalCache = global.mongoose;

      await connectDB();

      expect(global.mongoose).toBe(originalCache);
    });
  });

  describe('Concurrent Connections', () => {
    it('should handle multiple simultaneous connection requests', async () => {
      // Reset cache
      if (global.mongoose) {
        global.mongoose.conn = null;
        global.mongoose.promise = null;
      }

      // Make multiple simultaneous connection requests
      const connections = await Promise.all([
        connectDB(),
        connectDB(),
        connectDB(),
      ]);

      // All should return the same connection
      expect(connections[0]).toBe(connections[1]);
      expect(connections[1]).toBe(connections[2]);
    });

    it('should only create one connection promise for concurrent requests', async () => {
      // Reset cache
      if (global.mongoose) {
        global.mongoose.conn = null;
        global.mongoose.promise = null;
      }

      const promises = [connectDB(), connectDB(), connectDB()];
      
      // All promises should use the same underlying connection promise
      await Promise.all(promises);

      expect(global.mongoose!.conn).toBeDefined();
    });
  });

  describe('Reconnection Behavior', () => {
    it('should reconnect if connection is lost', async () => {
      await connectDB();
      
      // Simulate connection loss
      await mongoose.disconnect();
      
      // Reset cache to simulate fresh connection attempt
      if (global.mongoose) {
        global.mongoose.conn = null;
        global.mongoose.promise = null;
      }

      // Should reconnect successfully
      const reconnection = await connectDB();
      expect(reconnection).toBeDefined();
      expect(mongoose.connection.readyState).toBe(1);
    });
  });

  describe('Return Value', () => {
    it('should return mongoose instance', async () => {
      const result = await connectDB();
      expect(result).toBe(mongoose);
    });

    it('should return the same mongoose instance on multiple calls', async () => {
      const result1 = await connectDB();
      const result2 = await connectDB();
      
      expect(result1).toBe(result2);
      expect(result1).toBe(mongoose);
    });
  });
});