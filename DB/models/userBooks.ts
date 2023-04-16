import mongoosePaginate from 'mongoose-paginate-v2';
import mongoose, { Schema, model } from 'mongoose';
import { Shelf, UserBooks } from '../schemaInterfaces';

const schema = new Schema<UserBooks>({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'Users',
  },
  book: {
      type: Number,
      ref: 'Books',
  },
  shelf: {
        type: String,
        enum: Object.values(Shelf),
        default: Shelf.WANT2READ,
      },
  rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 0,
      },
  review: {
        type: String,
      },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

schema.plugin(mongoosePaginate);


const UserBooks = model('UserBooks', schema);
module.exports = UserBooks;
