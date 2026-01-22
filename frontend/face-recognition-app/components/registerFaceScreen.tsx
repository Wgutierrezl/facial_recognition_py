import { View, TextInput, Button, Alert } from "react-native";
import CameraComponent from "./camera";
import { RegisterUser } from "@/functions/users_functions";
import { useState } from "react";

export default function RegisterFaceScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleCapture = async (file: any) => {
    const result = await RegisterUser({
      name,
      email,
      file,
    });

    if (result) {
      Alert.alert("Registro exitoso", result.name);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <TextInput placeholder="Nombre" onChangeText={setName} />
      <TextInput placeholder="Email" onChangeText={setEmail} />

      <CameraComponent onCapture={handleCapture} />
    </View>
  );
}
