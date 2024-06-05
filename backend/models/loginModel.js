import Joi from 'joi'

const loginSchema = Joi.object({
    username: Joi.string().min(5).max(10).alphanum().required(),
    password: Joi.string().min(8).required(),
})

export default loginSchema;