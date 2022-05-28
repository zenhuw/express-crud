import  config  from 'config';
import { connect } from 'mongoose';

export function connectDB() {
  const db: string = config.get('mongodbUrl');
  connect(db)
    .then(() => {
      console.info('connected to database');
    })
    .catch(error => {
      console.error("can't connect to database reason %s", error);
    });
}
