import dotenv from 'dotenv'

dotenv.config()
export default function globalSetup() {
  process.env.DATABASE_URL ??= 'postgresql://postgres:password@0.0.0.0/postgres'
  process.env.DATABASE_SCHEMA ??= 'map_features'
  process.env.RABBITMQ_URL ??= 'amqp://guest:guest@localhost'
  process.env.STAKEHOLDER_API_ROUTE ??= 'http://localhost/stakeholder'
}
