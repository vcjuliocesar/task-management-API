import { Client } from "ts-postgres";
import { DataBase } from "./types/types";

export class SqlClient {

    static instance:SqlClient | null = null

    private client:Client

    constructor(config:DataBase) {
        this.client = new Client(config)
    }

    static create(config:DataBase):SqlClient {
        if(!SqlClient.instance) {
            SqlClient.instance = new SqlClient(config)
        }

        return SqlClient.instance
    }

    async connect(){
        try {
            await this.client.connect()
        } catch (error) {
            console.error(error)
        }
    }

    async disconnect() {
        try {
            await this.client.end()
        } catch (error) {
            console.error(error)
        }
    }
}