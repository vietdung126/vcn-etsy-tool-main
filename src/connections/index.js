'use strict'

import Promise from 'bluebird'
import chalk from 'chalk'
import * as mysql from './mysql.js'

const dbs = {
    mysql,
}

const { STARTING_TIMEOUT } = process.env
const WAITING_TIME = 1000 // ms

let timeCounting = 0

const connectedDbs = []

async function initConnections() {
    if (timeCounting > STARTING_TIMEOUT) {
        console.log(chalk.red('Cannot connect to db'))
        throw new Error('Cannot start')
    }

    let isConnected = true
    await Promise.all(
        Object.keys(dbs)
            .filter(e => !connectedDbs.includes(e))
            .map(async dbName => {
                const result = await dbs[dbName].checkConnection()
                if (!result.connected) {
                    isConnected = false
                    console.log(
                        chalk.yellow('Waiting for connection to ' + dbName)
                    )
                } else {
                    console.log(
                        chalk.blue('Connected to ') + chalk.green(dbName)
                    )
                }

                return
            })
    )

    if (!isConnected) {
        timeCounting += WAITING_TIME
        await Promise.delay(WAITING_TIME)
        return initConnections()
    }

    return true
}

export default { mysql, initConnections }
