import fs from 'fs/promises';
import { Router } from 'express';
import { orderDB } from '../server.js';

const router = Router();

router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const orders = await orderDB.find({ userId: userId }).sort({ timeStamp: -1 });
        const order = orders[0];

        if (!order) {
            return res.status(404).send({ error: 'No orders found for user' });
        }

        // Parse timestamp till datum och tid delar
        const timeStamp = order.timeStamp;
        const [datePart, timePart] = timeStamp.split(' ');
        const [year, month, day] = datePart.split('-');
        const [hours, minutes] = timePart.split(':');

        // Generera tid för när en order skapas
        const orderPlacedTime = new Date(year, month - 1, day, hours, minutes).getTime();

        // Räkna ut leverenstid eller om levererad
        const now = Date.now();
        const timeElapsed = now - orderPlacedTime;
        const maxDeliveryTime = parseFloat(20 * 60 * 1000); // 20 minutes in milliseconds

        // Check if time values are valid
        if (isNaN(maxDeliveryTime) || isNaN(timeElapsed)) {
            return res.status(500).send({ error: 'Invalid time values' });
        }

        // Determine order status based on time elapsed
        if (timeElapsed > maxDeliveryTime) {
            // Order has been delivered
            return res.send({ status: 'delivered', message: 'Your order has been delivered.' });
        } else {
            // Calculate time left for delivery
            const timeLeft = Math.max(maxDeliveryTime - timeElapsed, 0);
            console.log('timeLeft:', timeLeft);
            return res.send({ status: 'in progress', timeLeft: `${Math.ceil(timeLeft / (60 * 1000))} minutes left for delivery` });
        }

    } catch (error) {
        res.status(500).send({ error: 'An error occurred while retrieving the order' });
    }
});

export default router;

// router.get('/:userId', async (req, res) => {
//     const { userId } = req.params;

//     try {
//         const orders = await orderDB.find({ userId: userId }).sort({ timeStamp: -1 });
//         const order = orders[0];
//         // -1 gör att orders med senaste timeStamp hamnar först.

//         if (!order) {
//             return res.status(404).send({ error: 'No orders found for user' });
//         }

//         //parse till datumobjekt: year-month-day, hours:mins.
//         const timeStamp = order.timeStamp;
//         const [datePart, timePart] = timeStamp.split('-');
//         const [day, month, year] = datePart.split('-');
//         const [hours, minutes] = timePart.split(':');
//         const orderPlacedTime = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00Z`).getTime();

//         const now = Date.now();
//         const timeElapsed = now - orderPlacedTime;
//         const maxDeliveryTime = 20 * 60 * 1000; //20min i millisek.

//         if (timeElapsed > maxDeliveryTime) {
//             // Ordern är levererad
//             return res.send({ status: 'delivered', message: 'Your order has been delivered.' });
//         } else {
//             // tid kvar till leverens avrundade uppåt.
//             const timeLeft = maxDeliveryTime - timeElapsed;
//             return res.send({ status: 'in progress', timeLeft: `${minutesLeft} minutes left for delivery` });
//         };

//         res.json({ order });
//         // return order;

//     } catch (error) {
//         res.status(500).send({ error: 'AN error occurred while retreiving the order' });
//     }
// });

//export default router;