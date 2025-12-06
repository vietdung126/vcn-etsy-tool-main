import { v4 as uuidV4 } from 'uuid'

export default class SkuSpu {
    constructor({
        id,
        groupId,
        sku,
        spu,
        updatedBy,
        updatedAt,
        deletedAt,
        deletedBy,
        isDeleted,
    }) {
        this.id = id
        this.groupId = groupId
        this.sku = sku
        this.spu = spu
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
            group_id: this.groupId,
            sku: this.sku,
            spu: this.spu,
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
            groupId: this.groupId,
            sku: this.sku,
            spu: this.spu,
            updatedBy: this.updatedBy,
            updatedAt: this.updatedAt,
            isDeleted: this.isDeleted,
            deletedAt: this.deletedAt,
            deletedBy: this.deletedBy,
        }
    }

    static fromRecord(record) {
        if (!record) return record

        return new SkuSpu({
            id: record.id,
            groupId: record.group_id,
            sku: record.sku,
            spu: record.spu,
            updatedBy: record.updated_by,
            updatedAt: record.updated_at,
            isDeleted: record.is_deleted,
            deletedAt: record.deleted_at,
            deletedBy: record.deleted_by,
        })
    }
}

export const TABLE = 'skuspu'
