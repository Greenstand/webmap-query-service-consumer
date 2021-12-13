export default async function globalSetup() {
  process.env.DATABASE_URL = 'postgresql://postgres:passwrd@0.0.0.0/postgres'
  process.env.DATABASE_SCHEMA = 'map_features'
  process.env.RABBIT_MQ_URL = 'amqp://guest:guest@localhost'
}
