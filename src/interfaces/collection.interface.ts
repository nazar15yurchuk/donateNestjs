import { Document } from 'mongoose';

export interface ICollection extends Document {
  _id?: string;
  _manager_id?: string;
  title?: string;
  status?: string;
  link?: string;
  description?: string;
  sum?: number;
  amountOfViews?: number;
  image?: Express.Multer.File;
}
