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
// CATEGORY VALIDATION
const saveAgencyValidations = (data) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        provider_id: Joi.number().required(),
        language: Joi.array().required(),
        agency_compaign_id: Joi.number(),
        password: Joi.string(),
        role: Joi.number().required(),
        stop_api: Joi.string(),
        route_api: Joi.string(),
        vehicle_api:Joi.string(),
        public_api: Joi.string(),
        email: Joi.string().email({
            minDomainSegments: 2,
            tlds: {
                allow: ['com', 'net', 'tv', 'id']
            }
        }).required(),
        api_key: Joi.string().required(),
        contacts: Joi.array().items({
            name: Joi.string().label("Contact Name").required(),
            phone: Joi.string().label("Contact Number").required(),
            designation: Joi.string().label("Designation").required()
        }),
    });
    
    return schema.validate(data);
};
// CATEGORY VALIDATION
const updateAgencyValidations = (data) => {
    const schema = Joi.object({
        agency_id: Joi.number().required(),
        user_id: Joi.number().required(),
        username: Joi.string().required(),
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        provider_id: Joi.number().required(),
        language: Joi.array().required(),
        agency_compaign_id: Joi.number(),
        password: Joi.string(),
        role: Joi.number().required(),
        provider_detail_id: Joi.number(),
        stop_api: Joi.string(),
        route_api: Joi.string(),
        vehicle_api:Joi.string(),
        public_api: Joi.string(),
        api_key: Joi.string().required(),
        contacts: Joi.array().items({
            agency_id: Joi.number().label("agency_id").required(),
            contact_id: Joi.number().label("Contact Id").required(),
            name: Joi.string().label("Contact Name").required(),
            phone: Joi.string().label("Contact Number").required(),
            designation: Joi.string().label("Designation").required()
        }),
    });
    
    return schema.validate(data);
};

const saveSubscriberValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().email({
            minDomainSegments: 4,
            tlds: {
                allow: ['com', 'net', 'tv', 'id']
            }
        }).required(),
    });
    return schema.validate(data);
};

const saveAuthUserValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().email({
            minDomainSegments: 4,
            tlds: {
                allow: ['com', 'net', 'tv', 'id']
            }
        }).required(),
    });
    return schema.validate(data);
};

const savePlayerTypeValidations = (data) => {
    const schema = Joi.object({
        name: Joi.string().required(),
    });
    return schema.validate(data);
};
const updatePlayerTypeValidations = (data) => {
    const schema = Joi.object({
        player_type_id: Joi.number().required(),
        name: Joi.string().required(),
    });
    return schema.validate(data);
};
const saveHardwareLogValidations = (data) => {
    const schema = Joi.object({
        description: Joi.array().required(),
        isDeleted: Joi.number(),
    });
    return schema.validate(data);
};

const updateHardwareLogValidations = (data) => {
    const schema = Joi.object({
        hardware_log_id: Joi.number().required(),
        description: Joi.array().required(),
    });
    return schema.validate(data);
};

const saveAppLogValidations = (data) => {
    const schema = Joi.object({
        description: Joi.array().required(),
        isDeleted: Joi.number(),
    });
    return schema.validate(data);
};

const updateAppLogValidations = (data) => {
    const schema = Joi.object({
        app_log_id: Joi.number().required(),
        description: Joi.array().required(),
    });
    return schema.validate(data);
};


const saveCmsLogValidations = (data) => {
    const schema = Joi.object({
        description: Joi.array().required(),
        isDeleted: Joi.number(),
    });
    return schema.validate(data);
};

const updateCmsLogValidations = (data) => {
    const schema = Joi.object({
        cms_log_id: Joi.number().required(),
        description: Joi.array().required(),
    });
    return schema.validate(data);
};

const updateForgotPasswordValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().email({
            minDomainSegments: 2,
            tlds: {
                allow: ['com', 'net', 'tv']
            }
        }).required(),
        password: joiPassword
            .string()
            .minOfSpecialCharacters(1)
            .minOfLowercase(1)
            .minOfUppercase(1)
            .minOfNumeric(2)
            .noWhiteSpaces()
            .required().label('Password'),
        password_confirmation: Joi.any().valid(Joi.ref('password')).required().label('Confirm password')
            .options({
                messages: {
                    'any.only': '{{#label}} does not match'
                }
            })

    });
    return schema.validate(data);
};
const saveStopValidations = (data) => {
    const schema = Joi.object({
        agency_id: Joi.number().required(),
        name: Joi.string().required(),
        stop_number: Joi.string().required(),
        stop_compaign_id: Joi.string().required(),
        isDeleted: Joi.number(),
    });
    return schema.validate(data);
};

const updateStopValidations = (data) => {
    const schema = Joi.object({
        stop_id: Joi.number().required(),
        agency_id: Joi.number().required(),
        name: Joi.string().required(),
        stop_number: Joi.string().required(),
        stop_compaign_id: Joi.string().required(),
        isDeleted: Joi.number(),
    });
    return schema.validate(data);
};

const savebayValidations = (data) => {
    const schema = Joi.object({
        stop_id: Joi.number().required(),
        agency_id: Joi.number().required(),
        bay_compaign_id: Joi.string().required(),
        vehicle_capacity: Joi.number().required(),
        max_length: Joi.number().required(),
        available: Joi.string().required(),
        name: Joi.string().required(),
        description: Joi.string().required(),
        bay_number: Joi.string().required(),
        bay_image: Joi.string().required(),
        route: Joi.string().required(),
        remaining_capacity: Joi.number(),
        isDeleted: Joi.number(),
    });
    return schema.validate(data);
};

const updatebayValidations = (data) => {
    const schema = Joi.object({
        bay_id: Joi.number().required(),
        stop_id: Joi.number().required(),
        agency_id: Joi.number().required(),
        bay_compaign_id: Joi.string().required(),
        vehicle_capacity: Joi.number().required(),
        max_length: Joi.number().required(),
        available: Joi.string().required(),
        name: Joi.string().required(),
        description: Joi.string().required(),
        bay_number: Joi.string().required(),
        bay_image: Joi.string().required(),
        remaining_capacity: Joi.number(),
        route: Joi.string().required(),
        isDeleted: Joi.number(),
    });
    return schema.validate(data);
};

const saveMessageValidations = (data) => {
    const schema = Joi.object({
        stop_id: Joi.number().required(),
        agency_id: Joi.number().required(),
        description: Joi.string().required(),
        bay_message: Joi.number().required(),
        command_id: Joi.number().required(),
        isDeleted: Joi.number(),
    });
    return schema.validate(data);
};

const updateMessageValidations = (data) => {
    const schema = Joi.object({
        available_message_id: Joi.number().required(),
        stop_id: Joi.number().required(),
        agency_id: Joi.number().required(),
        description: Joi.string().required(),
        bay_message: Joi.number().required(),
        command_id: Joi.number().required(),
        isDeleted: Joi.number(),
    });
    return schema.validate(data);
};


const saveProviderValidations = (data) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        username: Joi.string().required(),
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        email: Joi.string().email({
            minDomainSegments: 2,
            tlds: {
                allow: ['com', 'net', 'tv', 'id']
            }
        }).required(),
        password: Joi.string().required(),
        role: Joi.number().required(),
        isActive: Joi.number(),
        isDeleted: Joi.number(),
    });
    return schema.validate(data);
};

const updateProviderValidations = (data) => {
    const schema = Joi.object({
        provider_id : Joi.number().required(),
        user_id: Joi.number().required(),
        name: Joi.string().required(),
        username: Joi.string().required(),
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        password: Joi.string(),
        role: Joi.number().required(),
        isDeleted: Joi.number(),
    });
    return schema.validate(data);
};

const saveSubsriptionValidations = (data) => {
    const schema = Joi.object({
        userId: Joi.string().required(),
        subName: Joi.string().required(),
        withdrawAmount: Joi.string().required(),
        frequency: Joi.string().required(),
        image: Joi.string().required(),
        description: Joi.string().required(),
        terms: Joi.string().required(),
    });
    return schema.validate(data);
};

module.exports = {
    saveUserValidations,
    saveAgencyValidations,
    updateAgencyValidations,
    saveSubscriberValidation,
    saveAuthUserValidation,
    updateForgotPasswordValidation,
    savePlayerTypeValidations,
    updatePlayerTypeValidations,
    saveHardwareLogValidations,
    updateHardwareLogValidations,
    saveAppLogValidations,
    updateAppLogValidations,
    saveCmsLogValidations,
    updateCmsLogValidations,
    saveStopValidations,
    updateStopValidations,
    savebayValidations,
    updatebayValidations,
    saveMessageValidations,
    updateMessageValidations,
    saveProviderValidations,
    updateProviderValidations,
    saveSubsriptionValidations,
}