import express, { Request, Response, Router, NextFunction } from 'express';
const { booksValidator } = require('../Validations');
const { userBooksController } = require('../controllers/index');
const { validate } = require('../middlewares/validation');
const { userAuth } = require('../middlewares/auth');
import { asycnWrapper } from '../lib/index';

const router: Router = express.Router();

router.use(userAuth);

router.get('/books', validate(booksValidator.filter), async (req: Request, res: Response, next: NextFunction) => {
  const { page, limit, shelf } = req.query;
  const user = userBooksController.getUserBooks(req.user._id, { page, limit, shelf });
  const [err, data] = await asycnWrapper(user);
  if (err) return next(err);
  res.status(200).json({ status:'success', data });
});

router.patch('/books/:bookId', validate(booksValidator.updateUserBook), async (req: Request, res: Response, next: NextFunction) => {
  const { bookId } = req.params;
  const { rating, review, shelf } = req.body;  
  try {
    const message = await userBooksController.updateUserBooks({userId: req.user._id, bookId, shelf, review, rating});
    res.status(200).json({ status:'success', message });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;