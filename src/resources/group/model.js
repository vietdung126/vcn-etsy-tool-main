import * as mysql from '#src/connections/mysql.js'
import { ErrorFactory, errors } from '#src/libs/error/index.js'
import GroupDto, { TABLE as GROUP_TABLE } from './dto.mjs'
import { TABLE as SKU_SPU_TABLE } from '../skuspu/dto.mjs'
import { TABLE as SKU_LINK_DESIGN_TABLE } from '../linkdesign/dto.mjs'

const knex = mysql.getConnection()

const { NotFoundError } = errors

export async function getById(id, trx = knex) {
    const record = await trx(GROUP_TABLE).where({ id }).first()

    const item = GroupDto.fromRecord(record)
    return item
}

export async function create(payload, trx = knex) {
    const entity = new GroupDto(payload)
    entity.initId()
    const record = entity.toRecord()

    await trx(GROUP_TABLE).insert(record)

    return entity.id
}

export async function getByType(type, trx = knex) {
    const record = await trx(GROUP_TABLE).where({ type }).first()

    const item = GroupDto.fromRecord(record)
    return item
}

export async function updateById(id, fields, trx = knex) {
    // check exists
    const record = await trx(GROUP_TABLE)
        .where({ id, is_deleted: false })
        .first()
    if (!record) {
        throw new ErrorFactory(NotFoundError, `Store id: ${id} not found.`)
    }

    const entity = new GroupDto(fields)
    const newRecord = entity.toRecord()

    await trx(GROUP_TABLE).where({ id, is_deleted: false }).update(newRecord)
}

export async function deleteById(id, deletedBy) {
    // check exists
    const record = await knex(GROUP_TABLE)
        .where({ id, is_deleted: false })
        .first()
    if (!record) {
        throw new ErrorFactory(NotFoundError, `Store id: ${id} not found.`)
    }

    const result = await knex(GROUP_TABLE)
        .where({ id, is_deleted: false })
        .update({
            is_deleted: true,
            deleted_at: new Date(),
            deleted_by: deletedBy,
            name: 'del_' + record.name + '_' + Date.now(),
        })

    await knex.raw(
        `UPDATE ${SKU_SPU_TABLE}
        SET is_deleted = ?, deleted_at = ?, deleted_by = ?,
            sku = CONCAT('del_', sku, '_', ?)
        WHERE group_id = ? and is_deleted = ?`,
        [true, new Date(), deletedBy, Date.now(), id, false]
    )

    await knex.raw(
        `UPDATE ${SKU_LINK_DESIGN_TABLE}
        SET is_deleted = ?, deleted_at = ?, deleted_by = ?,
            sku = CONCAT('del_', sku, '_', ?)
        WHERE group_id = ? and is_deleted = ?`,
        [true, new Date(), deletedBy, Date.now(), id, false]
    )

    await knex(SKU_SPU_TABLE).where({ group_id: id }).update({
        is_deleted: true,
        deleted_at: new Date(),
        deleted_by: deletedBy,
    })

    await knex(SKU_LINK_DESIGN_TABLE).where({ group_id: id }).update({
        is_deleted: true,
        deleted_at: new Date(),
        deleted_by: deletedBy,
    })

    return result
}

export async function getAll(trx = knex) {
    const query = trx(GROUP_TABLE).select('*').where({ is_deleted: false })
    const records = await query

    return records.map(GroupDto.fromRecord)
}
