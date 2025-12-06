import Router from '#src/libs/router.js'
import * as validate from './schema.js'
import * as ctrl from './controller.js'
import { authorization } from '#src/www/middleware.js'

export const router = new Router({ prefix: '/auth' })

router.post('/login', validate.login, ctrl.login)
router.put(
    '/password',
    authorization,
    validate.changePassword,
    ctrl.changePassword
)
