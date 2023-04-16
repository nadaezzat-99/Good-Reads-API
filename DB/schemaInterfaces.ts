import  { Document, Model, ObjectId } from 'mongoose';

enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

enum Shelf {
  READ = 'read',
  READING = 'reading',
  WANT2READ = 'want2read',
}

enum Entities {
  AUTHORS = 0,
  BOOKS = 1,
  CATEGORIIES = 2,
}


interface User {
  _id: ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userName: string;
  pImage?: string;
  role: Role;
}
interface Book extends Document {
  _id: number;
  name: string;
  bookImage: string;
  categoryId: number;
  authorId: number;
  totalRating: number;
  ratingsNumber: number;
  description?: string;
}


interface PaginatedEntity<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  page?: number;
  totalPages: number;
  nextPage?: number | null;
  prevPage?: number | null;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  meta?: any;
}

interface Category extends Document {
  _id: number;
  name: string;
}


interface Counter {
  id: String;
  seq: Number;
}
interface Author {
  _id: Number;
  authorImg?: string;
  firstName: string;
  lastName: string;
  history: string;
  DOB: Date;
  bio: string;
}


interface BookModel extends Model<Book> {
  getNewId: () => Promise<number>;
}

interface categoryModel extends Model<Category> {
  getNewId: () => Promise<number>;
}

interface AuthorModel extends Model<Author> {
  getNewId: () => Promise<number>;
}
interface UserBooks extends Document  {
  book:number,
  user:ObjectId,
  rating:number,
  shelf:Shelf,
  review:string
}

export {
  User,
  Role,
  Entities,
  Counter,
  Author,
  AuthorModel,
  categoryModel,
  BookModel,
  Shelf,
  Category,
  Book,
  PaginatedEntity,
  UserBooks,
};
