import Router from '#src/libs/router.js'

export const router = new Router()

router.get('/ping', ctx => {
    console.log(new Date())
    ctx.body = new Date()
})
