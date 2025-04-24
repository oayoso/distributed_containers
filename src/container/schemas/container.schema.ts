import { Schema } from 'mongoose';

export const ContainerSchema = new Schema({
  containerId: { type: String, required: true },
  timestamp: { type: Date, required: true, index: true },
  state: { type: String, required: true },
});