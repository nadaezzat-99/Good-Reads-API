import { ObjectId } from "mongoose";
import { Book, Category,  PaginatedEntity } from "../DB/schemaInterfaces";
import { AppError } from "../lib";

const Categories = require("../DB/models/category");
const Books = require("../DB/models/book");

const create = (data: Category) => Categories.create(data);

const getCategories = () =>
  Categories.find({}).select("-createdAt -updatedAt -__v");

const getPaginatedCategories = async (options: {
  page: number;
  limit: number;
}): Promise<PaginatedEntity<Category>> => {
  if (!options.limit) options.limit = 10;
  if (!options.page) options.page = 1;
  const result = (await Categories.paginate(
    {},
    options
  )) as PaginatedEntity<Category>;
  return result as PaginatedEntity<Category>;
};

const editCategory = (data: { id: number; name: string }) =>
  Categories.findByIdAndUpdate(data.id, { name: data.name }, { new: true });

const deleteCategory = (id: ObjectId) => Categories.findByIdAndDelete(id);

const getCategoyBooks = async (
  id: number,
  options: { page: number; limit: number }
) => {
  const category = await Categories.findById(id);
  if (!category) throw new AppError(`No book with ID ${id}`, 400);
  if (!options.limit) options.limit = 10;
  if (!options.page) options.page = 1;
  const categoryBooks = (await Books.paginate(
    { categoryId: id },
    { ...options, populate: "authorId" }
  )) as PaginatedEntity<Book>;
  return categoryBooks as PaginatedEntity<Book>;
};

const getPopularcategories = async () =>
  await Books.aggregate([
    {
      $match: {
        ratingsNumber: { $gt: 0 },
      }},
    {
      $addFields: {
        popularity: {
          $add: [
            {
              $multiply: [
                {$divide: [{ $divide: ["$totalRating", "$ratingsNumber"] }, 5]}, 0.7]},
            {
              $multiply: ["$ratingsNumber", 0.3],
            }]}}},
    {
      $group: {
        _id: "$categoryId",
        booksPopularity: { $sum: "$popularity" },
        booksNumber: { $sum: 1 },
      },
    },
    {
      $sort: { booksPopularity: -1, booksNumber: -1 },
    },
    {
      $limit: 4,
    },
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: "$category",
    },
    {
      $project: {
        _id: 0,
        "category.name": 1,
        "category._id": 1,
        booksPopularity: 1,
        booksNumber: 1,
      },
    },
  ]);


module.exports = {
  create,
  getCategories,
  getPaginatedCategories,
  editCategory,
  deleteCategory,
  getCategoyBooks,
  getPopularcategories,
};
