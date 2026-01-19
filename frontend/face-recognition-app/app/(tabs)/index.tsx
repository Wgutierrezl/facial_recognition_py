import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import LoginFaceScreen from "@/components/loginFaceScreen";
import RegisterFaceScreen from "@/components/registerFaceScreen";

export default function HomeScreen() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <View style={styles.container}>
      {/* Header simple */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setMode("login")}>
          <Text
            style={[
              styles.tab,
              mode === "login" && styles.activeTab,
            ]}
          >
            Iniciar sesión
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setMode("register")}>
          <Text
            style={[
              styles.tab,
              mode === "register" && styles.activeTab,
            ]}
          >
            Registrarse
          </Text>
        </TouchableOpacity>
      </View>

      {/* Contenido */}
      <View style={styles.content}>
        {mode === "login" ? (
          <LoginFaceScreen onLogin={() => console.log("Login exitoso")} />
        ) : (
          <RegisterFaceScreen />
        )}
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 50,
    gap: 30,
  },
  tab: {
    fontSize: 18,
    color: "#888",
  },
  activeTab: {
    color: "#000",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  content: {
    flex: 1,
    marginTop: 10,
  },
});
