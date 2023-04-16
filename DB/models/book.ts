import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { Book, BookModel, Entities } from '../schemaInterfaces';
const Counters = require('./counter');
const UserBooks = require('./userBooks');

const schema = new Schema<Book>(
  {
    _id: {
      type: Number,
    },
    name: {
      type: String,
      minLength: 3,
      maxLength: 30,
      required: true,
      unique: true,
      trim: true,
    },

    categoryId: {
      type: Number,
      required: true,
      ref: 'Categories',
    },
    authorId: {
      type: Number,
      required: true,
      ref: 'Authors',
    },

    bookImage: {
      type: String,
      default: 'https://res.cloudinary.com/dttgbrris/image/upload/v1681003634/3899618_mkmx9b.png',
    },
    description: {
      type: String,
      minlength: 10,
      maxlength: 140,
    },
    ratingsNumber: {
      type: Number,
      default: 0,
    },
    totalRating: {
      type:Number,
      default:0
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Retrieve Book Data Selection
schema.methods.toJSON = function () {
  const book = this;
  const bookObject = book.toObject();
  delete bookObject.__v;
  return bookObject;
};

schema.plugin(mongoosePaginate);

// Get new Incremental ID For Book Document
schema.statics.getNewId = async () => {
  const categoryCounter = await Counters.findOneAndUpdate({ id: Entities.BOOKS }, { $inc: { seq: 1 } }, { new: true });
  if (!categoryCounter) {
    Counters.create({ id: Entities.BOOKS, seq: 1 });
    return 1;
  }
  return categoryCounter.seq;
};

schema.virtual('averageRating').get(function () {
  if (this.ratingsNumber === 0) return 0;
  return Math.floor((this.totalRating / this.ratingsNumber)/5);
});


// Set Incremantal Id pre saving document
schema.pre('save', { document: true, query: true }, async function () {
  if (this.isNew) {
    this._id = await Books.getNewId();
  }
});

schema.post('findOneAndDelete', async function(next) {
  const bookId = this.getQuery()['_id'];
  await UserBooks.deleteMany({book:bookId})  
});

const Books = model<Book, BookModel>('Books', schema);

module.exports = Books;
