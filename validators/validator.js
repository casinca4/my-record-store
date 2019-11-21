const { body, validationResult } = require('express-validator');

const userValidationRules = () => {
    return [
    body('email')
        .isEmail()
        .exists()
        .normalizeEmail()
        .withMessage('Do you call this an email?'),
    body('password')
        .isLength({ min: 10 })
        .withMessage('Your password should be 10 characters long.'),
    body('firstName').trim(),
    body('lastName').trim()
    ];
};

//von https://express-validator.github.io/docs/ (umgeändert, da https://express-validator.github.io/docs/sanitization.html)

const userValidationErrorHandling = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(422).json({ errors: errors.array() });
  };

module.exports = {
    userValidationRules,        //eigentlich userValidationRules: validationRules
    userValidationErrorHandling
};
