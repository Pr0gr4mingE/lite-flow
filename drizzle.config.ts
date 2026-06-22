import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/infrastructure/schemas/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    // Cole sua URL real aqui entre aspas, apenas para rodar a migração
    url: "postgresql://usuario:senha@seu-host.com/banco?sslmode=require", 
  },
});