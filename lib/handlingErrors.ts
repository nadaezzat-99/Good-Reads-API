import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { AppError, DuplicateKeyError } from './appError';
import { error } from 'console';

const handleMogooseValidationError = (err: mongoose.Error.ValidationError | DuplicateKeyError) => {
  if (err instanceof mongoose.Error.ValidationError)
    return new AppError(`${Object.keys(err.errors).join(' ')} is not valid `, 422);
  return new AppError(` Value of field ${Object.keys(err.keyValue)[0]} is Duplicated please choose another one`, 422);
};

export const handleResponseError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
     err = new AppError('Unexpected file uploaded',400)
  }
  if (err instanceof mongoose.Error.ValidationError || err.code === 11000) {
    err = handleMogooseValidationError(err);
  }
  err.status = err.status || 'failed';
  err.statusCode = err.statusCode || 500;
  res.status(err.statusCode).json({ message: err.message, status: err.status });
};
