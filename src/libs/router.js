'use strict'

import KoaRouter from '@koa/router'
import { globSync } from 'glob'

export default class Router extends KoaRouter {
    /**
     *
     * @param {KoaRouter.RouterOptions} opts
     * @returns
     */
    constructor(opts) {
        super(opts)
        return this
    }

    async loadChildren(pattern) {
        const matches = globSync(pattern)

        for (let i = 0; i < matches.length; i += 1) {
            const file = matches[i]
            const routers = await import(file)

            for (const property in routers) {
                let item = routers[property]
                if (item instanceof Promise) {
                    item = await item
                }
                this.use(item.routes()).use(item.allowedMethods())
            }
        }

        return this
    }
}
