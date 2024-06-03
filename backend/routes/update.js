import { Router } from "express";
import updateUserSchema from "../models/updateModel.js";
import { database } from "../server.js";
import validate from "../middlewares/validate.js";

const router = Router();

router.put('/', validate(updateUserSchema), async (req, res, next) => {
    try {
        const { error } = updateUserSchema.validate(req.body);

        if (error) return res.status(400).send(error.details[0].message);

        const { userId, username, password, email } = req.body;

        // Logga det userId som söks efter
        console.log(`Sök efter användare med id ${userId}`);

        // Leta upp användare med hjälp av userId
        const existingUser = await database.findOne({ userId });

        // Logga resultat av sökning
        console.log(`Resultat av sökningen ${JSON.stringify(existingUser)}`);

        if (!existingUser) return res.status(404).json({ message: 'Användaren hittades inte' });

        // Objekt för att lagra uppdateringsfälten
        const updateFields = {};

        // Om nytt username, password eller email skickas, lägg till det i uppdateringsfälten
        if (username) {
            // Kontrollera om det nya användarnamnet redan existerar i databasen
            const userWithNewUsername = await database.findOne({ username });
            if (userWithNewUsername && userWithNewUsername.userId !== userId) {
                return res.status(400).json({ message: 'Det nya användarnamnet är redan upptaget' });
            }
            updateFields.username = username;
        }
        if (password) {
            updateFields.password = password;
        }
        if (email) {
            updateFields.email = email;
        }

        // Uppdatera användarinformationen i databasen och returnera det uppdaterade dokumentet
        const updateUser = await database.update({ userId }, { $set: updateFields }, { returnUpdatedDocs: true });

        // Skicka meddelande och den uppdaterade användaren
        res.status(200).json({ message: 'User updated successfully', user: updateUser });

    } catch (err) {
        console.error(err);
        next(err);
    }
});

export default router;