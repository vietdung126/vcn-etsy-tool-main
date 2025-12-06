import { ErrorFactory, errors } from '#src/libs/error/index.js'
import * as LinkDesignModel from '#src/resources/linkdesign/model.js'

export async function create(ctx) {
    const { sku, link, groupId } = ctx.request.body
    try {
        await LinkDesignModel.create({
            sku,
            link,
            groupId,
            updatedBy: ctx.state.user.id,
        })
        const item = await LinkDesignModel.getBySku(sku)

        ctx.body = item
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            throw new ErrorFactory(
                errors.ConflictError,
                'Đã tồn tại SKU ' + sku
            )
        }
    }
}

export async function getAll(ctx) {
    const items = await LinkDesignModel.getAll()

    ctx.body = items
}

export async function update(ctx) {
    try {
        const { id } = ctx.params
        if (Object.keys(ctx.request.body)) {
            await LinkDesignModel.updateById(id, {
                ...ctx.request.body,
                updatedBy: ctx.state.user.id,
            })
        }

        const user = await LinkDesignModel.getById(id)

        ctx.body = user.toView()
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            throw new ErrorFactory(
                errors.ConflictError,
                'Đã tồn tại SKU ' + ctx.request.body.sku
            )
        }
    }
}

export async function del(ctx) {
    const { id } = ctx.params

    const result = await LinkDesignModel.deleteById(id, ctx.state.user.id)

    ctx.body = result
}
