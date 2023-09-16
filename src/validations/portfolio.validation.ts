import Joi from "joi";

const portfolioSchema = {
  saveAll: Joi.object().keys({
    portfolios: Joi.array().items(
      Joi.object().keys({
        userId: Joi.string().uuid({ version: "uuidv4" }).required(),
        symbolId: Joi.string().uuid({ version: "uuidv4" }).required(),
        quantity: Joi.number().precision(2).required(),
        lockedQuantity: Joi.number().precision(2).optional(),
      })
    ),
  }),

  retriveAll: Joi.object().keys({}),

  addPortfolio: Joi.object().keys({
    userId: Joi.string().uuid({ version: "uuidv4" }).required(),
    symbolId: Joi.string().uuid({ version: "uuidv4" }).required(),
    quantity: Joi.number().precision(2).required(),
    lockedQuantity: Joi.number().precision(2).optional(),
  }),

  updatePortfolio: Joi.object().keys({
    userId: Joi.string().uuid({ version: "uuidv4" }).optional(),
    symbolId: Joi.string().uuid({ version: "uuidv4" }).optional(),
    quantity: Joi.number().precision(2).optional(),
    lockedQuantity: Joi.number().precision(2).optional(),
  }),

  removePortfolio: Joi.object().keys({
    id: Joi.string().uuid({ version: "uuidv4" }).required(),
  }),
};

export default portfolioSchema;
