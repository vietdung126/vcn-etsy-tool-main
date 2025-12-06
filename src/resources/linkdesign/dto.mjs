import { v4 as uuidV4 } from 'uuid'

export default class LinkDesign {
    constructor({
        id,
        groupId,
        sku,
        link,
        updatedBy,
        updatedAt,
        deletedAt,
        deletedBy,
        isDeleted,
    }) {
        this.id = id
        this.groupId = groupId
        this.sku = sku
        this.link = link
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
            link: this.link,
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
            link: this.link,
            updatedBy: this.updatedBy,
            updatedAt: this.updatedAt,
            isDeleted: this.isDeleted,
            deletedAt: this.deletedAt,
            deletedBy: this.deletedBy,
        }
    }

    static fromRecord(record) {
        if (!record) return record

        return new LinkDesign({
            id: record.id,
            groupId: record.group_id,
            sku: record.sku,
            link: record.link,
            updatedBy: record.updated_by,
            updatedAt: record.updated_at,
            isDeleted: record.is_deleted,
            deletedAt: record.deleted_at,
            deletedBy: record.deleted_by,
        })
    }
}

export const TABLE = 'linkdesign'
