import { ErrorFactory, errors } from '#src/libs/error/index.js'
import * as StoreModel from '#src/resources/store/model.js'

export async function create(ctx) {
    const { code, name } = ctx.request.body
    try {
        await StoreModel.create({ code, name, updatedBy: ctx.state.user.id })
        const item = await StoreModel.getByCode(code)

        ctx.body = item
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            throw new ErrorFactory(
                errors.ConflictError,
                'Đã tồn tại Store ' + code
            )
        }
    }
}

export async function getAll(ctx) {
    const items = await StoreModel.getAll()

    ctx.body = items
}

export async function update(ctx) {
    try {
        const { id } = ctx.params
        if (Object.keys(ctx.request.body)) {
            await StoreModel.updateById(id, {
                ...ctx.request.body,
                updatedBy: ctx.state.user.id,
            })
        }

        const user = await StoreModel.getById(id)

        ctx.body = user.toView()
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            throw new ErrorFactory(
                errors.ConflictError,
                'Đã tồn tại Store ' + ctx.request.body.code
            )
        }
    }
}

export async function del(ctx) {
    const { id } = ctx.params

    const result = await StoreModel.deleteById(id, ctx.state.user.id)

    ctx.body = result
}
