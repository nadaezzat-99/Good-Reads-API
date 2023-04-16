const Authors = require("../DB/models/author");
const Books = require("../DB/models/book");
import { Author, PaginatedEntity, Book } from "../DB/schemaInterfaces";

const createAuthor = (data: Author) => Authors.create(data);

const getAuthors = (options: { limit: number; page: number }): Author => {
  if (!options.limit) options.limit = 5;
  if (!options.page) options.page = 1;
  return Authors.paginate({}, options);
};

const updateAuthor = (id: number, data: Author) =>
  Authors.findOneAndUpdate({ _id: id }, data, { new: true });

const deleteAuthor = (id: number) => Authors.findOneAndDelete({ _id: id });

const authorBooks = ( id: number, page: number, limit: number ): PaginatedEntity<Book> => {
  const selection = "name bookImage ratingsNumber averageRating";
  if (!limit) limit = 3;
  if (!page) page = 1;
  return Books.paginate(
    { authorId: id },
    { limit, page, select: selection }
  ) as PaginatedEntity<Book>;
};


const getPopularAuthors = async () =>
  await Books.aggregate([
    {
      $match: {
        ratingsNumber: { $gt: 0 },
      },
    },
    {
      $addFields: {
        popularity: {
          $add: [
            {
              $multiply: [
                {
                  $divide: [{ $divide: ["$totalRating", "$ratingsNumber"] }, 5],
                },
                0.7,
              ],
            },
            {
              $multiply: ["$ratingsNumber", 0.3],
            },
          ],
        },
      },
    },
    {
      $group: {
        _id: "$authorId",
        booksPopularity: { $sum: "$popularity" },
        booksNumber: { $sum: 1 },
      },
    },
    {
      $sort: { booksPopularity: -1, booksNumber: -1 },
    },
    {
      $limit: 5,
    },
    {
      $lookup: {
        from: "authors",
        localField: "_id",
        foreignField: "_id",
        as: "author",
      },
    },
    {
      $unwind:'$author'
    },
   {
      $project: {
        _id: 0,
        "author.createdAt": 0,
        "author.updatedAt": 0,
        "author.DOB": 0,
        "author.__v": 0
      },
   },
  ]);

module.exports = {
  createAuthor,
  getAuthors,
  updateAuthor,
  deleteAuthor,
  authorBooks,
  getPopularAuthors,
};
