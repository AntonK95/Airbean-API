import { Router } from 'express';
import loginSchema from '../models/loginModel.js';
import { database } from '../server.js';
import validate from '../middlewares/validate.js';

const router = Router();

router.post('/', validate(loginSchema), async (req, res, next) => {
    try {
        const { error } = loginSchema.validate(req.body);
        
        if (error) return res.status(400).send(error.details[0].message);

        const { username, password } = req.body;

        const existingUser = await database.findOne({ username, password });
        if (!existingUser) return res.status(400).json({ message: 'Felaktig inlognings information' });

        res.status(200).json({ message: `Du är inloggad!` });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

export default router;