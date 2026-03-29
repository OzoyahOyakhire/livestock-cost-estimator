import { BadRequestError } from "../errors/index.js";

const validator = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errorMessage = error.details.map((err) => err.message).join(", ");
      return next(new BadRequestError(errorMessage));
    }
    next();
  };
};

export default validator;
