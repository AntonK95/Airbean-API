import express from 'express';
import menuRouter from './routes/menu.js';
import nedb from 'nedb-promises';
import registerRouter from './routes/register.js';

const app = express();
const PORT = process.env.PORT || 8080;

export const database = nedb.create({ filename: 'users.db', autoload: true });

app.use(express.json());
app.use('/menu', menuRouter);
app.use('/register', registerRouter);

// Starta server
app.listen(PORT, (req, res) => {
    console.log(`Server is running on port ${PORT}`);
});