import { ErrorFactory, errors } from '#src/libs/error/index.js'
import * as GroupModel from '#src/resources/group/model.js'

export async function create(ctx) {
    const { storeId, type, name } = ctx.request.body
    const id = await GroupModel.create({
        storeId,
        type,
        name,
        updatedBy: ctx.state.user.id,
    })
    const item = await GroupModel.getById(id)

    ctx.body = item
}

export async function getAll(ctx) {
    const items = await GroupModel.getAll()

    ctx.body = items
}

export async function update(ctx) {
    const { id } = ctx.params
    if (Object.keys(ctx.request.body)) {
        await GroupModel.updateById(id, {
            ...ctx.request.body,
            updatedBy: ctx.state.user.id,
        })
    }

    const user = await GroupModel.getById(id)

    ctx.body = user.toView()
}

export async function del(ctx) {
    const { id } = ctx.params

    const result = await GroupModel.deleteById(id, ctx.state.user.id)

    ctx.body = result
}
