import Joi from 'joi'

const updateUserSchema = Joi.object({
    _id: Joi.string().required(),
    username: Joi.string().min(5).max(10).alphanum().optional(),
    password: Joi.string().min(8).optional(),
    email: Joi.string().email().optional()
})

export default updateUserSchema;