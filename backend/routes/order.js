import { Router } from "express";
import orderSchema from "../models/orderModel.js";
import { db, orderNumberDB } from "../server.js";
import { orderDB } from "../server.js";
import getTimeStamp from "../utilities/timeStamp.js";

const guestUserId = 'guest';

const router = Router();

router.post('/create/:userId', async (req, res, next) => {
    try {

        let { userId } = req.params;

        if (userId === 'guest') {
            userId = guestUserId;
        }

        // Hämta varukorg för användare
        const cartItems = await db.find({ userId });

        if (!cartItems.length) {
            return res.status(400).json({ message: 'Cart is empty' });
        }


        const items = cartItems.map(item => ({
            productId: item._id,
            title: item.title,
            desc: item.desc,
            price: item.price,
            quantity: item.quantity ? Number(item.quantity) : 1
        }));
        
        const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        
        // Logga inkommande begäran för debug
        console.log('Incoming request body order.js:', req.body);
        console.log('items:', items);
        console.log('total:', total);

        async function getNextOrderNumber() {
            try {
                const updatedDoc = await orderNumberDB.update({}, { $inc: { getNextOrderNumber: 1 } }, { returnUpdatedDocs: true });
            
                if(updatedDoc) {
                    return updatedDoc.getNextOrderNumber;

                } else {
                    const newDoc = { getNextOrderNumber: 1 };
                    await orderNumberDB.insert(newDoc);
                    return newDoc.getNextOrderNumber;
                }
            
            } catch(error) {
                console.log(err, 'Error fetching next order number');
            }
        };
        
        const orderNumber = await getNextOrderNumber();

        // Skapa en ny order med data från förfrågan
        const newOrder = {
            userId,
            items,
            timeStamp: getTimeStamp(),
            total,
            orderNumber
        };

        // Här validerar vi newOrder efter att ha skapat objektet
        const { error } = orderSchema.validate(newOrder);
        if (error) {
            console.log('Validation error', error.details[0].message);
            return res.status(400).send(error.details[0].message);
        }

        // Infoga den nya ordern i databasen
        const createdOrder = await orderDB.insert(newOrder);
        res.status(201).json({ message: 'Order created successfully', order: createdOrder });

        // Rensa varukorg efter beställning
        await db.remove({ userId }, { multi: true });

    } catch (err) {
        console.error(err);
        next(err);
    }
});

export default router;