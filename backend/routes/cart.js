import { Router } from 'express';
import { readFileSync } from 'fs';
import { db } from '../server.js';
import Datastore from 'nedb-promises';

const data = JSON.parse(readFileSync('./data/menu.json', 'utf8'));
const products = data.menu;

const router = Router();
const usersDatabase = Datastore.create('users.db');
const guestUserId = 'guest-user';

const getProductFromMenu = id => products.find(item => item.id === Number(id));
const getProductFromCart = async (userId, productId) => await db.findOne({ userId, productId });

router.post('/add/:userId/:id', async (req, res) => {
    let { userId, id } = req.params;

    if (userId === 'guest') {
        userId = guestUserId;
    } else {
        const user = await usersDatabase.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
    }

    const product = getProductFromMenu(id);

    if (!product) {
        return res.status(404).json({ error: 'Product not found in menu' });
    }

    // Om vi vill lägga till samma produkt flera gånger
    // const existingProduct = await getProductFromCart(id);
    // if (existingProduct) {
        
    //     existingProduct.quantity = existingProduct.quantity ? existingProduct.quantity + 1 : 1;
    //     await db.update({ _id: id }, existingProduct);
    // } else {
    //     await db.insert({ _id: id, title: product.title, desc: product.desc, price: product.price, quantity: 1 });
    // }

    await db.insert({ userId, productId: id, title: product.title, desc: product.desc, price: product.price });
    res.json({ message: 'Product added to cart', product });
});

router.delete('/remove/:userId/:id', async (req, res) => {
    let { userId, id } = req.params;

    if (userId === 'guest') {
        userId = guestUserId;
    }

    const product = getProductFromMenu(id);

    if (!product) {
        return res.status(404).json({ error: 'Product not found in menu' });
    }

    const productInCart = await getProductFromCart(userId, id);
    if (!productInCart) {
        return res.status(404).json({ error: 'Product not found in cart' });
    }

    await db.remove({ userId, productId: id });
    res.json({ message: 'Product removed from cart' });
});

router.get('/', async (req, res) => {
    let { userId } = req.query;

    if (userId === 'guest') {
        userId = guestUserId;
    }

    console.log('Hämta cart för userId:', userId);

    const cart = await db.find({ userId });
    console.log('Cart items:', cart);

    if (cart.length === 0) {
        return res.json({ message: 'Your cart is empty' });
    }

    res.json(cart);
});

router.delete('/clear/:userId', async (req, res) => {
    let { userId } = req.params;

    if (userId === 'guest') {
        userId = guestUserId;
    }

    try {
        // Ta bort alla objekt från varukorgen som matchar användarens id
        await db.remove({ userId }, { multi: true });

        res.json({ message: 'Cart cleared successfully' });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ error: 'An error occurred while clearing the cart' });
    }
});

router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

export default router;