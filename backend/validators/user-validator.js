import Joi from "joi";

//signup validation
const registerValidation = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.base": "Name must be a string",
    "string.empty": "Name cannot be empty",
    "string.min": "Name must be at least 3 characters",
    "string.max": "Name cannot exceed 50 characters",
    "any.required": "Name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email",
    "string.empty": "Email cannot be empty",
    "any.required": "Email is required",
  }),
  password: Joi.string()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#&!~_])[A-Za-z\d@$#&!~_]+$/,
    )
    .min(8)
    .required()
    .messages({
      "string.pattern.base":
        "Password must include uppercase, lowercase, number, and special character",
      "string.min": "Password must be at least 8 characters",
      "string.empty": "Password cannot be empty",
      "any.required": "Password is required",
    }),
});

//login validation
const loginValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email",
    "string.empty": "Email cannot be empty",
    "any.required": "Email is required",
  }),

  password: Joi.string().required().messages({
    "string.empty": "Password cannot be empty",
    "any.required": "Password is required",
  }),
});
export { registerValidation, loginValidation };
