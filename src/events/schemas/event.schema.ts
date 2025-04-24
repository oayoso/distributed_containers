import { Schema } from 'mongoose';

export const EventSchema = new Schema({
  containerId: { type: String, required: true, index: true },
  statusHistory: [
    {
      state: { type: String },
      timestamp: { type: Date },
      source: { type: String },
    },
  ],
});

EventSchema.index({ 'statusHistory.timestamp': -1 });