
import express, {Request, Response , Router,NextFunction} from 'express';
import { AppError, asycnWrapper } from '../lib/index';
const { authorController } = require("../controllers/index")
const { validate } = require('../middlewares/validation');
const { authorValidator , paginationOptions } = require('../Validations');
const Authors = require('../DB/models/author')


const router : Router = express.Router();

// get all authors
 router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const { query: { limit, page }} = req;
  const authors = authorController.getAuthors({ page, limit });
  const [err, data] = await asycnWrapper(authors);
  if (err) return next(err);
  res.status(200).send({ status:'success', data });
});

// get Popular authors
router.get('/popular', async (req: Request, res: Response, next: NextFunction) => {
  const authors = authorController.getPopularAuthors();
  const [err, data] = await asycnWrapper(authors);
  if (err) return next(err);
  res.status(200).send({ status:'success', data });
});

// get Author Books
router.get('/:id', validate(authorValidator.checkvalidID), validate(paginationOptions), async (req: Request, res: Response, next: NextFunction) => {
    const { params: { id }} = req;
    const { query: { page, limit }} = req;
    const author = await Authors.findOne({ _id: id }).select('firstName lastName authorImg bio').lean();
    if (!author) return next( new AppError (`No Author with ID ${id}`, 422)); 
    const authorBooks = authorController.authorBooks(id, page, limit);
    let [err, data] = await asycnWrapper(authorBooks);
    if (err) return next(err);
    res.status(200).send({ status:'success', data });
  });
 
module.exports = router;