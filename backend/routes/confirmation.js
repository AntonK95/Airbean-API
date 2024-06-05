import fs from 'fs/promises';
import { Router } from 'express';
import { orderDB } from '../server.js';
import { applyDiscount } from '../utilities/discount.js';

const router = Router();

const guestUserId = 'guest';

router.get('/:userId', async (req, res) => {
    try {
        let { userId } = req.params;

        if (userId === 'guest') {
            userId = guestUserId;
        }

        const orders = await orderDB.find({ userId: userId }).sort({ timeStamp: -1 });
        const order = orders[0];

        if (!order) {
            return res.status(404).send({ error: 'No orders found for user' });
        }

        // Parse timestamp into date and time parts
        const timeStamp = order.timeStamp;
        const [datePart, timePart] = timeStamp.split(' ');
        const [year, month, day] = datePart.split('-');
        const [hours, minutes] = timePart.split(':');

        // Generate time for when the order was placed
        const orderPlacedTime = new Date(year, month - 1, day, hours, minutes).getTime();

        // Calculate delivery time or if delivered
        const now = Date.now();
        const timeElapsed = now - orderPlacedTime;
        const maxDeliveryTime = parseFloat(20 * 60 * 1000); // 20 minutes in milliseconds

        // Check if time values are valid
        if (isNaN(maxDeliveryTime) || isNaN(timeElapsed)) {
            return res.status(500).send({ error: 'Invalid time values' });
        }

        // Determine order status based on time elapsed
        let orderStatus;
        let timeLeft = 0;
        if (timeElapsed > maxDeliveryTime) {
            // Order has been delivered
            orderStatus = 'delivered';
        } else {
            // Calculate time left for delivery
            timeLeft = Math.max(maxDeliveryTime - timeElapsed, 0);
            orderStatus = 'in progress';
        }

        // Calculate the discounted total
        const discountedTotal = applyDiscount(order.total, userId, guestUserId);

        // Prepare response
        const response = {
            status: orderStatus,
            total: order.total,
            discountedTotal: discountedTotal,
            message: orderStatus === 'delivered' ? 'Your order has been delivered.' : `Your order is in progress. ${Math.ceil(timeLeft / (60 * 1000))} minutes left for delivery`,
            timeLeft: orderStatus === 'in progress' ? `${Math.ceil(timeLeft / (60 * 1000))} minutes` : undefined
        };

        return res.send(response);

    } catch (error) {
        res.status(500).send({ error: 'An error occurred while retrieving the order' });
    }
});

export default router;
