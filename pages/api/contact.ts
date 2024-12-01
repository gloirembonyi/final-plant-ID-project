import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import {
  pgTable,
  serial,
  text,
  timestamp,
  varchar
} from 'drizzle-orm/pg-core';

// Configure NeonDB
neonConfig.fetchConnectionCache = true;

// Define your database schema
const contactSubmissions = pgTable('contact_submissions', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  company: text('company'),
  message: text('message').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Initialize the database connection
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set');
}

const sqlClient = neon(databaseUrl);
const db = drizzle(sqlClient);

// Function to handle form submission
export async function submitContactForm(formData: {
  name: string;
  email: string;
  company: string;
  message: string;
}) {
  try {
    const result = await db.insert(contactSubmissions).values(formData).returning();
    console.log('Form submitted successfully:', result);
    return { success: true, data: result[0] };
  } catch (error) {
    console.error('Error submitting form:', error);
    return { success: false, error: 'Failed to submit form' };
  }
}

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { name, email, company, message } = req.body;
      const result = await submitContactForm({ name, email, company, message });
      
      if (result.success) {
        res.status(200).json({ message: 'Form submitted successfully', data: result.data });
      } else {
        console.error('Form submission failed:', result.error);
        res.status(500).json({ message: 'Failed to submit form', error: result.error });
      }
    } catch (error) {
      console.error('Unexpected error in API route:', error);
      if (error instanceof Error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error', error: String(error) });
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
