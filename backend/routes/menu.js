import { Router } from 'express';
import { readFileSync } from 'fs';

const router = Router();

router.get('/', (req, res) => {
    try {
        const data = JSON.parse(readFileSync('./data/menu.json'));
        res.send(data);
    } catch(err) {
        console.log(err);
        res.status(500).send('Internal server error');
    }
})

export default router;