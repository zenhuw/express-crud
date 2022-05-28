import { model, Schema, Document } from 'mongoose';
import { User } from '../interfaces/users.interface';

const userSchema: Schema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },
});

const userModel = model<User & Document>('User', userSchema);

export default userModel;
