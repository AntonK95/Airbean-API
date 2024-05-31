import { Router } from "express";
import orderSchema from "../models/orderModel.js";
// import { database } from "../server.js";
import { db } from "../server.js";
import { orderDB } from "../server.js";

// db = cart
// database = users

const router = Router();

router.post('/create', async (req, res, next) => {
    try {

        const { userId } = req.body;

        // Hämta varukorg för användare
        const cartItems = await db.find({ userId });

        if(!cartItems.length) {
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
        console.log('Incoming request body:', req.body);
        console.log('items:', items);
        console.log('total:', total);
        // Skapa en ny order med data från förfrågan
        const newOrder = {
            userId,
            items,
            total,
            // status: 'pending'
        };

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