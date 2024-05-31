import fs from 'fs/promises';
import { Router } from 'express';

const router = Router()
  router.get('/', async (req, res) => {
    try {
      const data = await fs.readFile('./data/menu.json');
      const menuData = JSON.parse(data);
      let descriptions = "\n";
      const additionalInfo = "Allt kaffe är bryggt med kärlek och glädje och en härlig dos av en extra Lorem Ipsum!";
      descriptions += `\n ${additionalInfo}\n`;
      menuData.menu.forEach(item => {
        descriptions += `${item.title}: ${item.desc}\n`;
      });
      res.send(descriptions);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Ett fel inträffade när menyn skulle läsas.');
    }
  });


export default router;