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
      default: 5432,
      env: 'DB_PORT',
    },
    name: {
      doc: 'Database Name',
      format: String,
      default: 'nodejs-boilerplate',
      env: 'DB_NAME',
    },
  },
  accessTokenLifetime: {
    doc: 'Access Token Lifetime',
    format: Number,
    default: 60,
    env: 'ACCESS_TOKEN_LIFETIME_MIN',
  },
  refreshTokenLifetime: {
    doc: 'Refresh Token Lifetime',
    format: Number,
    default: 5,
    env: 'REFRESH_TOKEN_LIFETIME_MIN',
  },
  secretHex: {
    doc: 'Secret Hex',
    format: String,
    default: '7472756546692d7661756c742d4465716f6465',
    env: 'SECRET_HEX',
  },
};

dotenv.config();
const config = convict(schema);
type Config = Record<keyof typeof schema, any>;
config.validate({ allowed: 'strict' });
export { config, Config };
