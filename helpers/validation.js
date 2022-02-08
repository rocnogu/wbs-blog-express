import Joi from '@hapi/joi';

const registrationValidator = (data) => {
    const schema = Joi.object({
        Avatar: Joi.string(),
        email: Joi.string().min(6).max(199).required().email(),
        name: Joi.string().min(2).max(30).required(),
        Password: Joi.string().min(6).max(16).required(),
        First_Name: Joi.string().min(2).max(30).alphanum(),
        Last_Name: Joi.string().min(2).max(30).alphanum(),
        Location: Joi.string().min(2).max(30).alphanum(),
        Gender: Joi.string().min(2).max(30).alphanum(),
        Bio: Joi.string().min(2).max(999),
        Age: Joi.number().min(18).max(111).integer(),
        Website: Joi.string(),
        primaryContact: Joi.string(),
        emailConfirmed: Joi.string(),
        isOnline: Joi.string(),
        isDeleted: Joi.string(),
        Role: Joi.string()
    })
    return schema.validate(data);
}

const loginValidator = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).max(199).required().email(),
        Password: Joi.string().min(6).max(16).required()
    })
    return schema.validate(data);
}

export {registrationValidator,loginValidator};