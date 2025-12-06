'use strict'

import './configs/index.js'

import connections from './connections/index.js'

export async function load() {
    await connections.initConnections()
}
