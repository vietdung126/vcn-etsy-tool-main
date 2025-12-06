// define app by environment
const appDefs = [
    {
        name: 'vcnetsy-api',
        env: {
            NODE_ENV: 'staging',
        },
        script: './src/start.js',
        instances: '2',
        exec_mode: 'cluster',
        max_memory_restart: '2G',
        node_args: '--expose-gc --max-old-space-size=4096',
    },
    {
        name: 'vcnetsy-api',
        env: {
            NODE_ENV: 'production',
        },
        script: './src/start.js',
        instances: '2',
        exec_mode: 'cluster',
        max_memory_restart: '2G',
        node_args: '--expose-gc --max-old-space-size=4096',
    },
]

console.log('PM2 Environment', process.env.NODE_ENV)

const apps = appDefs.filter(e => e.env.NODE_ENV === process.env.NODE_ENV)

module.exports = {
    apps,
}
