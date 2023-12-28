import { DatabaseConfig } from '../config/interfaces/database-config'

export interface DataBaseDto extends Omit<DatabaseConfig, 'database'>{}