import { Document } from 'mongoose';

export interface IManager extends Document {
  _id?: string;
  username?: string;
  email?: string;
  password?: string;
  role?: string;
}

export interface Payload {
  email: string;
}
