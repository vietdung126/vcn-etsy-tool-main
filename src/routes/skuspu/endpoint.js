import Router from '#src/libs/router.js'
import * as validate from './schema.js'
import * as ctrl from './controller.js'
import { authorization, onlyAdmin } from '#src/www/middleware.js'

export const router = new Router({ prefix: '/skuspus' })

router.use(authorization)

router.post('/', validate.createSkuSpu, ctrl.createSkuSpu)
router.get('/', ctrl.getAllSkuSpus)
router.put('/:id', onlyAdmin, validate.updateSkuSpu, ctrl.updateSkuSpu)
router.del('/:id', onlyAdmin, validate.delSkuSpu, ctrl.delSkuSpu)
