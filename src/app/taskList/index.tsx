import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { useTaskDatabase } from "@/database/useTaskDatabase";
import { useFocusEffect } from "@react-navigation/native";

const TaskCard = ({ task, onPress }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 1:
        return "#FF4444";
      case 2:
        return "#FFB01F";
      case 3:
        return "#4CAF50";
      default:
        return "#FFB01F";
    }
  };

  const getStatusText = (status) => {
    switch (Number(status)) {
      case 1:
        return "Pendente";
      case 2:
        return "Concluída";
      case 3:
        return "Trabalhando";
      default:
        return "Erro";
    }
  };

  const isOverdue = new Date(task.due_date) < new Date() && task.status !== "2";

  return (
    <TouchableOpacity style={styles.taskCard} onPress={onPress}>
      <View
        style={[
          styles.priorityIndicator,
          { backgroundColor: getPriorityColor(task.priority) },
        ]}
      />
      <View style={[styles.taskContent, isOverdue && styles.overdueCard]}>
        <Text style={styles.taskTitle} numberOfLines={1}>
          {task.title}
        </Text>
        <Text style={styles.taskDescription} numberOfLines={2}>
          {task.description}
        </Text>
        <View style={styles.taskFooter}>
          <Text style={styles.taskDate}>
            {new Date(task.due_date).toLocaleDateString()}
          </Text>
          <Text
            style={[
              styles.taskStatus,
              { color: Number(task.status) === 2 ? "#4CAF50" : "#FFB01F" },
            ]}
          >
            {getStatusText(task.status)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const taskDatabase = useTaskDatabase();

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskDatabase.list();
      setTasks(response);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchTasks();
    }, [])
  );

  const handleTaskPress = (taskId) => {
    router.push({
      pathname: "/details/[id]",
      params: { id: taskId },
    });
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase())
  );

  const groupedTasks = filteredTasks.reduce((groups, task) => {
    const date = new Date(task.due_date).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(task);
    return groups;
  }, {});

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Carregando tarefas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Tarefas</Text>

      {/* Barra de pesquisa */}
      <TextInput
        style={styles.searchBar}
        placeholder="Pesquisar tarefas..."
        placeholderTextColor="#888"
        value={search}
        onChangeText={setSearch}
      />

      {Object.keys(groupedTasks).length > 0 ? (
        <FlatList
          data={Object.keys(groupedTasks)}
          keyExtractor={(item) => item}
          renderItem={({ item: date }) => (
            <View>
              <Text style={styles.groupTitle}>{date}</Text>
              {groupedTasks[date].map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onPress={() => handleTaskPress(task.id)}
                />
              ))}
            </View>
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhuma tarefa encontrada</Text>
          <Text style={styles.emptySubtext}>
            Toque no botão abaixo para criar uma nova tarefa
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/taskForm")}
      >
        <Text style={styles.addButtonText}>+ Nova Tarefa</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
    textAlign: "center",
  },
  searchBar: {
    backgroundColor: "#1E1E1E",
    color: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  listContainer: {
    paddingBottom: 80,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  taskCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: "row",
    overflow: "hidden",
  },
  priorityIndicator: {
    width: 4,
    height: "100%",
  },
  taskContent: {
    flex: 1,
    padding: 12,
  },

  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: "#AAAAAA",
    marginBottom: 8,
  },
  taskFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskDate: {
    fontSize: 12,
    color: "#888888",
  },
  taskStatus: {
    fontSize: 12,
    fontWeight: "500",
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
  addButton: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
  },
});

export default TaskList;
