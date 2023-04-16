import express, { Request, Response, Router, NextFunction } from 'express';
import { asycnWrapper } from '../lib/index';

const { userController } = require('../controllers/index');
const { upload } = require('../middlewares/imageMiddleware');
const { usersValidator } = require('../Validations');
const { validate } = require('../middlewares/validation');


const router: Router = express.Router();

router.post('/register', upload.single('pImage'), validate(usersValidator.signUp), async (req: any, res: Response, next: NextFunction) => {
    const pImage = req.file? req.file.path: undefined;
    const { body: { firstName, lastName, userName, email, password, role }} = req;
    const user = userController.create({ firstName, lastName, userName, email, password, pImage, role });
    const [err, data] = await asycnWrapper(user);
    if (err) return next(err);
    res.status(200).json({ status:'success', data });
  });


router.post('/signin', validate(usersValidator.signIn), async (req: Request, res: Response, next: NextFunction) => {  
  try {
    const { userName, password } = req.body;    
    const data = await userController.signIn({ userName, password });    
    res.status(200).json({status:'success', data })
  } catch (err) {
    next(err);
  }
});

router.get("/logout", async(req:Request, res:Response) => res.clearCookie("access_token").status(204).end());

module.exports = router;

