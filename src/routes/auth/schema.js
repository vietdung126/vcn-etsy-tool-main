import joi from 'joi'
import joiDate from '@joi/date'

import validateApi from '#src/libs/validate-api.js'

const Joi = joi.extend(joiDate)

export const login = validateApi({
    body: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
    }),
})

export const changePassword = validateApi({
    body: Joi.object({
        currentPassword: Joi.string().min(1).required(),
        newPassword: Joi.string().min(1).required(),
    }),
})
