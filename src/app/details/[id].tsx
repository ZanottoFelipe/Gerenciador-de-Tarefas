import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTaskDatabase } from "@/database/useTaskDatabase";
import { Picker } from "@react-native-picker/picker";

export default function TaskDetails() {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedStatus, setEditedStatus] = useState(null);
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const taskDatabase = useTaskDatabase();

  useEffect(() => {
    const loadTask = async () => {
      try {
        const taskId = Number(id);

        if (isNaN(taskId)) {
          throw new Error("ID da tarefa inválido");
        }

        const fetchedTask = await taskDatabase.getById(taskId);

        if (!fetchedTask) {
          throw new Error("Tarefa não encontrada");
        }

        setTask(fetchedTask);
        setEditedStatus(String(fetchedTask.status));
        setError(null);
      } catch (err) {
        console.error("Erro ao carregar tarefa:", err);
        setError(err.message);
        setTask(null);
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [id]);

  const handleUpdateStatus = async () => {
    try {
      await taskDatabase.update({
        ...task,
        status: Number(editedStatus),
      });
      setTask((prev) => ({ ...prev, status: Number(editedStatus) }));
      setEditMode(false);
      Alert.alert("Sucesso", "Status da tarefa atualizado!");
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      Alert.alert("Erro", "Não foi possível atualizar o status.");
    }
  };

  const handleDeleteTask = () => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir esta tarefa?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              // Chama a função de remoção, que agora move a tarefa para deleted_tasks
              await taskDatabase.remove(Number(id));
              router.push("/taskList");
              Alert.alert("Sucesso", "Tarefa excluída com sucesso!");
            } catch (error) {
              console.error("Erro ao excluir tarefa:", error);
              Alert.alert("Erro", "Não foi possível excluir a tarefa.");
            }
          },
        },
      ]
    );
  };

  const handleEditTask = () => {
    router.push({
      pathname: "/taskForm",
      params: { id: id },
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Erro: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalhes da Tarefa</Text>
      <View style={styles.taskDetails}>
        <Text style={styles.label}>Título:</Text>
        <Text style={styles.value}>{task.title}</Text>

        <Text style={styles.label}>Descrição:</Text>
        <Text style={styles.value}>{task.description}</Text>

        <Text style={styles.label}>Data de Vencimento:</Text>
        <Text style={styles.value}>
          {new Date(task.due_date).toLocaleDateString()}
        </Text>

        <Text style={styles.label}>Prioridade:</Text>
        <Text style={styles.value}>
          {task.priority === 1
            ? "Alta"
            : task.priority === 2
            ? "Média"
            : "Baixa"}
        </Text>

        <Text style={styles.label}>Status:</Text>
        {editMode ? (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={editedStatus}
              onValueChange={(value) => setEditedStatus(value)}
              style={styles.picker}
            >
              <Picker.Item label="Pendente" value="1" />
              <Picker.Item label="Concluído" value="2" />
              <Picker.Item label="Trabalhando" value="3" />
            </Picker>
            <TouchableOpacity
              style={styles.saveStatusButton}
              onPress={handleUpdateStatus}
            >
              <Text style={styles.saveStatusButtonText}>Salvar Status</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.value}>
            {task.status === 1
              ? "Pendente"
              : task.status === 2
              ? "Concluído"
              : "Trabalhando"}
          </Text>
        )}

        <View style={styles.actionButtonsContainer}>
          {!editMode && (
            <>
              <TouchableOpacity
                style={styles.editStatusButton}
                onPress={() => setEditMode(true)}
              >
                <Text style={styles.actionButtonText}>Alterar Status</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.editButton}
                onPress={handleEditTask}
              >
                <Text style={styles.actionButtonText}>Editar Tarefa</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDeleteTask}
              >
                <Text style={styles.actionButtonText}>Excluir Tarefa</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 16,
    justifyContent: "space-between", // Alinha os elementos corretamente
  },
  taskDetails: {
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    padding: 16,
    flex: 1, // Garante que ocupe todo o espaço disponível
  },
  actionButtonsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    flexDirection: "column",
    gap: 10,
    backgroundColor: "#121212",
  },
  actionButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  pickerContainer: {
    marginVertical: 10,
  },
  picker: {
    backgroundColor: "#1E1E1E",
    color: "#FFFFFF",
  },
  saveStatusButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  saveStatusButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  completeButton: {
    padding: 8,
  },
  description: {
    color: "#AAAAAA",
    fontSize: 16,
    marginBottom: 16,
  },
  infoContainer: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    color: "#888888",
    fontSize: 14,
  },
  value: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2C",
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 4,
  },
  editStatusButton: {
    backgroundColor: "#FFA500", // Laranja
    padding: 12,
    borderRadius: 8,
  },
  editButton: {
    backgroundColor: "#4CAF50", // Verde
    padding: 12,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: "#FF4444", // Vermelho
    padding: 12,
    borderRadius: 8,
  },
  loadingText: {
    color: "#FFFFFF",
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
  },
  errorText: {
    color: "#FF4444",
    fontSize: 16,
    textAlign: "center",
  },
});
