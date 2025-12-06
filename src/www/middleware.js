import { ErrorFactory, errors } from '#src/libs/error/index.js'
import { decodeAccessToken } from '#src/resources/auth/model.js'

export function useOriginalResponse(ctx, next) {
    ctx.state.originalResponse = true
    return next()
}

export function authorization(ctx, next) {
    const authorizationToken = ctx.request.headers['authorization']

    if (!authorizationToken) {
        throw new ErrorFactory(errors.AuthenticationError)
    }

    const [type, token] = authorizationToken.split(' ')

    if (type !== 'Bearer' || !token) {
        const message =
            'Authorization must to be in format "Authorization: Bearer [token]"'
        throw new ErrorFactory(errors.InvalidAccessTokenError, message)
    }

    const payload = decodeAccessToken(token)

    ctx.state.user = payload

    return next()
}

export function onlyAdmin(ctx, next) {
    if (ctx.state?.user?.role === 'admin') {
        return next()
    }

    throw new ErrorFactory(errors.PermissionError)
}
