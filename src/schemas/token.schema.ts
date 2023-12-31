import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const TokenSchema = new mongoose.Schema(
  {
    _manager_id: { type: Schema.Types.ObjectId, ref: 'Manager' },
    access_token: { type: String },
    refresh_token: { type: String },
  },
  {
    timestamps: true,
  },
);
