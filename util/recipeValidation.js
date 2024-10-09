const { body, validationResult } = require("express-validator");

const validate = {};

validate.createRecipeRules = () => {
    return [
        body("recipe")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide the name of the recipe"),
        
        body("ingredients")
            .isArray({ min: 1 })
            .withMessage("Please provide at least one ingredient"),

        body("time")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide the cooking time")
            .isString()
            .withMessage("Time must be a string"),

        body("preparation")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide the preparation instructions"),

        body("country")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide the country of origin"),
    ];
};

validate.validationCreate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

    return res.status(422).json({
        errors: extractedErrors,
    });
};

module.exports = validate;
