String.prototype.interpolate = function (params) {
    const names = Object.keys(params)
    const vals = Object.values(params)
    return new Function(...names, `return \`${this}\`;`)(...vals)
}

const mapErrorCode = {} // map: code -> name/type
let _prefix = ''

const handler = {
    set(obj, prop) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            throw new Error(`Error ${prop} is allocated for ${JSON.stringify(obj[prop], null, 2)}`)
        } else {
            return Reflect.set(...arguments)
        }
    },
}

/**
 * The list of registered errors
 */
export const errors = new Proxy(mapErrorCode, handler)

export class ErrorFactory extends Error {
    /**
     * @typedef {Object} ErrorParameter
     * @property {String} message - The error message
     * @property {*} details - The error details
     */
    /**
     *
     * @param {BaseError} template - The error template
     * @param {ErrorParameter} params - The error parameters
     */
    constructor(template, params) {
        if (!(template instanceof BaseError)) {
            throw new Error('Error template is invalid')
        }

        if (params) {
            const paramsType = typeof params
            if (!['string', 'object'].includes(paramsType)) {
                throw new Error('Parameter must be a string or an object.')
            }
        }

        let message = ''
        if (typeof params === 'string') {
            message = params
        } else if (typeof params === 'object') {
            message = params.message
        } else {
            message = template.message
        }

        super(message)

        this.type = template.type
        this.code = template.code

        if (params?.details) {
            this.details = params.details
        }
    }

    toJSON() {
        return {
            code: this.code,
            type: this.type,
            message: this.message,
            details: this.details,
        }
    }
}

/**
 * @class BaseError
 * @property {String} type - The error type
 * @property {String} code - The error code
 * @property {String} message - The error message
 */
export class BaseError {
    constructor({ type, code, message }) {
        if (!type) throw new Error('Error type is required')
        if (!code) throw new Error('Error code is required')
        if (!message) throw new Error('Error message is required')

        this.code = code
        this.type = type
        this.message = message
    }
}

export class ClientError extends BaseError {
    constructor({ type, code, message }) {
        super({ type, code: `${_prefix}${code}`, message })
    }
}

export class ServerError extends BaseError {
    constructor({ type, code, message }) {
        super({ type, code: `${_prefix}${code}`, message })
    }
}

export const ClientErrorGenerator = new Proxy(ClientError, {
    construct(target, args) {
        const result = new target(args[0])
        errors[result.code] = result
        return result
    },
})

export const ServerErrorGenerator = new Proxy(ClientError, {
    construct(target, args) {
        const result = new target(args[0])
        errors[result.code] = result
        return result
    },
})

export function setPrefix(prefix) {
    if (_prefix) {
        throw new Error('Prefix already set')
    }
    _prefix = prefix
}
