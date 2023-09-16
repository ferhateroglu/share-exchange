import Joi from "joi";

const portfolioSchema = {
  id: Joi.object().keys({
    id: Joi.string().uuid({ version: "uuidv4" }).required(),
  }),

  bulk: Joi.object().keys({
    portfolios: Joi.array().items(
      Joi.object().keys({
        shareId: Joi.string().uuid({ version: "uuidv4" }).required(),
        quantity: Joi.number().precision(2).required().strict(),
        lockedQuantity: Joi.number()
          .precision(2)
          .required()
          .strict()
          .optional(),
      })
    ),
  }),

  deposit: Joi.object().keys({
    quantity: Joi.number().precision(2).required().strict(),
  }),

  retriveAll: Joi.object().keys({}),

  addPortfolio: Joi.object().keys({
    userId: Joi.string().uuid({ version: "uuidv4" }).required(),
    shareId: Joi.string().uuid({ version: "uuidv4" }).required(),
    quantity: Joi.number().precision(2).required().strict(),
    lockedQuantity: Joi.number().precision(2).required().strict().optional(),
  }),

  updatePortfolio: Joi.object().keys({
    shareId: Joi.string().uuid({ version: "uuidv4" }).optional(),
    quantity: Joi.number().precision(2).required().strict().optional(),
    lockedQuantity: Joi.number().precision(2).required().strict().optional(),
  }),
};

export default portfolioSchema;
