import Joi from 'joi';

const cartSchema = Joi.array().items(Joi.number().required()).min(1);

export default cartSchema;