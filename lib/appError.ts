class AppError extends Error {
  status: string;
  isOperational: boolean; 
  constructor( public message:string,public statusCode:number) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = false;
    Error.captureStackTrace(this, this.constructor);
  }
}

interface DuplicateKeyError extends Error {
  code: number;
  keyValue: string[];
}

export{  AppError , DuplicateKeyError};
