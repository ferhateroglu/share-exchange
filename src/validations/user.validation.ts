import Joi from "joi";

const userSchema = {
  create: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
  saveAll: Joi.object().keys({
    users: Joi.array().items(
      Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
      })
    ),
  }),
  retriveById: Joi.object().keys({
    id: Joi.string().uuid({ version: "uuidv4" }).required(),
  }),
  retriveByEmail: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
  update: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
  delete: Joi.object().keys({
    id: Joi.string().uuid({ version: "uuidv4" }).required(),
  }),
};

export default userSchema;
