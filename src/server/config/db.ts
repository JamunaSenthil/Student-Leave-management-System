import mongoose from 'mongoose';

let mongoMemoryServerInstance: any = null;

export const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;

    if (!mongoUri || mongoUri.trim() === '') {
      console.log('No external MONGODB_URI provided. Initializing in-memory MongoDB engine...');
      // Dynamically import MongoMemoryServer so it's only loaded when needed
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongoMemoryServerInstance = await MongoMemoryServer.create({
        instance: {
          dbName: 'campus_slms',
        },
      });
      mongoUri = mongoMemoryServerInstance.getUri();
      console.log(`Embedded MongoDB server running at: ${mongoUri}`);
    }

    if (!mongoUri) {
      throw new Error('Failed to determine MongoDB connection URI.');
    }

    await mongoose.connect(mongoUri, {
      autoIndex: true,
    });

    console.log(`MongoDB Connected successfully to: ${mongoose.connection.host || 'local'}/${mongoose.connection.name}`);
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export const closeDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoMemoryServerInstance) {
      await mongoMemoryServerInstance.stop();
    }
    console.log('MongoDB connection closed.');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
  }
};
