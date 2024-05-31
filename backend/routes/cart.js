import { Router } from 'express';
import { readFileSync } from 'fs';
import { db } from '../server.js';
import timeStampOrder from '../middlewares/timeStampOrder.js';

const data = JSON.parse(readFileSync('./data/menu.json', 'utf8'));
const products = data.menu;

const router = Router();

const getProductFromMenu = id => products.find(item => item.id === Number(id));
const getProductFromCart = async id => await db.findOne({ _id: id });

router.post('/add/:id', timeStampOrder, async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    const product = getProductFromMenu(id);

    if (!product) {
        return res.status(404).json({ error: 'Product not found in menu' });
    }

    const productInCart = await getProductFromCart(userId, id);
    if (productInCart) {
        return res.status(400).json({ error: 'Product already in cart' });
    }

    // Om vi vill lägga till samma produkt flera gånger
    // const existingProduct = await getProductFromCart(id);
    // if (existingProduct) {
        
    //     existingProduct.quantity = existingProduct.quantity ? existingProduct.quantity + 1 : 1;
    //     await db.update({ _id: id }, existingProduct);
    // } else {
    //     await db.insert({ _id: id, title: product.title, desc: product.desc, price: product.price, quantity: 1 });
    // }

    await db.insert({ userId, title: product.title, desc: product.desc, price: product.price });
    res.json({ message: 'Product added to cart' });
});

router.delete('/remove/:id', async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    const product = getProductFromMenu(id);

    if (!product) {
        return res.status(404).json({ error: 'Product not found in menu' });
    }

    const productInCart = await getProductFromCart(userId, id);
    if (!productInCart) {
        return res.status(404).json({ error: 'Product not found in cart' });
    }

    await db.remove({ userId, _id });
    res.json({ message: 'Product removed from cart' });
});

router.get('/', async (req, res) => {
    const { userId } = req.query;

    console.log('Hämta cart för userId:', userId);

    const cart = await db.find({ userId });
    console.log('Cart items:', cart);
    res.json(cart);
});

router.delete('/clear', async (req, res) => {
    const { userId } = req.body;

    try {
        // Ta bort alla objekt från varukorgen som matchar användarens id
        await db.remove({ userId }, { multi: true });

        res.json({ message: 'Cart cleared successfully' });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ error: 'An error occurred while clearing the cart' });
    }
});

export default router;