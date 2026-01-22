import { View, Text, Alert } from "react-native";
import CameraComponent from "./camera";
import { GetUserByFaceId } from "@/functions/users_functions";

export default function LoginFaceScreen({ onLogin }: any) {
  const handleCapture = async (image: any) => {
    const result = await GetUserByFaceId({ image });
    console.log(result)

    if (result) {
      Alert.alert("Bienvenido", `Hola ${result.name}`);
      localStorage.setItem('token',result.token)
      localStorage.setItem('role',result.rol)
      localStorage.setItem('user_id',result.user_id)
      localStorage.setItem('name',result.name)
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
