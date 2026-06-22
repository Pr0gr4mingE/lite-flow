import { pgTable, serial, varchar, timestamp, integer, boolean } from 'drizzle-orm/pg-core';

// 1. Tabela de Leads
export const leads = pgTable('leads', {
  id: serial('id').primaryKey(),
  nome: varchar('nome', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  origem: varchar('origem', { length: 100 }),
  status: varchar('status', { length: 50 }).notNull().default('Novo'),
  criadoEm: timestamp('criado_em').defaultNow(),
});

// 2. Tabela de Clientes
export const clientes = pgTable('clientes', {
  id: serial('id').primaryKey(),
  nome: varchar('nome', { length: 255 }).notNull(),
  empresa: varchar('empresa', { length: 255 }).notNull(),
  telefone: varchar('telefone', { length: 20 }),
  // Ligação opcional de volta para o Lead que o originou
  leadOrigemId: integer('lead_origem_id').references(() => leads.id),
});

// 3. Tabela de Negociações (O Coração do Kanban)
export const negociacoes = pgTable('negociacoes', {
  id: serial('id').primaryKey(),
  titulo: varchar('titulo', { length: 255 }).notNull(),
  valor: integer('valor').notNull(), // Guardamos em centavos para evitar erro de float
  etapa: varchar('etapa', { length: 50 }).notNull().default('Prospecção'),
  // Chave Estrangeira: A qual cliente essa negociação pertence?
  clienteId: integer('cliente_id').references(() => clientes.id).notNull(),
  criadoEm: timestamp('criado_em').defaultNow(),
});

// 4. Tabela de Tarefas
export const tarefas = pgTable('tarefas', {
  id: serial('id').primaryKey(),
  descricao: varchar('descricao', { length: 500 }).notNull(),
  prazo: timestamp('prazo').notNull(),
  concluida: boolean('concluida').default(false).notNull(),
  // Chave Estrangeira: A qual negociação essa tarefa está atrelada?
  negociacaoId: integer('negociacao_id').references(() => negociacoes.id).notNull(),
});