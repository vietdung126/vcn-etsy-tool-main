'use strict'

import http from 'http'
import chalk from 'chalk'

const debug = console
debug.log(chalk.blue('Environment:'), chalk.green(process.env.NODE_ENV))

process.on('uncaughtException', error => {
    debug.error('Uncaught Exception: ', error)
})

process.on('unhandledRejection', (reason, p) => {
    debug.error('Unhandled Rejection at: Promise', p, 'reason:', reason)
})

// start
;(async function start() {
    try {
        const bootstrap = await import('./bootstrap.js')
        await bootstrap.load()

        const { default: app } = await import('./www/app.js')
        const { HOST, PORT } = process.env

        const server = http.createServer(app.callback())

        server.listen({ port: PORT, host: HOST })
        server.on('listening', () => {
            debug.log(
                chalk.blue('Server is listening on:'),
                chalk.green(`${HOST}:${PORT}`)
            )
        })

        process.on('SIGINT', () => {
            server.close(() => {
                debug.log('Process terminated')
                process.exit()
            })
        })
    } catch (err) {
        debug.error('Occurs error when starting server\n', err)
        debug.warn(chalk.yellow('Server is stopping ...'))
        process.exit(1)
    }
})()
