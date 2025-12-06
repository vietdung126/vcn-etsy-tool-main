import joi from 'joi'
import joiDate from '@joi/date'

import validateApi from '#src/libs/validate-api.js'

const Joi = joi.extend(joiDate)

export const create = validateApi({
    body: Joi.object({
        storeId: Joi.string().required(),
        type: Joi.string().allow('link', 'sku').required(),
        name: Joi.string().required(),
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
        name: Joi.string(),
    }),
})
