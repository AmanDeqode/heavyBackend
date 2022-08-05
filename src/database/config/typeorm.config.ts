import { ConnectionOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import dotenv from 'dotenv';

dotenv.config();

export const getTypeormConfig = (baseFolder: string, migrationFolder: string) =>
  ({
    type: process.env.DB_CONNECTION,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: ['error'],
    dropSchema: false,
    namingStrategy: new SnakeNamingStrategy(),
    migrationsTableName: migrationFolder,
    migrationsTransactionMode: 'each',
    entities: [`${baseFolder}/database/entities/*{.js,.ts}`],
    migrations: [`${baseFolder}/database/${migrationFolder}/**/*{.js,.ts}`],
    cli: {
      entitiesDir: `${baseFolder}/database/entities`,
      migrationsDir: `${baseFolder}/database/${migrationFolder}`,
    },
  } as ConnectionOptions);

const baseFolder = 'dist';
const migrationFolder = 'migrations';
const typeormConfig = getTypeormConfig(baseFolder, migrationFolder);

export default typeormConfig;
