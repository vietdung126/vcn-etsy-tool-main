import bcrypt from 'bcryptjs'
import * as mysql from '#src/connections/mysql.js'
import { ErrorFactory, errors } from '#src/libs/error/index.js'
import AccountDto from './dto.mjs'

const knex = mysql.getConnection()

const { NotFoundError } = errors

const ACCOUNT_TABLE = 'accounts'

export async function getById(id, trx = knex) {
    const recordUser = await trx(ACCOUNT_TABLE)
        .where({ id, is_deleted: false })
        .first()

    const user = AccountDto.fromRecord(recordUser)
    return user
}

export async function create(entity, trx = knex) {
    const userEntity = new AccountDto(entity)
    userEntity.initId()
    userEntity.hashPassword()

    const recordUser = userEntity.toRecord()

    return await trx(ACCOUNT_TABLE).insert(recordUser)
}

export async function getByUsername(username, trx = knex) {
    const recordUser = await trx(ACCOUNT_TABLE).where({ username }).first()

    const user = AccountDto.fromRecord(recordUser)
    return user
}

export async function updateById(id, fields, trx = knex) {
    // check exists
    const user = await trx(ACCOUNT_TABLE)
        .where({ id, is_deleted: false })
        .first()
    if (!user) {
        throw new ErrorFactory(NotFoundError, `User ID: ${id} not found.`)
    }

    const userEntity = new AccountDto(fields)
    if (userEntity.password) {
        userEntity.hashPassword()
    }
    const recordUser = userEntity.toRecord()

    await trx(ACCOUNT_TABLE).where({ id, is_deleted: false }).update(recordUser)
}

export async function deleteAccountById(id, trx = knex) {
    const result = await trx(ACCOUNT_TABLE)
        .where({ id, is_deleted: false, role: 'member' })
        .update({ is_deleted: true, deleted_at: new Date() })

    return result
}

export async function changePassword(id, newPassword, trx = knex) {
    const hashedPassword = this.hashPassword(newPassword)
    // check exists
    return await trx(ACCOUNT_TABLE)
        .where({ id })
        .update({ hashed_password: hashedPassword })
}

export async function getAllAccounts(trx = knex) {
    const query = trx(ACCOUNT_TABLE).select('*').where({ is_deleted: false })
    const users = await query

    return users.map(AccountDto.fromRecord)
}

export function verifyPassword(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword)
}
