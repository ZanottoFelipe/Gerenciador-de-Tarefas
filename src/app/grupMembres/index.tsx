import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function GroupMembers() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Membros do Grupo</Text>

      {/* Lista fixa de membros */}
      <View style={styles.memberItem}>
        <Text style={styles.memberText}>Felipe Zanotto</Text>
      </View>

      {/* Botão para voltar */}
      <TouchableOpacity style={styles.button} onPress={() => router.push("/")}>
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  memberItem: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  memberText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#4CAF50", // Mantém o fundo escuro como no estilo do botão TaskList
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff", // Texto branco como no estilo TaskList
    fontSize: 16,
    fontWeight: "bold",
  },
});
