// VALIDATION
const Joi = require('joi');
const {
    joiPassword
} = require('joi-password');

const saveUserValidations = (data) => {
    const schema = Joi.object({
        walletName: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string(),
        business_email: Joi.string().email({
            minDomainSegments: 2,
            tlds: {
                allow: ['com', 'net', 'tv', 'id']
            }
        }),
        email: Joi.string().email({
            minDomainSegments: 2,
            tlds: {
                allow: ['com', 'net', 'tv', 'id']
            }
        }),
        image_url: Joi.string(),
        business_website_url: Joi.string(),
        phone: Joi.string(),
        countryCode: Joi.string(),
        role: Joi.number().required(),
        status: Joi.number(),
    });
    return schema.validate(data);
};
const saveSubsriptionValidations = (data) => {
    const schema = Joi.object({
        userId: Joi.string().required(),
        subName: Joi.string().required(),
        withdrawAmount: Joi.number().required(),
        frequency: Joi.string().required(),
        image: Joi.string().required(),
        description: Joi.string().required(),
        terms: Joi.string().required(),
    });
    return schema.validate(data);
};

module.exports = {
    saveUserValidations,
    saveSubsriptionValidations,
}