import Joi from "joi";


const orderSchema = Joi.object({
  userId: Joi.string().required(), // Förutsätter att userId är en sträng
  items: Joi.array().items(Joi.object({
    // id: Joi.string().required(), // `_id` är en sträng i databasen
    title: Joi.string().required(),
    desc: Joi.string().required(),
    price: Joi.number().required(),
    // quantity: Joi.number().required() // Lägg till quantity för beställning
  })).required(),
  total: Joi.number().required(), // Totalbeloppet för beställningen
  status: Joi.string().default('pending') // Standardvärde för status
});

export default orderSchema;
