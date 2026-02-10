import dotenv from "dotenv"
dotenv.config()

class DBConfig {
    constructor() {
        return {
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT) || 3306,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DATABASE,
            charset: "utf8mb4"   
        }
    }
}

const config: any = {
    port: process.env.PORT || 3000,
    database: new DBConfig()
}

export default config;
