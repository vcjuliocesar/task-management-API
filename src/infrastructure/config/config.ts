import * as dotenv from 'dotenv';
import { DatabaseConfig } from "./interfaces/database-config";

dotenv.config();

export const Config:DatabaseConfig = {
    user: process.env.DATABASE_USER || 'postgres',
    database: process.env.DATABASE_NAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'password',
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT) || 5432,
}