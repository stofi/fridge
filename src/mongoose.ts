import mongoose from 'mongoose';
import { Application } from './declarations';
import logger from './logger';

export default function (app: Application): void {
  mongoose
    .connect(app.get('mongodb'), {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: process.env.NODE_ENV !== 'test',
    })
    .catch((err) => {
      logger.error(err);
      process.exit(1);
    });

  app.set('mongooseClient', mongoose);
}
