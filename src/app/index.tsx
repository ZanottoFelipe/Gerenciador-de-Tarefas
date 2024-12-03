import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons"; // Importando ícones

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao Gerenciador de Tarefas!</Text>

      {/* Container dos botões superiores */}
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/taskList")}
        >
          <MaterialIcons name="list" size={30} color="#fff" />
          <Text style={styles.buttonText}>Ir para a lista de tarefas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/taskForm")}
        >
          <MaterialIcons name="add-box" size={30} color="#fff" />
          <Text style={styles.buttonText}>Adicionar nova tarefa</Text>
        </TouchableOpacity>
      </View>

      {/* Container dos botões inferiores */}
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/formCreateCategory")}
        >
          <MaterialIcons name="category" size={30} color="#fff" />
          <Text style={styles.buttonText}>Nova Categoria</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/grupMembres")}
        >
          <MaterialIcons name="group" size={30} color="#fff" />
          <Text style={styles.buttonText}>Membros do grupo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // Tema escuro
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    color: "#FFFFFF", // Texto branco
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  row: {
    flexDirection: "row", // Alinha os elementos horizontalmente
    justifyContent: "space-between", // Espaçamento entre os botões
    marginVertical: 20, // Espaço entre as linhas
    width: "100%", // Ocupar a largura completa
    paddingHorizontal: 20, // Margem lateral para alinhar melhor
  },
  button: {
    flex: 1, // Permite que cada botão ocupe espaço igual
    marginHorizontal: 10, // Espaço entre os botões
    backgroundColor: "#333", // Cor de fundo do botão
    borderRadius: 10, // Bordas arredondadas
    padding: 20, // Aumentando o tamanho do botão
    alignItems: "center", // Alinhamento do conteúdo do botão
    justifyContent: "center", // Alinhamento vertical do conteúdo do botão
  },
  buttonText: {
    color: "#fff", // Cor do texto
    fontSize: 16,
    marginTop: 10, // Espaçamento entre o ícone e o texto
    fontWeight: "bold",
  },
});
