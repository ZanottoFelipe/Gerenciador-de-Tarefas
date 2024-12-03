import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useCategoryDatabase } from "@/database/useCategoryDatabase";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

export default function formCreatCategory() {
  const router = useRouter();
  const { id, name: initialName } = useLocalSearchParams();
  const [categoryName, setCategoryName] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const CategoryDatabase = useCategoryDatabase();

  useEffect(() => {
    // Verifica se está no modo de edição
    if (id && initialName) {
      setCategoryName(initialName);
      setIsEditing(true);
    }
  }, [id, initialName]);

  const handleSubmit = async () => {
    if (categoryName.trim() === "") {
      Alert.alert("Erro", "Por favor, insira um nome para a categoria.");
      return;
    }
    try {
      if (isEditing) {
        // Lógica para atualizar categoria
        await CategoryDatabase.update(Number(id), {
          name: categoryName,
          color: "#FFFFFF",
        });
        Alert.alert("Sucesso", "Categoria atualizada com sucesso!");
        router.push({
          pathname: "/formCreateCategory",
        });
      } else {
        // Lógica para criar categoria
        await CategoryDatabase.create({
          name: categoryName,
          color: "#FFFFFF",
        });
        Alert.alert("Sucesso", "Categoria criada com sucesso!");
      }

      setCategoryName("");
      fetchCategory();

      // Voltar para a tela anterior se estiver editando
      if (isEditing) {
        router.back();
      }
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
      Alert.alert(
        "Erro",
        `Não foi possível ${isEditing ? "atualizar" : "criar"} a categoria.`
      );
    }
  };

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const response = await CategoryDatabase.list();
      setCategorias(response);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      Alert.alert("Erro", "Não foi possível carregar as categorias.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId) => {
    try {
      await CategoryDatabase.remove(categoryId);
      Alert.alert("Sucesso", "Categoria removida com sucesso!");
      fetchCategory();
    } catch (error) {
      console.error("Erro ao remover categoria:", error);
      Alert.alert("Erro", "Não foi possível remover a categoria.");
    }
  };

  const handleEdit = (category) => {
    router.push({
      pathname: "/formCreateCategory",
      params: { id: category.id, name: category.name },
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchCategory();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isEditing ? "Editar Categoria" : "Criar Nova Categoria"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Nome da Categoria"
        value={categoryName}
        onChangeText={setCategoryName}
        placeholderTextColor="#888"
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>
          {isEditing ? "Atualizar Categoria" : "Criar Categoria"}
        </Text>
      </TouchableOpacity>

      {!isEditing && (
        <View style={styles.categories}>
          <Text style={styles.title}>Minhas Categorias</Text>
          {loading ? (
            <Text style={styles.loadingText}>Carregando categorias...</Text>
          ) : categorias.length > 0 ? (
            <FlatList
              data={categorias}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.categoryCard}>
                  <Text style={styles.categoryName}>{item.name}</Text>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      onPress={() => handleEdit(item)}
                      style={styles.iconButton}
                    >
                      <MaterialIcons name="edit" size={24} color="#4CAF50" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDelete(item.id)}
                      style={styles.iconButton}
                    >
                      <MaterialIcons name="delete" size={24} color="#FF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhuma Categoria encontrada</Text>
              <Text style={styles.emptySubtext}>
                Toque no botão acima para criar uma nova categoria.
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#121212",
    padding: 20,
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    width: "80%",
    height: 50,
    borderColor: "#444",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 15,
    marginBottom: 20,
    color: "#fff",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#4CAF50",
    width: "80%",
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  categories: {
    marginTop: 20,
    width: "100%",
  },
  categoryCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  categoryName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#FFFFFF",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#AAAAAA",
    textAlign: "center",
  },
});
