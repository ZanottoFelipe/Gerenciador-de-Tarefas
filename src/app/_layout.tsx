import { SQLiteProvider } from "expo-sqlite";
import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { initializeDatabase } from "@/database/initializeDatabase";

export default function Layout() {
  return (
    <SQLiteProvider databaseName="task_manager.db" onInit={initializeDatabase}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#4CAF50",
          tabBarInactiveTintColor: "#888888",
          headerStyle: {
            backgroundColor: "#121212",
          },
          headerTintColor: "#dedede",
          headerTitleStyle: {
            color: "#FFFFFF",
          },
          tabBarStyle: {
            backgroundColor: "#121212",
            borderTopWidth: 0,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Início",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="home" color={color} size={size} />
            ),
            tabBarLabelStyle: {
              fontSize: 12,
              color: "#dedede",
            },
          }}
        />
        <Tabs.Screen
          name="taskList"
          options={{
            title: "Minhas Tarefas",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="list" color={color} size={size} />
            ),
            tabBarLabelStyle: {
              fontSize: 12,
              color: "#dedede",
            },
          }}
        />
        <Tabs.Screen
          name="formCreateCategory"
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="category" color={color} size={size} />
            ),
            tabBarLabelStyle: {
              fontSize: 12,
              color: "#dedede",
            },
          }}
        />
        <Tabs.Screen
          name="groupMembers"
          options={{
            title: "Membros do Grupo",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="group" color={color} size={size} />
            ),
            tabBarLabelStyle: {
              fontSize: 12,
              color: "#dedede",
            },
          }}
        />
        <Tabs.Screen
          name="details/[id]"
          options={{
            tabBarButton: () => null,
          }}
        />
      </Tabs>
    </SQLiteProvider>
  );
}
