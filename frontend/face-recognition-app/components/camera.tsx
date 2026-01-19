import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function CameraComponent({ onCapture }: any) {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);

  if (!permission) return <Text>Cargando...</Text>;

  if (!permission.granted) {
    return (
      <View>
        <Text>Se necesita permiso de cámara</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text>Dar permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    const photo = await cameraRef.current.takePictureAsync({
      quality: 0.5,
      skipProcessing: true,
    });

    onCapture({
      uri: photo.uri,
      name: "face.jpg",
      type: "image/jpeg",
    });
  };

  return (
    <CameraView
      ref={cameraRef}
      style={{ flex: 1 }}
      facing="front"   // 👈 ESTA ES LA CLAVE
    >
      <TouchableOpacity
        onPress={takePicture}
        style={{
          position: "absolute",
          bottom: 40,
          alignSelf: "center",
          backgroundColor: "white",
          padding: 12,
          borderRadius: 10,
        }}
      >
        <Text>Escanear rostro</Text>
      </TouchableOpacity>
    </CameraView>
  );
}
