import joi from 'joi'
import joiDate from '@joi/date'

import validateApi from '#src/libs/validate-api.js'

const Joi = joi.extend(joiDate)

export const createAccount = validateApi({
    body: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
        fullName: Joi.string().required(),
    }),
})

export const delAccount = validateApi({
    params: Joi.object({
        id: Joi.string().required(),
    }),
})

export const updateAccount = validateApi({
    params: Joi.object({
        id: Joi.string().required(),
    }),
    body: Joi.object({
        username: Joi.string(),
        password: Joi.string(),
        fullName: Joi.string(),
    }),
})
