import { ClientErrorGenerator } from './factory.js'

export const ConflictError = new ClientErrorGenerator({
    code: '409',
    type: 'ConflictError',
    message: 'Occurs conflict error',
})

export const ValidationError = new ClientErrorGenerator({
    code: '412',
    type: 'ValidationError',
    message: 'Parameter is invalid',
})
