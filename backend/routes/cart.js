import { Router } from 'express';
import { readFileSync } from 'fs';
import { db } from '../server.js';

const data = JSON.parse(readFileSync('./data/menu.json', 'utf8'));
const products = data.menu;

const router = Router();

const getProductFromMenu = id => products.find(item => item.id === Number(id));
const getProductFromCart = async id => await db.findOne({ _id: id });

router.post('/add/:id', async (req, res) => {
    const { id } = req.params;
    const product = getProductFromMenu(id);

    if (!product) {
        return res.status(404).json({ error: 'Product not found in menu' });
    }

    const productInCart = await getProductFromCart(id);
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

    await db.insert({ _id: id, title: product.title, desc: product.desc, price: product.price });
    res.json({ message: 'Product added to cart' });
});

router.delete('/remove/:id', async (req, res) => {
    const { id } = req.params;
    const product = getProductFromMenu(id);

    if (!product) {
        return res.status(404).json({ error: 'Product not found in menu' });
    }

    const productInCart = await getProductFromCart(id);
    if (!productInCart) {
        return res.status(404).json({ error: 'Product not found in cart' });
    }

    await db.remove({ _id: id });
    res.json({ message: 'Product removed from cart' });
});

router.get('/', async (req, res) => {
    const cart = await db.find({});
    res.json(cart);
});

export default router;