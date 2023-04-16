import { Schema, model } from 'mongoose';
import { Category, categoryModel, Entities } from '../schemaInterfaces';
import mongoosePaginate from 'mongoose-paginate-v2';
import { AppError } from '../../lib';
const Counters = require('./counter');
const Books = require('./book');

const schema = new Schema<Category>(
  {
    _id: {
      type: Number,
    },
    name: {
      type: String,
      minLength: 3,
      maxLength: 15,
      required: true,
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

schema.plugin(mongoosePaginate);

schema.statics.getNewId = async () => {
  const categoryCounter = await Counters.findOneAndUpdate(
    { id: Entities.CATEGORIIES },
    { $inc: { seq: 1 } },
    { new: true }
  );
  if (!categoryCounter) {
    Counters.create({ id: Entities.CATEGORIIES, seq: 1 });
    return 1;
  }
  return categoryCounter.seq;
};

schema.methods.toJSON = function () {
  const category = this;
  const categorykObject = category.toObject();
  delete categorykObject.__v;
  delete categorykObject.createdAt;
  delete categorykObject.updatedAt;
  return categorykObject;
};

schema.pre('save', async function () {
  if (this.isNew) {
    this._id = await Categoris.getNewId();
  }
});

schema.pre('findOneAndDelete', async function preDelete(next) {
  const categoryId = this.getQuery()['_id'];
  const relatedBooks =  await Books.countDocuments({categoryId:categoryId});
  if (relatedBooks) {
      const err = new AppError("Can't delete category with  books",422);
      next(err);
  } else {
      next();
  }
})

const Categoris = model<Category, categoryModel>('Categories', schema);

module.exports = Categoris;
