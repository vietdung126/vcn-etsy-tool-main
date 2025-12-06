import joi from 'joi'
import joiDate from '@joi/date'

import validateApi from '#src/libs/validate-api.js'

const Joi = joi.extend(joiDate)

export const createSkuSpu = validateApi({
    body: Joi.object({
        sku: Joi.string().required(),
        spu: Joi.string().required(),
        groupId: Joi.string().required(),
    }),
})

export const delSkuSpu = validateApi({
    params: Joi.object({
        id: Joi.string().required(),
    }),
})

export const updateSkuSpu = validateApi({
    params: Joi.object({
        id: Joi.string().required(),
    }),
    body: Joi.object({
        sku: Joi.string(),
        spu: Joi.string(),
        groupId: Joi.string(),
    }),
})
