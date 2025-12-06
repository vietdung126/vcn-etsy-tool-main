import { v4 as uuidv4 } from 'uuid'
import { ErrorFactory, errors } from '#src/libs/error/index.js'

const { NODE_ENV } = process.env

export default function responseHandler(ctx, next) {
    const request_id = uuidv4()
    ctx.request.headers['app-request-id'] = request_id
    ctx.response.set({ 'app-request-id': request_id })

    return next()
        .then(() => {
            if (
                ctx.res.statusCode === 404 &&
                ctx.request.method !== 'OPTIONS'
            ) {
                ctx.redirect('/')
                return
                // ctx.status = 200
                // ctx.body = {
                //     error: new ErrorFactory(errors.NotFoundApiError),
                // }
                // return
            }

            ctx.status = 200

            // if ctx.state.originalBody set true then forward original ctx.body
            if (!ctx.state.originalResponse) {
                ctx.body = {
                    data: ctx.body,
                    paging: ctx.state.paging,
                }
            }

            if (
                NODE_ENV !== 'production' &&
                ctx.request.headers['app-debugger'] &&
                !ctx.state.preventLog
            ) {
                print('info', null, ctx)
            }
        })
        .catch(error => {
            console.error(error)
            ctx.status = 200

            // Các trường hợp lỗi do server/không xác định thì không trả về lỗi cho enduser
            if (
                !(error instanceof ErrorFactory) ||
                !error.type ||
                ctx.status === 500 ||
                error.type === 'ServerError' ||
                error.type === 'UnknownError'
            ) {
                ctx.body = { error: new ErrorFactory(errors.UnknownError) }
            } else {
                ctx.body = { error: error }
            }

            if (!ctx.state.preventLog) {
                print('error', error, ctx)
            }
        })
}

const print = (level = 'info', error, ctx) => {
    const request = {
        headers: { ...ctx.request.headers },
        params: ctx.params,
        query: ctx.request.query,
        body: ctx.request.body,
        request_id: ctx.request.headers['app-request-id'],
    }

    protect(request.headers)
    protect(request.query)

    const response = {
        headers: ctx.response.headers,
        body: { ...ctx.body },
    }

    if (typeof response.body.data === 'object') {
        response.body.data = { ...response.body.data }
        protect(response.body.data)
    } else if (typeof response.body.data === 'string') {
        response.body.data = response.body.data.slice(0, 10) + '...'
    }

    const log = {
        REQUEST: request,
        RESPONSE: response,
        request_id: request.request_id,
        method: ctx.request.method,
        path: ctx.request.path,
        error: error
            ? {
                  message: error.message,
                  stack: error.stack,
              }
            : error,
    }

    console[level]('Request ' + request.request_id, log)
}

function protect(data) {
    const protectedFields = [
        'x-access-token',
        'authorization',
        'token',
        'accessToken',
        'refreshToken',
        'password',
    ]
    protectedFields.forEach(field => {
        if (data[field]) {
            data[field] = data[field].slice(0, 2) + '...'
        }
    })
}
