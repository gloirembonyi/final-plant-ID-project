// schema.ts
import { pgTable, serial, text, varchar, integer, timestamp } from 'drizzle-orm/pg-core';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

// Define your tables
export const Plants = pgTable('plants', {
  id: serial('id').primaryKey(),
  name: varchar('name', 255).notNull(),
  scientificName: varchar('scientific_name', 255),
  commonNames: text('common_names').array(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const Diseases = pgTable('diseases', {
  id: serial('id').primaryKey(),
  name: varchar('name', 255).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const PlantDiseases = pgTable('plant_diseases', {
  id: serial('id').primaryKey(),
  plantId: integer('plant_id').notNull().references(() => Plants.id, { onDelete: 'cascade' }),
  diseaseId: integer('disease_id').notNull().references(() => Diseases.id, { onDelete: 'cascade' }),
  count: integer('count').default(1),
  lastDetected: timestamp('last_detected').defaultNow(),
});

// Database connection setup
let db;

function getDB() {
  if (!db) {
    const pool = new Pool({
      connectionString: process.env.NEXT_DRIZZLE_DATABASE_URL
    });
    db = drizzle(pool);
  }
  return db;
}

export { getDB };