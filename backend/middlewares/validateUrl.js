import Joi from 'joi';

// Validerar params i URL mot schema
export const validateUrl = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.params);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const urlSchema = Joi.object({
    userId: Joi.string().required(),
    id: Joi.number().integer().required(),
});

export { urlSchema };