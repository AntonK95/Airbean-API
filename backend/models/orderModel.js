import Joi from 'joi';
// import productSchema from './productModel.js';

const orderSchema = Joi.object({
    userId: Joi.string().required(),
    total: Joi.number().required(),
    timeStamp: Joi.string().required(),
    items: Joi.array().items(
        Joi.object({
            productId: Joi.string().required(),
            title: Joi.string().required(),
            desc: Joi.string().required(),
            price: Joi.number().required(),
            quantity: Joi.number().required(),
        })
    ).required()
});

// const orderSchema = Joi.object({
//     userId: Joi.string().required(),
//     total: Joi.number().required(),
//     items: Joi.array().items(productSchema
//     ).required()
// });

export default orderSchema;