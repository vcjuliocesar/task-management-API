import { SqlClient } from './sql-client'
import { DataBaseConfig } from './config'

export const main = async () => {

    const client = SqlClient.create(DataBaseConfig)

    try {
        await client.connect()
    } finally {
        await client.disconnect()
    }
}

