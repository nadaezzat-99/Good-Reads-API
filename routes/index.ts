import express, { Router} from 'express';

const adminRoute = require("./admin");
const bookRoute = require("./book");
const CategoryRoute = require("./category");
const authorRoute = require("./author");
const userBooksRoute = require("./userBooks");
const userRoutes = require("./users");


const router: Router = express.Router();


router.use("/", userRoutes);
router.use("/admin", adminRoute);
router.use("/books", bookRoute);
router.use("/authors", authorRoute);
router.use("/categories", CategoryRoute);
router.use("/user", userBooksRoute);


module.exports = router;

