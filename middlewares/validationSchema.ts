import Joi from "joi";

export interface validationschema  {
    body?: Joi.ObjectSchema;
    params?: Joi.ObjectSchema; 
    query?: Joi.ObjectSchema; 
}

