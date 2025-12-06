import Router from '#src/libs/router.js'
import * as ctrl from './controller.js'
import { authorization } from '#src/www/middleware.js'

export const router = new Router({ prefix: '/transform' })

router.use(authorization)

router.post('/', ctrl.transform)
