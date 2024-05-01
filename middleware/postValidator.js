const validator = require('joi');

const postSchema = validator.object({
  title: validator.string().required(),
  body: validator.string().required(),
  status: validator.string().valid('Active', 'Inactive').required(),
  geoLocation: validator
    .object({
        type: validator.string().valid('Point').default('Point'),
        coordinates: validator.array().items(validator.number().precision(8)).min(2).max(2).required()
    })
    .required(),
});

const validatePost = (req, res, next) => {
  const { error } = postSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = { validatePost };
