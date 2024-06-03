import express from 'express';
import menuRouter from './routes/menu.js';
import nedb from 'nedb-promises';
import registerRouter from './routes/register.js';
import loginRouter from './routes/login.js';
import updateUserRouter from './routes/update.js';
import cartRouter from './routes/cart.js';
import errorHandlerMiddleware from './middlewares/errorHandler.js'
import orderRouter from './routes/order.js';
import info from './routes/info.js';

const app = express();
const PORT = process.env.PORT || 8080;

export const database = nedb.create({ filename: 'users.db', autoload: true });
export const db = nedb.create({ filename: 'cart.db', autoload: true });
export const orderDB = nedb.create({ filename: 'order.db', autoload: true });

app.use(express.json());
app.use('/menu', menuRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/update-account', updateUserRouter);
app.use('/cart', cartRouter);
app.use('/order', orderRouter);
app.use('/info', info);

app.use(errorHandlerMiddleware);

// Starta server
app.listen(PORT, (req, res) => {
    console.log(`Server is running on port ${PORT}`);
});