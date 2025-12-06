import { ClientErrorGenerator } from './factory.js'

/**--------------------- Authentication ------------------------------
 * Check account
 * Prefix code: 401
 * ------------------------------------------------------------------*/
export const AuthenticationError = new ClientErrorGenerator({
    code: '401',
    type: 'AuthenticationError',
    message: 'Authentication is required',
})

export const InvalidPasswordError = new ClientErrorGenerator({
    code: '40101',
    type: 'InvalidPasswordError',
    message: 'Password is invalid',
})

export const InvalidUsernameError = new ClientErrorGenerator({
    code: '40102',
    type: 'InvalidUsernameError',
    message: 'Username is invalid',
})

export const InvalidEmailError = new ClientErrorGenerator({
    code: '40103',
    type: 'InvalidEmailError',
    message: 'Email is invalid',
})

export const InvalidAccessTokenError = new ClientErrorGenerator({
    code: '40104',
    type: 'InvalidAccessTokenError',
    message: 'Access token is invalid',
})

export const ExpiredAccessTokenError = new ClientErrorGenerator({
    code: '40105',
    type: 'ExpiredAccessTokenError',
    message: 'Access token is expired',
})

export const InvalidRefreshTokenError = new ClientErrorGenerator({
    code: '40106',
    type: 'InvalidRefreshTokenError',
    message: 'Refresh token is expired',
})

export const ExpiredRefreshTokenError = new ClientErrorGenerator({
    code: '40107',
    type: 'ExpiredRefreshTokenError',
    message: 'Refresh token is expired',
})

export const InvalidInitDataError = new ClientErrorGenerator({
    type: 'InvalidInitDataError',
    code: '40108',
    message: 'InitData is invalid.',
})

/**--------------------- Authorization ------------------------------
 * Check role/permission
 * Prefix code: 403
 * ------------------------------------------------------------------*/

export const PermissionError = new ClientErrorGenerator({
    code: '403',
    type: 'PermissionError',
    message: "You don't have permission to perform this action.",
})
