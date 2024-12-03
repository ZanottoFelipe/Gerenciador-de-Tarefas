import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  StyleSheet,
  Text,
  Alert,
  Platform,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTaskDatabase } from "@/database/useTaskDatabase";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { TextInput } from "react-native-paper";
import { useCategoryDatabase } from "@/database/useCategoryDatabase";

export default function TaskForm() {
  const router = useRouter();
  const taskDatabase = useTaskDatabase();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [priority, setPriority] = useState("1");
  const [categorias, setCategorias] = useState([]); // Alterado para ser uma lista de categorias
  const [selectedCategory, setSelectedCategory] = useState(""); // Estado para a categoria selecionada
  const [status, setStatus] = useState("1");
  const CategoryDatabase = useCategoryDatabase();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const params = useLocalSearchParams();
  const taskId = params.id ? Number(params.id) : null;

  useEffect(() => {
    if (taskId) {
      fetchCategory();
      const fetchTask = async () => {
        const task = await taskDatabase.getById(taskId);
        if (task) {
          setTitle(task.title);
          setDescription(task.description);
          setDueDate(new Date(task.due_date));
          setPriority(String(task.priority));
          setStatus(String(task.status));
          setSelectedCategory(task.category); // Definir categoria ao editar
        }
      };
      fetchTask();
    }
  }, [taskId]);

  useFocusEffect(
    React.useCallback(() => {
      fetchCategory();
    }, [])
  );
  const fetchCategory = async () => {
    try {
      const response = await CategoryDatabase.list();
      setCategorias(response); // Preencher as categorias do banco de dados
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      Alert.alert("Erro", "Não foi possível carregar as categorias.");
    }
  };

  const handleSave = async () => {
    if (!title || !priority || !selectedCategory) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const taskData = {
      title,
      description,
      due_date: dueDate.toISOString().split("T")[0],
      priority: Number(priority),
      status: Number(status),
      category: selectedCategory, // Salvar categoria selecionada
    };

    try {
      if (taskId) {
        await taskDatabase.update({ id: taskId, ...taskData });
        Alert.alert("Sucesso", "Tarefa atualizada com sucesso!");
      } else {
        await taskDatabase.create(taskData);
        Alert.alert("Sucesso", "Tarefa criada com sucesso!");
      }
      router.push("/taskList");
    } catch (error) {
      console.error("Erro ao salvar tarefa:", error);
      Alert.alert("Erro", "Não foi possível salvar a tarefa.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {taskId ? "Editar Tarefa" : "Nova Tarefa"}
      </Text>

      <TextInput
        style={styles.input}
        label="Título"
        value={title}
        onChangeText={setTitle}
        mode="outlined"
        theme={{
          colors: {
            text: "#ffff",
            primary: "#4CAF50",
            background: "#1E1E1E",
          },
        }}
      />

      <TextInput
        style={styles.input}
        label="Descrição"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        mode="outlined"
        theme={{
          colors: {
            primary: "#4CAF50",
            text: "#fff",
            background: "#1E1E1E",
          },
        }}
      />

      <View>
        <Button
          title={`Selecionar Data: ${dueDate.toISOString().split("T")[0]}`}
          onPress={() => setShowDatePicker(true)}
          color="#4CAF50"
        />
        {showDatePicker && (
          <DateTimePicker
            value={dueDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              if (selectedDate) {
                setDueDate(selectedDate);
              }
              setShowDatePicker(false);
            }}
          />
        )}
      </View>

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Prioridade*</Text>
        <Picker
          selectedValue={priority}
          onValueChange={(value) => setPriority(value)}
          style={styles.picker}
          dropdownIconColor="#8c2e2e"
        >
          <Picker.Item label="Alta" value="1" />
          <Picker.Item label="Média" value="2" />
          <Picker.Item label="Baixa" value="3" />
        </Picker>
      </View>

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Categoria*</Text>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(value) => setSelectedCategory(value)}
          style={styles.picker}
          dropdownIconColor="#8c2e2e"
        >
          {categorias.length > 0 ? (
            categorias.map((categoria) => (
              <Picker.Item
                key={categoria.id}
                label={categoria.name}
                value={categoria.id}
              />
            ))
          ) : (
            <Picker.Item label="Sem categorias disponíveis" value="" />
          )}
        </Picker>
      </View>

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Status*</Text>
        <Picker
          selectedValue={status}
          onValueChange={(value) => setStatus(value)}
          style={styles.picker}
          dropdownIconColor="#8c2e2e"
        >
          <Picker.Item label="Pendente" value="1" />
          <Picker.Item label="Concluído" value="2" />
          <Picker.Item label="Trabalhando" value="3" />
        </Picker>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Salvar" color="#4CAF50" onPress={handleSave} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20, // Espaçamento interno para evitar sobreposição
  },
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    padding: 10,
    color: "#FFFFFF",
    borderColor: "#eae7e7",
  },
  pickerContainer: {
    marginVertical: 15,
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    padding: 10,
  },
  picker: {
    color: "#FFFFFF",
  },
  label: {
    color: "#AAAAAA",
    marginBottom: 5,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 50, // Espaço extra para evitar corte do botão
  },
});
