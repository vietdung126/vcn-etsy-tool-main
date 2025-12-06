import * as mysql from '#src/connections/mysql.js'
import { ErrorFactory, errors } from '#src/libs/error/index.js'
import LinkDesignDto, { TABLE as LINKDESIGN_TABLE } from './dto.mjs'

const knex = mysql.getConnection()

const { NotFoundError } = errors

export async function getById(id, trx = knex) {
    const record = await trx(LINKDESIGN_TABLE).where({ id }).first()

    const item = LinkDesignDto.fromRecord(record)
    return item
}

export async function create(payload, trx = knex) {
    const entity = new LinkDesignDto(payload)
    entity.initId()
    const record = entity.toRecord()

    return await trx(LINKDESIGN_TABLE).insert(record)
}

export async function getBySku(sku, trx = knex) {
    const record = await trx(LINKDESIGN_TABLE).where({ sku }).first()

    const item = LinkDesignDto.fromRecord(record)
    return item
}

export async function updateById(id, fields, trx = knex) {
    // check exists
    const record = await trx(LINKDESIGN_TABLE)
        .where({ id, is_deleted: false })
        .first()
    if (!record) {
        throw new ErrorFactory(
            NotFoundError,
            `Link design id: ${id} not found.`
        )
    }

    const entity = new LinkDesignDto(fields)
    const newRecord = entity.toRecord()

    await trx(LINKDESIGN_TABLE)
        .where({ id, is_deleted: false })
        .update(newRecord)
}

export async function deleteById(id, deletedBy) {
    // check exists
    const record = await knex(LINKDESIGN_TABLE)
        .where({ id, is_deleted: false })
        .first()
    if (!record) {
        throw new ErrorFactory(
            NotFoundError,
            `Link design id: ${id} not found.`
        )
    }

    const result = await knex(LINKDESIGN_TABLE)
        .where({ id, is_deleted: false })
        .update({
            is_deleted: true,
            deleted_at: new Date(),
            deleted_by: deletedBy,
            sku: 'del_' + record.sku + '_' + Date.now(),
        })

    return result
}

export async function getAll(trx = knex) {
    const query = trx(LINKDESIGN_TABLE).select('*').where({ is_deleted: false })
    const records = await query

    return records.map(LinkDesignDto.fromRecord)
}
