import Joi from "joi";

const orderSchema = {
  create: Joi.object().keys({
    // uuid v4
    userId: Joi.string().uuid({ version: "uuidv4" }).required(),
    symbolPair: Joi.string().pattern(/^[A-Z]{3}\/[A-Z]{3}$/),
    quantity: Joi.number().precision(2).required().strict(),
    price: Joi.number().precision(2).required().strict(),
    side: Joi.string().valid("BUY", "SELL"),
    type: Joi.string().valid("MARKET", "LIMIT"),
  }),
};

export default orderSchema;
