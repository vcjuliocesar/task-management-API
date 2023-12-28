import { Client } from "ts-postgres"
import { DatabaseConfig } from "./interfaces/database-config";
import { DataBaseDto } from "../dtos/database.dto";

export class DataBase {
    private static instance: DataBase | null = null

    private client: Client | null

    private config: DatabaseConfig | DataBaseDto | null;

    constructor() {
        this.client = null
        this.config = null;
    }

    static getInstance(): DataBase {
        if (!DataBase.instance) {
            DataBase.instance = new DataBase()
        }

        return DataBase.instance
    }

    async connect(config:DatabaseConfig | DataBaseDto): Promise<void> {
        try {

            this.config = config
            
            this.client = new Client(this.config)

            await this.client.connect()
            
            console.log('Conexión establecida con la base de datos')
        
        } catch (error) {
        
            console.error('Error al conectar con la base de datos:', error)
        
            throw error
        
        }
    }

    async query(sqlQuery: string, values: any[] = []): Promise<any> {

        if (!this.client) {
            throw new Error('No hay conexión con la base de datos.')
        }

        try {
            return await this.client.query(sqlQuery, values)
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
            throw error
        }
    }

    async disconnect(): Promise<void> {

        if (this.client) {
            await this.client.end()
            console.log('Conexion cerrada')
        }

    }
}