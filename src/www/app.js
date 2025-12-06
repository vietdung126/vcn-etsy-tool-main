import Koa from 'koa'
import zlib from 'zlib'
import path from 'path'
import { koaBody } from 'koa-body'
import compress from 'koa-compress'
import cors from '@koa/cors'
import serve from 'koa-static'

import Router from '#src/libs/router.js'
import responseHandler from './response-handler.js'
const app = new Koa()

app.use(cors(process.env.CORS))
app.use(serve('./fe/dist'))

app.use(
    compress({
        filter(content_type) {
            return /text|application\/json/i.test(content_type)
        },
        threshold: 2048,
        gzip: {
            flush: zlib.Z_SYNC_FLUSH,
        },
        deflate: {
            flush: zlib.Z_SYNC_FLUSH,
        },
        br: {
            flush: zlib.Z_SYNC_FLUSH,
        },
    })
)

app.use(
    koaBody({
        multipart: true,
        formidable: {
            uploadDir: process.env.UPLOAD_DIR, // directory where files will be uploaded
            keepExtensions: true, // keep file extension on upload
            multiples: true,
        },
        urlencoded: true,
        formLimit: process.env.FORM_LIMIT,
    })
)

app.use(responseHandler)

const router = new Router()
router.loadChildren(
    `${path.join(import.meta.dirname, '..')}/routes/*/*endpoint.js`
)
app.use(router.routes())

export default app
