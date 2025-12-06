/**
 * @fileoverview Module định nghĩa các kiểu dữ liệu khai báo trong mongoose schema.
 *
 * @module libs/mongo-field
 */
import mongoose from 'mongoose'
const Schema = mongoose.Schema

const { S3_PROTOCOL, S3_ENDPOINT, S3_BUCKET_NAME, S3_ENDPOINT_MASK, S3_CDN_URL } = process.env

class MongoField {
    constructor() {
        return this
    }

    #genType(defaultValue, type) {
        if (type) {
            this.type = type
        }
        if (defaultValue !== undefined) {
            this.default = defaultValue
        }
    }

    id(defaultValue) {
        this.#genType(defaultValue, Schema.Types.ObjectId)
        return this
    }

    string(defaultValue) {
        this.#genType(defaultValue, String)
        return this
    }

    number(defaultValue) {
        this.#genType(defaultValue, Number)
        return this
    }

    boolean(defaultValue) {
        this.#genType(defaultValue, Boolean)
        return this
    }

    date(defaultValue) {
        this.#genType(defaultValue, Date)
        return this
    }

    buffer(defaultValue) {
        this.#genType(defaultValue, Buffer)
        return this
    }

    decimal128(defaultValue) {
        this.#genType(defaultValue, Schema.Types.Decimal128)
        return this
    }

    mixed(defaultValue) {
        this.#genType(defaultValue, Schema.Types.Mixed)
        return this
    }

    lowercase(lowercase = true) {
        this.lowercase = lowercase
        return this
    }

    uppercase(uppercase = true) {
        this.uppercase = uppercase
        return this
    }

    trim(trim = true) {
        this.trim = trim
        return this
    }

    required(required = true) {
        this.required = required
        return this
    }

    auto(auto = true) {
        this.auto = auto
        return this
    }

    ref(ref) {
        this.ref = ref
        return this
    }

    enum(array) {
        if (!Array.isArray(array)) {
            throw new Error('Parameter of enum must be an array')
        }
        this.enum = array
        return this
    }

    min(val) {
        this.min = val
        return this
    }

    max(val) {
        this.max = val
        return this
    }

    get(getter) {
        if (typeof getter !== 'function') {
            throw new Error('Getter must be a function')
        }

        this.get = getter
        return this
    }

    mediaUrl() {
        this.type = String
        this.get = path =>
            !path || /(data|http|https):.*/.test(path)
                ? path
                : `${S3_PROTOCOL}://${S3_ENDPOINT_MASK || S3_ENDPOINT}/${S3_BUCKET_NAME}/${path}`

        this.set = path => {
            if (!path) {
                return
            }
            let val = path
            val = val
                .replace(`${S3_PROTOCOL}://${S3_ENDPOINT_MASK}/${S3_BUCKET_NAME}/`, '')
                .replace(`${S3_PROTOCOL}://${S3_ENDPOINT}/${S3_BUCKET_NAME}/`, '')
                .replace(`${S3_PROTOCOL}://${S3_CDN_URL}/${S3_BUCKET_NAME}/`, '')
                .replace(/\?.*/, '')
            return val
        }

        return this
    }

    toJSON() {
        return {
            ...this,
        }
    }

    j() {
        return this.toJSON()
    }
}

export default function mf() {
    return new MongoField()
}
