import { ClientErrorGenerator } from './factory.js'

export const NotFoundError = new ClientErrorGenerator({
    code: '404',
    type: 'NotFoundError',
    message: 'Not found resource',
})

export const NotFoundApiError = new ClientErrorGenerator({
    code: '40400',
    type: 'NotFoundApiError',
    message: 'Not found api, please check path',
})
