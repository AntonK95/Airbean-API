import fs from 'fs/promises';
import { Router } from 'express';
import { orderDB } from '../server.js';

const router = Router();

router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const orders = await orderDB.find({ userId: userId }).sort({ timeStamp: -1 }).limit(1);
        const order = orders[0];

        if (!order) {
            return res.status(404).send({ error: 'No orders found for user' });
        }

        //parse till datumobjekt
        const timeStamp = order.timeStamp;
        const [datePart, timePart] = timeStamp.split('');
        const [day, month, year] = datePart.split('-');
        const [hours, minutes] = timePart.split(':');
        const orderPlacedTime = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00Z`).getTime();

        const now = Date.now();
        const timeElapsed = now - orderPlacedTime;
        const maxDeliveryTime = 20 * 60 * 1000; //20min i millisek.

        if (timeElapsed > maxDeliveryTime) {
            return res.send({ status: 'in progress', timeLeft: `${Math.ceil(timeLeft / 1000 / 60)} minutes left for delivery` });
        }

    } catch (error) {
        res.status(500).send({ error: 'AN error occurred while retreiving the order' });
    }
});

export default router;