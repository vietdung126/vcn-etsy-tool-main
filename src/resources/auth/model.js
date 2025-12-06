import JWT from 'jsonwebtoken'
import { customAlphabet } from 'nanoid'
import { ErrorFactory, errors } from '#src/libs/error/index.js'
const genRefreshTokenId = customAlphabet(
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
    32
)

export async function renewAccessToken(oldRefreshToken) {
    const payload = decodeRefreshToken(oldRefreshToken)

    const accessToken = generateAccessToken(payload)
    const refreshToken = await generateRefreshToken(payload)

    return {
        accessToken,
        refreshToken,
    }
}

export function decodeAccessToken(
    token,
    secretKey = process.env.JWT_SECRET_KEY
) {
    try {
        const payload = JWT.verify(token, secretKey)
        if (!payload.__at) {
            throw new ErrorFactory(errors.InvalidAccessTokenError)
        }

        return payload
    } catch (e) {
        if (e.name === 'TokenExpiredError') {
            throw new ErrorFactory(errors.ExpiredAccessTokenError)
        } else {
            throw new ErrorFactory(errors.InvalidAccessTokenError)
        }
    }
}

export function decodeRefreshToken(
    token,
    secretKey = process.env.JWT_SECRET_KEY
) {
    try {
        const payload = JWT.verify(token, secretKey)
        if (!payload.__rt) {
            throw new ErrorFactory(errors.InvalidRefreshTokenError)
        }

        return payload
    } catch (e) {
        if (e.name === 'TokenExpiredError') {
            throw new ErrorFactory(errors.ExpiredRefreshTokenError)
        } else {
            throw new ErrorFactory(errors.InvalidRefreshTokenError)
        }
    }
}

export function generateAccessToken(account) {
    return generateToken(account, process.env.ACCESS_TOKEN_TTL, { __at: true })
}

export async function generateRefreshToken(account) {
    const refreshTokenId = genRefreshTokenId()
    await RefreshTokenCache.saveNewRefreshToken(account.id, refreshTokenId)

    return generateToken(account, process.env.REFRESH_TOKEN_TTL, {
        __rt: true,
        __rid: refreshTokenId.id,
    })
}

export function generateToken(payload, ttl, additionalInfo) {
    return JWT.sign(
        {
            id: payload.id,
            role: payload.role,
            ...additionalInfo,
        },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: ttl,
        }
    )
}
