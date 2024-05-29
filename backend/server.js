import express from 'express';
import menuRouter from './routes/menu.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use('/menu', menuRouter);

// Starta server
app.listen(PORT, (req, res) => {
    console.log(`Server is running on port ${PORT}`);
});