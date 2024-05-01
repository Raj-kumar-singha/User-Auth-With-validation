const validator = require('joi');

const userSchema = validator.object({
  name: validator.string().required(),
  email: validator.string().email().required().lowercase(),
  password: validator.string().min(6).required()
});

const validateAuth = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = { validateAuth };
