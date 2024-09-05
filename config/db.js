// config/db.js
// db.js
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { schema } from './schema';

const pool = new Pool({
  connectionString: process.env.NEXT_DRIZZLE_DATABASE_URL, // Load the database URL from your environment
});

const db = drizzle(pool, { schema });

export default db;
