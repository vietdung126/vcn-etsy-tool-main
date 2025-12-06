import * as _ from 'lodash'
import { ErrorFactory, errors } from '#src/libs/error/index.js'

export default function validateApi(schemas) {
    if (!schemas) {
        throw new Error('Schema of api is not defined')
    }

    return (ctx, next) => {
        const { body } = ctx.request
        const { params, query } = ctx

        const data = {
            body,
            params,
            query,
        }

        const positions = Object.keys(schemas) // [body, params, query]
        if (schemas.headers) {
            data.headers = _.pick(ctx.request.headers, Object.keys(schemas.headers))
        }

        for (let i = 0; i < positions.length; i += 1) {
            const part = positions[i]
            const schema = typeof schemas[part] === 'function' ? schemas[part](ctx) : schemas[part]
            const partSchema = data[part]
            if (part === 'params') {
                delete partSchema['0']
            }
            const { error } = schema.validate(partSchema)
            const details = !error || error.details

            if (error) {
                throw new ErrorFactory(errors.ValidationError, {
                    message: `Missing or invalid params at ${part}`,
                    details,
                })
            }
        }

        return next()
    }
}
