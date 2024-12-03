import React from "react";
import { View, Text, Button } from "react-native";
import { TaskDatabase } from "@/database/useTaskDatabase";

interface TaskProps {
  task: TaskDatabase;
  onPress: () => void;
}

export const Task: React.FC<TaskProps> = ({ task, onPress }) => {
  return (
    <View
      style={{
        marginBottom: 12,
        padding: 12,
        backgroundColor: "#f1f1f1",
        borderRadius: 8,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>{task.title}</Text>
      <Text>{task.description}</Text>
      <Text>Status: {task.status}</Text>
      <Button title="Ver Detalhes" onPress={onPress} />
    </View>
  );
};
