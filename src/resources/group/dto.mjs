import { v4 as uuidV4 } from 'uuid'

export default class Group {
    constructor({
        id,
        storeId,
        type,
        name,
        updatedBy,
        updatedAt,
        deletedAt,
        deletedBy,
        isDeleted,
    }) {
        this.id = id
        this.storeId = storeId
        this.type = type
        this.name = name
        this.updatedBy = updatedBy
        this.updatedAt = updatedAt
        this.deletedAt = deletedAt
        this.deletedBy = deletedBy
        this.isDeleted = isDeleted
    }

    initId() {
        this.id = uuidV4()
    }

    toRecord() {
        const record = {
            id: this.id,
            store_id: this.storeId,
            type: this.type,
            name: this.name,
            updated_by: this.updatedBy,
            updated_at: this.updatedAt,
            is_deleted: this.isDeleted,
            deleted_by: this.deletedBy,
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
            storeId: this.storeId,
            type: this.type,
            name: this.name,
            updatedBy: this.updatedBy,
            updatedAt: this.updatedAt,
            isDeleted: this.isDeleted,
            deletedAt: this.deletedAt,
            deletedBy: this.deletedBy,
        }
    }

    static fromRecord(record) {
        if (!record) return record

        return new Group({
            id: record.id,
            storeId: record.store_id,
            type: record.type,
            name: record.name,
            updatedBy: record.updated_by,
            updatedAt: record.updated_at,
            isDeleted: record.is_deleted,
            deletedAt: record.deleted_at,
            deletedBy: record.deleted_by,
        })
    }
}

export const TABLE = 'groups'
