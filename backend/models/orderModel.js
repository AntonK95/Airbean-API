import Joi from 'joi';

const orderSchema = Joi.array().items(Joi.number().required()).min(1);

export default orderSchema;