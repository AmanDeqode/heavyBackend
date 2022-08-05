import { ConnectionOptions } from 'typeorm';
import dotenv from 'dotenv';
import { getTypeormConfig } from './typeorm.config';

dotenv.config();

const baseFolder = process.env.NODE_ENV !== 'production' ? 'src' : 'dist';
const migrationFolder = 'seeds';
const typeormConfig: ConnectionOptions = getTypeormConfig(
  baseFolder,
  migrationFolder,
);

export default typeormConfig;
