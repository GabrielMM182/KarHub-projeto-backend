import mongoose, { Document, Schema } from 'mongoose';

export interface IBeer extends Document {
  name: string;
  minTemp: number;
  maxTemp: number;
}

const beerSchema = new Schema<IBeer>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  minTemp: {
    type: Number,
    required: true
  },
  maxTemp: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

export const Beer = mongoose.model<IBeer>('Beer', beerSchema);
