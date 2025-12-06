import { v4 as uuidV4 } from 'uuid'
import bcrypt from 'bcryptjs'

export default class Account {
    constructor({
        id,
        fullName,
        username,
        password,
        hashedPassword,
        isDeleted,
        role,
        createdAt,
        updatedAt,
        deletedAt,
    }) {
        this.id = id
        this.fullName = fullName
        this.username = username
        this.hashedPassword = hashedPassword
        this.password = password
        this.isDeleted = isDeleted
        this.role = role
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        this.deletedAt = deletedAt
    }

    initId() {
        this.id = uuidV4()
    }

    toRecord() {
        const record = {
            id: this.id,
            full_name: this.fullName,
            username: this.username,
            role: this.role,
            hashed_password: this.hashedPassword,
            is_deleted: this.isDeleted,
            created_at: this.createdAt,
            updated_at: this.updatedAt,
            deleted_at: this.deletedAt,
        }

        Object.keys(record).forEach(key => {
            if (record[key] === undefined) {
                delete record[key]
            }
        })

        return record
    }

    toView() {
        delete this.hashedPassword
        return {
            id: this.id,
            username: this.username,
            role: this.role,
            fullName: this.fullName,
            isDeleted: this.isDeleted,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            deletedAt: this.deletedAt,
        }
    }

    static fromRecord(record) {
        if (!record) return record

        return new Account({
            id: record.id,
            username: record.username,
            role: record.role,
            fullName: record.full_name,
            hashedPassword: record.hashed_password,
            isDeleted: record.is_deleted,
            createdAt: record.created_at,
            updatedAt: record.updated_at,
            deletedAt: record.deleted_at,
        })
    }

    hashPassword() {
        this.hashedPassword = bcrypt.hashSync(this.password)
    }
}
