import { type SQLiteDatabase } from "expo-sqlite";

export async function initializeDatabase(database: SQLiteDatabase) {
  // Criar a tabela de tarefas
  await database.execAsync(
    `CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      due_date TEXT,
      priority INTEGER DEFAULT 2, -- 1: Alta, 2: Média, 3: Baixa
      status INTEGER DEFAULT 2 -- 1: Trabalhando, 2: Pendente, 3: Concluida
    );`
  );

  // Criar a tabela de categorias
  await database.execAsync(
    `CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      color TEXT
    );`
  );

  // Criar a tabela para relação entre tarefas e categorias
  await database.execAsync(
    `CREATE TABLE IF NOT EXISTS task_categories (
      task_id INTEGER NOT NULL,
      category_id INTEGER NOT NULL,
      FOREIGN KEY(task_id) REFERENCES tasks(id),
      FOREIGN KEY(category_id) REFERENCES categories(id),
      PRIMARY KEY (task_id, category_id)
    );`
  );
  await database.execAsync(
    `CREATE TABLE IF NOT EXISTS deleted_tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      due_date TEXT,
      priority INTEGER,
      status INTEGER,
      deleted_at TEXT
    );`
  );
}
