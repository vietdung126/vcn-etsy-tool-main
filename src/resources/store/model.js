import * as mysql from '#src/connections/mysql.js'
import { ErrorFactory, errors } from '#src/libs/error/index.js'
import StoreDto, { TABLE as STORE_TABLE } from './dto.mjs'
import { TABLE as SKU_SPU_TABLE } from '../skuspu/dto.mjs'
import { TABLE as SKU_LINK_DESIGN_TABLE } from '../linkdesign/dto.mjs'
import { TABLE as GROUP_TABLE } from '../group/dto.mjs'

const knex = mysql.getConnection()

const { NotFoundError } = errors

export async function getById(id, trx = knex) {
    const record = await trx(STORE_TABLE).where({ id }).first()

    const item = StoreDto.fromRecord(record)
    return item
}

export async function create(payload, trx = knex) {
    const entity = new StoreDto(payload)
    entity.initId()
    const record = entity.toRecord()

    return await trx(STORE_TABLE).insert(record)
}

export async function getByCode(code, trx = knex) {
    const record = await trx(STORE_TABLE).where({ code }).first()

    const item = StoreDto.fromRecord(record)
    return item
}

export async function updateById(id, fields, trx = knex) {
    // check exists
    const record = await trx(STORE_TABLE)
        .where({ id, is_deleted: false })
        .first()
    if (!record) {
        throw new ErrorFactory(NotFoundError, `Store id: ${id} not found.`)
    }

    const entity = new StoreDto(fields)
    const newRecord = entity.toRecord()

    await trx(STORE_TABLE).where({ id, is_deleted: false }).update(newRecord)
}

export async function deleteById(id, deletedBy) {
    // check exists
    const record = await knex(STORE_TABLE)
        .where({ id, is_deleted: false })
        .first()
    if (!record) {
        throw new ErrorFactory(NotFoundError, `Store id: ${id} not found.`)
    }

    const result = await knex(STORE_TABLE)
        .where({ id, is_deleted: false })
        .update({
            is_deleted: true,
            deleted_at: new Date(),
            deleted_by: deletedBy,
            code: 'del_' + record.code + '_' + Date.now(),
        })

    await knex.raw(
        `UPDATE ${SKU_SPU_TABLE}
        SET is_deleted = ?, deleted_at = ?, deleted_by = ?,     
            sku = CONCAT('del_', sku, '_', ?)
        WHERE group_id in (
            SELECT id FROM ${GROUP_TABLE} WHERE store_id = ?
        ) and is_deleted = ?`,
        [true, new Date(), deletedBy, Date.now(), id, false]
    )

    await knex.raw(
        `UPDATE ${SKU_LINK_DESIGN_TABLE}
        SET is_deleted = ?, deleted_at = ?, deleted_by = ?,  
            sku = CONCAT('del_', sku, '_', ?)
        WHERE group_id in (
            SELECT id FROM ${GROUP_TABLE} WHERE store_id = ?
        ) and is_deleted = ?`,
        [true, new Date(), deletedBy, Date.now(), id, false]
    )

    await knex.raw(
        `UPDATE ${GROUP_TABLE}
        SET is_deleted = ?, deleted_at = ?, deleted_by = ?,        
            name = CONCAT('del_', name, '_', ?)
        WHERE  store_id = ? and is_deleted = ?`,
        [true, new Date(), deletedBy, Date.now(), id, false]
    )

    return result
}

export async function getAll(trx = knex) {
    const query = trx(STORE_TABLE).select('*').where({ is_deleted: false })
    const records = await query

    return records.map(StoreDto.fromRecord)
}
