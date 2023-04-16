import express, { Application, NextFunction, Request, Response } from 'express';
import { AppError } from './lib';

const { handleResponseError } = require('./lib/handlingErrors');
const app: Application = express();
const cors = require('cors');

const cookieParser = require("cookie-parser");
const routes = require('./routes/index.ts');
require('./DB/connects');

const corsOptions = {
  origin: "https://bookary.netlify.app",
  credentials:true
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/',routes);

app.all('*', (req:Request, res:Response, next:NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(handleResponseError);

module.exports = app;
