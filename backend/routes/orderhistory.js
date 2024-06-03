import { Router } from 'express';
import { orderDB } from '../server.js';

const router = Router();

router.get('/:userId', async (req, res, next) => {
    try {
        const { userId } = req.params;

        const userOrders = await orderDB.find({ userId });

        if (!userOrders.length) {
            return res.status(404).json({ message: 'No orders found for this user' });
        }

        res.status(200).json(userOrders);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

export default router;
