
import { User } from '../../DB/models/user';
import multer from 'multer';

declare global{
    namespace Express {
        interface Request {
            user?: User
            file?:multer.File
        }
    }
}

