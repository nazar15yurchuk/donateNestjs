import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { EStatus } from '../common/enums';

export const CollectionSchema = new mongoose.Schema(
  {
    _manager_id: { type: Schema.Types.ObjectId, ref: 'Manager' },
    title: { type: String, required: true },
    status: { type: String, required: true, default: EStatus.pending },
    link: { type: String, required: true },
    description: { type: String, required: true },
    sum: { type: String, required: false, min: 0 },
    amountOfViews: { type: Number, required: true, default: 0 },
    image: { type: String, required: false },
  },
  {
    timestamps: true,
  },
);
