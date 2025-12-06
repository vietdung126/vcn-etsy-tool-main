import Router from '#src/libs/router.js'
import * as validate from './schema.js'
import * as ctrl from './controller.js'
import { onlyAdmin, authorization } from '#src/www/middleware.js'

export const router = new Router({ prefix: '/accounts' })

router.use(authorization).use(onlyAdmin)

router.post('/', validate.createAccount, ctrl.createAccount)
router.get('/', ctrl.getAllAccounts)
router.put('/:id', validate.updateAccount, ctrl.updateAccount)
router.del('/:id', validate.delAccount, ctrl.delAccount)
