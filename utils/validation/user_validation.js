import joi from "joi";

export const validate_signup = (data) => {
  const schema = joi.object({
    first_name: joi.string().min(2).max(30).required(),
    last_name: joi.string().min(2).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
    role: joi.string().valid("teacher", "student", "parent").required(),
  });
  return schema.validate(data);
};

export const validate_login = (data) => {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
  });
  return schema.validate(data);
};
