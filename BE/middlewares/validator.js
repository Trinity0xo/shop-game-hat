const validator = (schema, property = "body") => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property]);

    if (!error) {
      next();
    } else {
      const { details } = error;

      let errMessage = details[0].message.split(`"`).join("");
      errMessage = errMessage.charAt(0).toUpperCase() + errMessage.slice(1);

      res.status(422).json({
        success: false,
        message: errMessage,
      });
    }
  };
};

module.exports = validator;
