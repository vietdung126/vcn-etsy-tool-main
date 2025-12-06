import Router from '#src/libs/router.js'
import * as validate from './schema.js'
import * as ctrl from './controller.js'
import { authorization, onlyAdmin } from '#src/www/middleware.js'

export const router = new Router({ prefix: '/stores' })

router.use(authorization)

router.post('/', validate.create, ctrl.create)
router.get('/', ctrl.getAll)
router.put('/:id', onlyAdmin, validate.update, ctrl.update)
router.del('/:id', onlyAdmin, validate.del, ctrl.del)
