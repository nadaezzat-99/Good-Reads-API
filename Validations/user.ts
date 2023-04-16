import Joi from 'joi';

const signUp = {
    body: Joi.object().required().keys({
        firstName: Joi.string()
        .trim()
        .required()
        .regex(/^[a-zA-Z]+$/)
        .min(3)
        .max(15)
        .messages({
            'string.empty': 'First name is a required field',
            'string.min': 'First name must be at least 3 characters',
            'string.max': 'First name must be at most 15 characters',
        }),
        lastName: Joi.string().trim().required().regex(/^[a-zA-Z]+$/).min(3).max(15).required()
        .messages({
            'string.empty': 'Last name is a required field',
            'string.min': 'Last name must be at least 3 characters',
            'string.max': 'Last name must be at most 15 characters',
        }),
        email: Joi.string().email()
        .required()
        .messages({
            'string.empty': 'Email is a required field',
            'string.email': 'Invalid email format',
        }),
        userName: Joi.string().trim().required().regex(/^[a-zA-Z0-9]+$/).min(3).max(30)
        .messages({
            'string.empty': 'User name is a required field',
            'string.min': 'Username must be at least 3 characters',
            'string.max': 'Username must be at most 30 characters',
        }),       
        password: Joi.string().required().min(8).pattern(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]/).messages({
            'string.empty': 'Password is a required field',
            'string.min': 'Password must be at least 8 characters',
            'string.pattern.base': 'Password must contain at least one number , Capital letter and one special character',
        }), 
        confirmPassword:Joi.string()
        .required()
        .valid(Joi.ref('password'))
        .messages({
            "string.empty": 'Confirm Password is required',
            'any.only': 'Confirm password must match password',
        }),
    }),
}

const signIn = {
    body: Joi.object().required().keys({
        userName: Joi.string().trim().required(),
        password: Joi.string().trim().required(),
    }),
};


module.exports = {
    signUp,
    signIn,
};
