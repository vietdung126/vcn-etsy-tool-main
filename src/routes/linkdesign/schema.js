import joi from 'joi'
import joiDate from '@joi/date'

import validateApi from '#src/libs/validate-api.js'

const Joi = joi.extend(joiDate)

export const create = validateApi({
    body: Joi.object({
        sku: Joi.string().required(),
        link: Joi.string().required(),
        groupId: Joi.string().required(),
    }),
})

export const del = validateApi({
    params: Joi.object({
        id: Joi.string().required(),
    }),
})

export const update = validateApi({
    params: Joi.object({
        id: Joi.string().required(),
    }),
    body: Joi.object({
        sku: Joi.string(),
        link: Joi.string(),
        groupId: Joi.string(),
    }),
})
