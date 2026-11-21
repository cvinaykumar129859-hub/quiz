import mongoose from 'mongoose';

export async function connectDatabase(): Promise<void> {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) throw new Error('MONGODB_URI (or MONGO_URI) is required');
  await mongoose.connect(uri, { dbName: 'quizmaster_db' });
  console.log('Connected to MongoDB database quizmaster_db');
}
