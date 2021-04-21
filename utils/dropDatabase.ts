import mongoose from 'mongoose';
import app from '../src/app';

async function run() {
  await mongoose.connect(app.get('mongodb'), {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });
  console.log('Dropping the database');
  await mongoose.connection.dropDatabase();
  console.log('Done');
  return await mongoose.connection.close();
}

run();
