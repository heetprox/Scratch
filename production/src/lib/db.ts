import { Pool } from 'pg';
import { neon, neonConfig } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

neonConfig.fetchConnectionCache = true;
neonConfig.webSocketConstructor = globalThis.WebSocket;

const DATABASE_URL = process.env.NEON_DATABASE_URL || '';

if (!DATABASE_URL) {
  console.error('NEON_DATABASE_URL environment variable is not set');
}

const sql = neon(DATABASE_URL);

let pool: Pool | null = null;

if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
  pool = new Pool({
    connectionString: DATABASE_URL,
    max: 10, 
    idleTimeoutMillis: 30000, 
  });
  console.log('PostgreSQL connection pool created');
  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
  });
}
export { sql, pool };