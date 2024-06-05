import Joi from 'joi';
// import productSchema from './productModel.js';

const orderSchema = Joi.object({
    userId: Joi.string().required(),
    orderNumber: Joi.number().required(),
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

// I detta stycke så tar vi emot productSchema för att använda en separas Schema model som ligger i productModel.js. 
// Tyvärr får jag det inte att fungera.. Fungerande/alternativ lösning ovan
// const orderSchema = Joi.object({
//     userId: Joi.string().required(),
//     total: Joi.number().required(),
//     items: Joi.array().items(productSchema
//     ).required()
// });

export default orderSchema;