import _ from 'lodash'
import { errors, ErrorFactory } from '#src/libs/error/index.js'
import * as AccountModel from '#src/resources/account/model.js'
import * as AuthModel from '#src/resources/auth/model.js'

export async function login(ctx) {
    const { username, password } = ctx.request.body
    const user = await AccountModel.getByUsername(username)

    if (!user || user.isDeleted) {
        throw new ErrorFactory(errors.InvalidUsernameError)
    }

    if (!AccountModel.verifyPassword(password, user.hashedPassword)) {
        throw new ErrorFactory(errors.InvalidPasswordError)
    }

    delete user.hashedPassword
    const payload = {
        id: user.id,
        role: user.role,
    }

    ctx.body = {
        profile: _.pick(user, ['id', 'fullName', 'username', 'role']),
        accessToken: AuthModel.generateAccessToken(payload),
    }
}

export async function changePassword(ctx) {
    const { currentPassword, newPassword } = ctx.request.body
    const userId = ctx.state.user.id
    const user = await AccountModel.getById(userId)

    if (!user || user.isDeleted) {
        throw new ErrorFactory(errors.InvalidUsernameError)
    }

    if (!AccountModel.verifyPassword(currentPassword, user.hashedPassword)) {
        throw new ErrorFactory(errors.InvalidPasswordError)
    }

    await AccountModel.updateById(userId, { password: newPassword })

    ctx.body = 'success'
}
