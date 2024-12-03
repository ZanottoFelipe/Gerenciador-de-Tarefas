import { useSQLiteContext } from "expo-sqlite";

export type TaskDatabase = {
  id: number;
  title: string;
  description: string;
  due_date: string;
  priority: number;
  status: number;
};

export function useTaskDatabase() {
  const database = useSQLiteContext();
  console.log("Database context:", database);

  async function create(data: Omit<TaskDatabase, "id">) {
    if (!data.title || !data.priority) {
      throw new Error("Título e prioridade são obrigatórios");
    }

    const statement = await database.prepareAsync(
      `INSERT INTO tasks 
      (title, description, due_date, priority, status) 
      VALUES ($title, $description, $due_date, $priority, $status)`
    );
    try {
      const result = await statement.executeAsync({
        $title: data.title,
        $description: data.description || "",
        $due_date: data.due_date,
        $priority: data.priority,
        $status: data.status,
      });
      return { insertedRowId: result.lastInsertRowId };
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function update(data: TaskDatabase) {
    if (!data.id) {
      throw new Error("ID da tarefa é obrigatório para atualização");
    }

    if (!data.title || !data.priority) {
      throw new Error("Título e prioridade são obrigatórios");
    }

    const statement = await database.prepareAsync(
      `UPDATE tasks 
      SET title = $title, 
          description = $description, 
          due_date = $due_date, 
          priority = $priority, 
          status = $status 
      WHERE id = $id`
    );
    try {
      await statement.executeAsync({
        $id: data.id,
        $title: data.title,
        $description: data.description || "",
        $due_date: data.due_date,
        $priority: data.priority,
        $status: data.status,
      });
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  // Remove uma tarefa pelo ID
  async function remove(id: number) {
    const task = await getById(id); // Obtém a tarefa antes de excluir

    if (!task) {
      throw new Error("Tarefa não encontrada para exclusão");
    }

    // Define as variáveis de statement antes do bloco try
    let statementInsert;
    let statementDelete;

    try {
      // Insere a tarefa na tabela deleted_tasks
      statementInsert = await database.prepareAsync(
        `INSERT INTO deleted_tasks 
      (id, title, description, due_date, priority, status, deleted_at) 
      VALUES ($id, $title, $description, $due_date, $priority, $status, $deleted_at)`
      );
      await statementInsert.executeAsync({
        $id: task.id,
        $title: task.title,
        $description: task.description || "",
        $due_date: task.due_date,
        $priority: task.priority,
        $status: task.status,
        $deleted_at: new Date().toISOString(), // Armazena o momento da exclusão
      });

      // Remove a tarefa da tabela principal
      statementDelete = await database.prepareAsync(
        "DELETE FROM tasks WHERE id = $id"
      );
      await statementDelete.executeAsync({ $id: id });
    } catch (error) {
      console.error("Erro ao mover a tarefa para a tabela excluída:", error);
      throw error;
    } finally {
      // Finaliza os statements para garantir o fechamento correto
      if (statementInsert) {
        await statementInsert.finalizeAsync();
      }
      if (statementDelete) {
        await statementDelete.finalizeAsync();
      }
    }
  }

  // Lista todas as tarefas
  async function list() {
    const query = "SELECT * FROM tasks ORDER BY due_date ASC"; // Ordena por data de vencimento
    try {
      const response = await database.getAllAsync<TaskDatabase>(query);
      console.log("Dados retornados do banco:", response);
      return response;
    } catch (error) {
      console.error("Error listing tasks:", error);
      throw error;
    }
  }

  // Busca uma tarefa por ID
  async function getById(id: number) {
    console.log("Buscando tarefa com ID:", id);

    if (!id) {
      console.error("ID inválido:", id);
      return null;
    }

    try {
      // Use getAllAsync para buscar o primeiro resultado
      const result = await database.getAllAsync<TaskDatabase>(
        "SELECT * FROM tasks WHERE id = ? LIMIT 1",
        [id]
      );

      console.log("Resultado da consulta:", result);

      // Retorna o primeiro item ou null se não encontrar
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error("Erro ao buscar tarefa por ID:", error);
      throw error;
    }
  }
  return { create, update, remove, list, getById };
}
