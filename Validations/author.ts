import Joi from 'joi';

const validateAuthor = {
    body: Joi.object().required().keys({
        firstName: Joi.string()
        .regex(/^[a-zA-Z]+$/)
        .required()
        .min(3)
        .max(15)
        .messages({
            'string.empty': 'First name is a required field',
            'string.min': 'First name must be at least 3 characters',
            'string.max': 'First name must be at most 15 characters',
        }),
        lastName: Joi.string()
        .regex(/^[a-zA-Z]+$/)
        .required()
        .min(3)
        .max(15)
        .messages({
            'string.empty': 'Last name is a required field',
            'string.min': 'Last name must be at least 3 characters',
            'string.max': 'Last name must be at most 15 characters',
        }),
        bio: Joi.string()
        .required()
        .trim()
        .min(30)
        .max(300)
        .messages({
            'string.min': 'Author bio must be at least 30 characters',
            'string.max': 'Author bio must be at most 300 characters',
        }),
        DOB: Joi.date()
        .required()
        .messages({
          'date.base': 'Date of Birth is a required field',
          'date.format': 'Date of Birth must be a valid date',
          'date.custom': 'Date of birth is invalid, Author Birth date year must be less than 2010'
        })
        .custom((value:Date) => {
          if (new Date(value).getFullYear() > 2010) {
            console.log(new Date(value));
            
            throw new Error('Date of birth is invalid, Author Birth date year must be less than or equal 2010');
          }
          return true;
        })
      }), 
    };

  const checkvalidID = {
    params: Joi.object().keys({
        id: Joi.number().integer().min(1).required(),
    })
};



module.exports = {
  validateAuthor,
  checkvalidID,
}
