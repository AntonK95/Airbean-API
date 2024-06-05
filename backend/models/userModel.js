import Joi from 'joi'

const userSchema = Joi.object({
    username: Joi.string().min(5).max(10).alphanum().required(),
    password: Joi.string().min(8).required(),
    email: Joi.string().email().required()
})

export default userSchema;