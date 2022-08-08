import convict from 'convict';
import dotenv from 'dotenv';

const schema = {
  app: {
    name: {
      doc: 'Name of the service',
      format: String,
      default: 'nodejs-boilerplate',
    },
    base_url: {
      doc: 'Base URL of platform',
      format: String,
      default: '',
      env: 'BASE_URL',
    },
    port: {
      doc: 'The port to bind.',
      format: 'port',
      default: 3000,
      env: 'PORT',
    },
  },
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'staging', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
  postgreSql: {
    connection: {
      doc: 'Connection Type',
      format: String,
      default: 'postgres',
      env: 'DB_CONNECTION',
    },
    user: {
      doc: 'Database User',
      format: String,
      default: 'postgres',
      env: 'DB_USER',
    },
    password: {
      doc: 'Database password',
      format: String,
      default: 'postgres',
      env: 'DB_PASSWORD',
    },
    host: {
      doc: 'Database Host',
      format: String,
      default: 'localhost',
      env: 'DB_HOST',
    },
    port: {
      doc: 'Database Port Number',
      format: Number,
      default: 5436,
      env: 'DB_PORT',
    },
    name: {
      doc: 'Database Name',
      format: String,
      default: 'heavyDB',
      env: 'DB_NAME',
    },
  },
};

dotenv.config();
const config = convict(schema);
type Config = Record<keyof typeof schema, any>;
config.validate({ allowed: 'strict' });
export { config, Config };
