import { createPool } from "mysql2";

const pool = createPool({
    host: 'localhost',
    user: 'root',
    database: 'online-shop',
    password: 'admin1771'
})

export default pool.promise()