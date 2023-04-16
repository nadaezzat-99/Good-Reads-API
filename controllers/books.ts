import { Book, PaginatedEntity} from "../DB/schemaInterfaces";
import { AppError, trimText } from "../lib";

const Books = require("../DB/models/book");
const Categoris = require("../DB/models/category");
const Authors = require("../DB/models/author");
const UserBooks = require("../DB/models/userBooks");

const getBooks = () => Books.find({});

// Admin Panel
const create = async (data: Book) => {
  const relatedCategory = await Categoris.findById(data.categoryId);
  const relatedAuthor = await Authors.findById(data.authorId);
  if (!(relatedAuthor && relatedCategory))
    throw new AppError("Category or Author isn't valid", 422);
  if (data.bookImage) console.log(data.bookImage);
  return Books.create(data);
};

const getBookById = (_id: number) => Books.findById(_id);

const editBook = async (
  id: number,
  data: {
    name: string;
    bookImage: string;
    categoryId: number;
    authorId: number;
    description: string;
  }
) => {
  const book = await Books.findById(id);
  if (!book) throw new AppError(" Book doesn't exist ", 422);
  if (data.authorId) {
    const relatedAuthor = await Authors.findById(data.authorId);
    if (!relatedAuthor) throw new AppError(" Author isn't valid", 422);
  }
  if (data.categoryId) {
    const relatedCategory = await Categoris.findById(data.categoryId);
    if (!relatedCategory) throw new AppError("Category isn't valid", 422);
  }
  if (data.name) data.name = trimText(data.name);
  return Books.findByIdAndUpdate(id, { ...data }, { new: true });
};

const deleteBook = (id: number) => Books.findByIdAndDelete(id);


// Users View --->  Get Book with full data Info (Author name - Category name)
const getBookById_fullInfo = async (id: number) => {
  const book = await Books.findById(id)
    .populate({ path: "authorId", select: "firstName lastName" })
    .populate({ path: "categoryId", select: "name" })
    .select(" -createdAt -updatedAt -totalRating")
    .exec();

  const reviews = await UserBooks.find({ book: id })
    .populate({ path: "user", select: "firstName lastName userName  " })
    .select("review rating firstName lastName userName  ");
  return { book, reviews };
};

const getBooks_fullInfo = async (options: { page: number; limit: number, keyWord?:string }) => {
  if (!options.limit) options.limit = 10;
  if (!options.page) options.page = 1;
  let filter = {};
  if(options.keyWord) filter ={ name: { $regex: options.keyWord, $options: 'i' } } 
  const result = (await Books.paginate(
    filter,
    {
      ...options,
      populate: [{ path: 'authorId', select: 'firstName lastName' }, { path: 'categoryId', select: 'name' }],
      select: "name bookImage ratingsNumber totalRating  averageRating",
    }
  )) as PaginatedEntity<Book>;
  return result as PaginatedEntity<Book>;
};


const getPaginatedBooks = async (options: {
  page: number;
  limit: number;
}): Promise<PaginatedEntity<Book>> => {
  if (!options.limit) options.limit = 10;
  if (!options.page) options.page = 1;
  const result = (await Books.paginate({}, options)) as PaginatedEntity<Book>;
  return result as PaginatedEntity<Book>;
};

const getPopularBooks = async () =>
  await Books.aggregate([
    {
      $match: {
        ratingsNumber: { $gt: 0 },
      },
    },
    {
      $project: {
        name: 1,
        bookImage: 1,
        description: 1,
        popularity: {
          $add: [
            {
              $multiply: [
                {
                  $divide: [{ $divide: ["$totalRating", "$ratingsNumber"] }, 5]},0.7]},
            {
              $multiply: ["$ratingsNumber", 0.3],
            }]}}},
    {
      $sort: { popularity: -1 },
    },

    {
      $limit: 4,
    },
  ]);

module.exports = {
  create,
  getBooks,
  getBookById,
  getBooks_fullInfo,
  getBookById_fullInfo,
  editBook,
  deleteBook,
  getPaginatedBooks,
  getPopularBooks,
};
