import { DataBase } from "../config/database"
import { Config } from "../config/config"
import { DataBaseDto } from "../dtos/database.dto"


const Dbconfig: DataBaseDto = {
    user: Config.user,
    password: Config.password,
    host: Config.host,
    port: Config.port,
}

async function databaseExists(dbName: string, client: DataBase): Promise<boolean> {

    const result = await client.query(
        `SELECT EXISTS (SELECT FROM pg_catalog.pg_database WHERE datname = $1) AS "exists"`,
        [dbName]
    )
    
    return result.rows[0][0]
}

async function tableExists(client: DataBase, tableName: string): Promise<boolean> {
    const result = await client.query(
        `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = $1) AS "exists"`,
        [tableName]
    );
    
    return result.rows[0][0]
}

async function createDataBase() {

    const client = DataBase.getInstance()

    const dbName = Config.database

    try {
        await client.connect(Dbconfig)

        const dbExists = await databaseExists(dbName, client)
        
        if (!dbExists) {
            await client.query(`CREATE DATABASE ${dbName}`)
        } else {
            console.log(`La base de datos '${dbName}' ya existe.`);
        }
        
    } catch (error) {
        console.error('Error en el proceso:', error)
    }finally{
        await client.disconnect();
    }
}

async function createTables() {

    const client = DataBase.getInstance()

    try {
        await client.connect(Config)
        
        const tablesToCreate = [
            {
                name: 'users',
                query:`
                CREATE TABLE users (
                  id SERIAL PRIMARY KEY,
                  name VARCHAR(50) NOT NULL,
                  email VARCHAR(100) UNIQUE NOT NULL,
                  password VARCHAR(100) NOT NULL,
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
              `,
            },
            {
                name:'project',
                query:`
                CREATE TABLE project (
                    id SERIAL PRIMARY KEY,
                    user_id SERIAL,
                    name VARCHAR(50) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    CONSTRAINT fk_user
                        FOREIGN KEY(user_id)
                            REFERENCES users(id)
                            ON DELETE CASCADE
                            ON UPDATE CASCADE 
                )
                `
            },
            {
                name:'task',
                query:`
                CREATE TABLE task (
                    id SERIAL PRIMARY KEY,
                    project_id SERIAL,
                    name VARCHAR(50) NOT NULL,
                    status BOOLEAN NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    CONSTRAINT fk_project
                        FOREIGN KEY(project_id)
                            REFERENCES project(id)
                            ON DELETE CASCADE
                            ON UPDATE CASCADE
                )
                `
            }
        ]

        for(const table of tablesToCreate) {
            const tableExistsResult = await tableExists(client,table.name)
            
            if(!tableExistsResult) {
                await client.query(table.query)
                console.log(`Tabla '${table.name}' creada.`);
            }else{
                console.log(`La tabla '${table.name}' ya existe.`);
            }
        }
    } catch (error) {
        console.error('Error en el proceso:', error)
    }finally{
        await client.disconnect()
        console.log('Proceso completado.');
    }

}

createDataBase()
    .then(() => createTables())
    .catch(error => {
        // Manejar errores aquí si es necesario
        console.error('Error durante la inicialización:', error);
    });