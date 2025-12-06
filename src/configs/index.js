/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({
    path: path.join(import.meta.dirname, `../../env/${process.env.NODE_ENV}.env`),
})

dotenv.config({
    path: path.join(import.meta.dirname, '../../env/default.env'),
})
