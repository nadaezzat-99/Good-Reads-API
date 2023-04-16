import express, { Request, Response, Router, NextFunction } from 'express';
const { booksController } = require('../controllers/index');
const { booksValidator, paginationOptions } = require('../Validations');
const { validate } = require('../middlewares/validation');
const { adminAuth } = require('../middlewares/auth');
import { AppError, asycnWrapper, trimText } from '../lib/index';
import { upload, removeImage } from '../middlewares/imageMiddleware';

const router: Router = express.Router();

router.use(adminAuth)

router.post('/', upload.single('bookImage'), validate(booksValidator.bookData), async (req: Request, res: Response, next: NextFunction) => {
    let bookImage = req.file? req.file.path : undefined
    const { name, categoryId, authorId, description } = req.body;
    const book = booksController.create({ name: trimText(name), categoryId, authorId, bookImage,  description });
    const [err, data] = await asycnWrapper(book);
    if (err) return next(err);
    res.status(201).json({ status:'success', data });
  }
);

router.get('/', validate(paginationOptions), async (req: Request, res: Response, next: NextFunction) => {
    const {page, limit } = req.query; 
    const books = booksController.getPaginatedBooks({ page, limit });
    const [err, data] = await asycnWrapper(books);
    if (err) return next(err);
    res.status(200).json({ status:'success', data });
  }
);

router.patch('/:id', upload.single('bookImage'), validate(booksValidator.bookId), validate(booksValidator.bookEdit), async (req: Request, res: Response, next: NextFunction) => {
  const { name, categoryId, authorId, description } = req.body;
  let bookImage = req.file? req.file.path : undefined
  const book = booksController.editBook(req.params.id, { name, bookImage, categoryId, authorId, description });
  const [err, data] = await asycnWrapper(book);
  if (err) return next(err);
  if (!data) return next(new AppError(`No book with ID ${req.params.id}`, 400));
  res.status(200).json({ status:'success', data });
});


router.delete('/:id', validate(booksValidator.bookId), async (req: Request, res: Response, next: NextFunction) => {
    const deletedBook = booksController.deleteBook(req.params.id);
    const [err, data] = await asycnWrapper(deletedBook);
    if (err) return next(err);
    if (!data) return next(new AppError(`No book with ID ${req.params.id}`, 400));
    removeImage(data.bookImage);
    return res.status(200).json({ status:'success', message:'One Book is deleted' });
  }
);

module.exports = router;
