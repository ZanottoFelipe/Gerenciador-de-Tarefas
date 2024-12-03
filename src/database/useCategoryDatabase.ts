import { useSQLiteContext } from "expo-sqlite";

export type CategoryDatabase = {
  id: number;
  name: string;
  color: string;
};

export function useCategoryDatabase() {
  const database = useSQLiteContext();

  async function create(data: Omit<CategoryDatabase, "id">) {
    const statement = await database.prepareAsync(
      "INSERT INTO categories (name, color) VALUES ($name, $color)" // Tabela corrigida
    );
    try {
      const result = await statement.executeAsync({
        $name: data.name,
        $color: data.color,
      });
      return { insertedRowId: result.lastInsertRowId };
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function list() {
    try {
      const query = "SELECT * FROM categories";
      const response = await database.getAllAsync<CategoryDatabase>(query);

      return response;
    } catch (error) {
      throw error;
    }
  }

  async function remove(categoryId: number) {
    const statement = await database.prepareAsync(
      "DELETE FROM categories WHERE id = $id"
    );
    try {
      await statement.executeAsync({ $id: categoryId });
      return true; // Sucesso na exclusão
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function update(id: number, data: Omit<CategoryDatabase, "id">) {
    const statement = await database.prepareAsync(
      "UPDATE categories SET name = $name, color = $color WHERE id = $id"
    );
    try {
      await statement.executeAsync({
        $id: id,
        $name: data.name,
        $color: data.color,
      });
      return true; 
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  return { create, list, remove, update };
}
