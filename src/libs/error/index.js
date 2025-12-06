import * as authErrors from './auth-error.js'
import * as notFoundErrors from './not-found-error.js'
import * as otherErrors from './other-error.js'
import * as serverErrors from './server-error.js'

export * from './factory.js'
export const errors = { ...authErrors, ...notFoundErrors, ...otherErrors, ...serverErrors }
