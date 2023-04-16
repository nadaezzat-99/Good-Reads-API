import express, {Request, Response , Router,NextFunction} from 'express';
const { categoriesController } = require("../controllers/index");
const { categoriesValidator, paginationOptions  } = require('../Validations');
const { validate } = require('../middlewares/validation');
const { adminAuth } = require('../middlewares/auth');
import { AppError, asycnWrapper, trimText } from '../lib/index';

const router : Router = express.Router();

router.use(adminAuth)

router.post("/",  validate(categoriesValidator.categoryData), async (req: Request, res: Response, next: NextFunction) => {
    const category = categoriesController.create({ name: trimText(req.body.name) });
    const [err, data] = await asycnWrapper(category);
    if (err) return next(err);
    res.status(201).json({ status:'success', data });
  }
  );
  
router.get('/',validate(paginationOptions), async (req: Request, res: Response, next: NextFunction) => {
    const {page, limit } = req.query;    
    const categories = categoriesController.getPaginatedCategories({page, limit });
    const [err, data] = await asycnWrapper(categories);
    if (err) return next(err);
    res.status(200).json({ status:'success', data });
  }
  );
  
router.patch("/:id", validate(categoriesValidator.categoryId), validate(categoriesValidator.categoryData), async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name } = req.body;
    const category = categoriesController.editCategory({ id, name: trimText(name) });
    const [err, data] = await asycnWrapper(category);
    if (err) return next(err);
    if (!data) return next(new AppError (`No Category with ID ${req.params.id}`, 422));
    res.status(200).json({ status:'success', data });
  }
  
  );
  
router.delete("/:id", validate(categoriesValidator.categoryId), async (req: Request, res: Response, next: NextFunction) => {
      const deletedCategory = categoriesController.deleteCategory(req.params.id);
      const [err, data] = await asycnWrapper(deletedCategory);
      if (err) return next(err);
    if (!data) return next(new AppError(`No Category with ID ${req.params.id}`, 422));
      return res.status(200).json({ status:'success', message:'One category is deleted' });
      ;
    }
  );
  
module.exports = router;
  