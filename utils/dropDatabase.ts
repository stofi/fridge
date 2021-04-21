import mongoose from 'mongoose';
import app from '../src/app';

async function run() {
  await mongoose.connect(app.get('mongodb'), { useNewUrlParser: true });
  await mongoose.connection.dropDatabase();
  return mongoose.connection.close();
}

run();
