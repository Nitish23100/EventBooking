import ApiError from '../utils/ApiError.js';

const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      const errorMessages = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      next(new ApiError(400, 'Validation failed', errorMessages));
    }
  };
};

export default validate;
