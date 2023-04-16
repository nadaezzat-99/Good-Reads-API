import express, { Router} from 'express';

const bookRoute = require("./admin_books");
const categoryRoute = require("./admin_category");
const authorRoute = require("./admin_authors");

const router : Router = express.Router();

router.use('/books', bookRoute);
router.use('/categories', categoryRoute);
router.use('/authors', authorRoute);

module.exports = router;