import knex from 'knex'

const knexConnection = knex({
    client: 'mysql2',
    connection: process.env.MYSQL_CONNECTION_STRING,
})

console.log(process.env.MYSQL_CONNECTION_STRING)
export function getConnection() {
    return knexConnection
}

export async function checkConnection() {
    return knexConnection
        .raw('select 1 as result')
        .then(() => ({
            connected: true,
        }))
        .catch(err => {
            console.log(err)
            return false
        })
}
