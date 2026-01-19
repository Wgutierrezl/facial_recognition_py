import { View, Text, Alert } from "react-native";
import CameraComponent from "./camera";
import { GetUserByFaceId } from "@/functions/functions";

export default function LoginFaceScreen({ onLogin }: any) {
  const handleCapture = async (image: any) => {
    const result = await GetUserByFaceId({ image });

    if (result) {
      Alert.alert("Bienvenido", `Hola ${result.name}`);
      onLogin();
    } else {
      Alert.alert("Error", "Rostro no reconocido");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ textAlign: "center", marginTop: 20, fontSize: 18 }}>
        Escanea tu rostro
      </Text>

      <CameraComponent onCapture={handleCapture} />
    </View>
  );
}
