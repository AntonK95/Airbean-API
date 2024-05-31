import { Router } from "express";
import orderSchema from "../models/orderModel.js";
import { database } from "../server.js";
import { db } from "../server.js";


const router = Router();

router.post('/create', async (req, res, next) => {
    try {

        const { userId } = req.body;
        // const userId = 'sqQLcWWuC4lrGg27'; // Hårdkodad _id endast för att testa

        // Hämta varukorg för användare
        const cartItems = await db.find({ userId });

        if(!cartItems.length) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        
        const items = cartItems.map(item => ({
            id: item.productId,
            title: item.title,
            desc: item.desc,
            price: item.price,
            quantity: item.quantity
        }));
        
        const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

        // Logga inkommande begäran för debug
        console.log('Incoming request body:', req.body);
        // Skapa en ny order med data från förfrågan
        const newOrder = {
            userId,
            items,
            total,
            status: 'pending'
        };

        const { error } = orderSchema.validate(newOrder);
        if (error) {
            console.log('Validation error', error.details[0].message);
            return res.status(400).send(error.details[0].message);
        }


        
        // Infoga den nya ordern i databasen
        const createdOrder = await db.insert(newOrder);
        res.status(201).json({ message: 'Order created successfully', order: createdOrder });

        // Rensa varukorg efter beställning
        await database.remove({ userId }, { multi: true });

    } catch (err) {
        console.error(err);
        next(err);
    }
});

export default router;