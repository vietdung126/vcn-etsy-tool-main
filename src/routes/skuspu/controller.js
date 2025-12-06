import { ErrorFactory, errors } from '#src/libs/error/index.js'
import * as SkuSpuModel from '#src/resources/skuspu/model.js'

export async function createSkuSpu(ctx) {
    const { groupId, sku, spu } = ctx.request.body
    try {
        await SkuSpuModel.create({
            sku: sku.trim(),
            spu: spu.trim(),
            groupId,
            updatedBy: ctx.state.user.id,
        })
        const item = await SkuSpuModel.getBySku(sku)

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

export async function getAllSkuSpus(ctx) {
    const items = await SkuSpuModel.getAllSkuSpus()

    ctx.body = items
}

export async function updateSkuSpu(ctx) {
    try {
        const { id } = ctx.params
        if (Object.keys(ctx.request.body)) {
            const updatedFields = {}
            if (ctx.request.body.sku) {
                updatedFields.sku = ctx.request.body.sku.trim()
            }
            if (ctx.request.body.spu) {
                updatedFields.spu = ctx.request.body.spu.trim()
            }
            await SkuSpuModel.updateById(id, {
                ...updatedFields,
                updatedBy: ctx.state.user.id,
            })
        }

        const user = await SkuSpuModel.getById(id)

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

export async function delSkuSpu(ctx) {
    const { id } = ctx.params

    const result = await SkuSpuModel.deleteById(id, ctx.state.user.id)

    ctx.body = result
}
