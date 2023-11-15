import * as mongoose from 'mongoose';

import { ERole } from '../common';

export const ManagerSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: ERole.manager },
  },
  {
    timestamps: true,
  },
);
