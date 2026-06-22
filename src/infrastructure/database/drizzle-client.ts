import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../schemas/schema';

const connectionString = process.env.DATABASE_URL!;

// Previne a criação de múltiplas conexões em ambiente de desenvolvimento (Hot Reload do Next.js)
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });