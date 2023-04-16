import { AppError } from '../lib/appError';
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


// Configuration 
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: async (req:any, file:any) => {
      switch (file.fieldname) {
        case 'pImage':
          return 'profile-imgs';
        case 'authorImg':
          return 'author-imgs';
        case 'bookImage':
          return 'books-imgs';
        default:
          return `random-imgs`;
      }
    },
    public_id: async (req:any, file:any) => {
      console.log(file.originalname);
      const myFileName = `${Date.now()}-${file.originalname.split('.')[0]}`;
      return myFileName;
    },},
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 0.5, // 500KB
  },
  fileFilter: function (req: any, file: any, cb: any) {
    console.log(file);    
      if (!['png', 'jpg', 'jpeg'].includes(file.mimetype.split('/')[1])) {
        console.log(file.mimetype.split('/')[0]);
        return cb(new AppError('Only images are allowed', 400), null);
      }
      return cb(null, true);
    }
  });


const removeImage =  async(url: string) =>{
  if(url === 'https://res.cloudinary.com/dttgbrris/image/upload/v1681003634/3899618_mkmx9b.png') return;
  cloudinary.uploader.destroy(url,{ resource_type: 'image'})
}



export { upload , removeImage};
