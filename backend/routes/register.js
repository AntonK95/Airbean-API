import { Router } from 'express';
import userSchema from '../models/userModel.js';
import { database } from '../server.js';
import validate from '../middlewares/validate.js';

const router = Router();

router.post('/', validate(userSchema), async (req, res, next) => {
    try {
        const { error } = userSchema.validate(req.body);
        
        if (error) return res.status(400).send(error.details[0].message);

        const { username, password, email } = req.body;

        const existingUser = await database.findOne({ username });
        if (existingUser) return res.status(400).json({ message: 'Användarnamnet är redan taget' });

        let userId;
        do {
            userId = (Math.floor(1000 + Math.random() * 9000)).toString();
        } while (await database.findOne({ userId }));

        const newUser = await database.insert({ username, password, email, userId });
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

export default router;