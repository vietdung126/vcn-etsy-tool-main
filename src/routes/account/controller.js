import * as AccountModel from '#src/resources/account/model.js'

export async function createAccount(ctx) {
    const { username, password, fullName } = ctx.request.body
    await AccountModel.create({ username, password, fullName })
    const user = await AccountModel.getByUsername(username)

    ctx.body = user.toView()
}

export async function getAllAccounts(ctx) {
    const accounts = await AccountModel.getAllAccounts()

    ctx.body = accounts.map(e => e.toView())
}

export async function updateAccount(ctx) {
    const { id } = ctx.params
    if (Object.keys(ctx.request.body)) {
        await AccountModel.updateById(id, ctx.request.body)
    }

    const user = await AccountModel.getById(id)

    ctx.body = user.toView()
}

export async function delAccount(ctx) {
    const { id } = ctx.params

    const result = await AccountModel.deleteAccountById(id)

    ctx.body = result
}
