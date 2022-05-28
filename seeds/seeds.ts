import config from 'config';
import mongoose from 'mongoose';
import userModel from '../src/models/users.model';

mongoose.connect(config.get('mongodbUrl')).then();

const seedUsers = [
  {
    name: 'Reza Aulia',
    email: 'user1@gmail.com',
    password: '$2b$10$ym8FYyhmcrSbEWESyb2LWe8YC8Qc6D528xnTa07FUaF6BQQ8V.Q5W',
    isAdmin: true,
  },
  {
    name: 'Bagus',
    email: 'user2@gmail.com',
    password: '$2b$10$Vte3PwydZPEKd.YnAZsjX.TpJwdcrOctPKrWUP.9Ocj66llDEa/Sq',
    isAdmin: false,
  },
];

const seedDb = async () => {
  await userModel.deleteMany({});
  await userModel.insertMany(seedUsers);
};

seedDb().then(() => {
  mongoose.connection.close();
  console.log('Seed Success');
});
