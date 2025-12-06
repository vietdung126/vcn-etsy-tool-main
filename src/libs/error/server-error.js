import { ServerErrorGenerator } from './factory.js'

export const UnknownError = new ServerErrorGenerator({
    code: '500',
    type: 'UnknownError',
    message: 'Something went wrong.',
})

export const ThirdSystemError = new ServerErrorGenerator({
    code: '50001',
    type: 'ThirdSystemError',
    message: 'Receive an error from third system.',
})

export const NotImplementedError = new ServerErrorGenerator({
    code: '50002',
    type: 'NotImplementedError',
    message: 'This api has not been implemented.',
})
