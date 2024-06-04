import Joi from "joi";

const orderNumberSchema = Joi.object({
    _id: Joi.string().required(),
    nexOrderNumber: Joi.number().required()
});

export default orderNumberSchema;