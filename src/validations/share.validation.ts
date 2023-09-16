import Joi from "joi";

const shareSchema = {
  bulk: Joi.object().keys({
    shares: Joi.array().items(
      Joi.object({
        symbol: Joi.string().length(3).required(),
        name: Joi.string().required(),
      })
    ),
  }),
};

export default shareSchema;
