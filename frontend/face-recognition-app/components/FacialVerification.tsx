import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  CameraView,
  useCameraPermissions,
} from 'expo-camera';
import { CheckCircle, XCircle } from 'lucide-react-native';
import { styles } from '@/styles/FacialVerificationStyles';
import { LogUser } from '@/functions/models/user';

interface FacialVerificationProps {
  actionType: 'entrada' | 'salida';
  onSuccess: (data: LogUser) => void;
  onCancel: () => void;
}

type VerificationState = 'scanning' | 'loading' | 'success' | 'error';

const FacialVerification: React.FC<FacialVerificationProps> = ({
  actionType,
  onSuccess,
  onCancel,
}) => {
  const cameraRef = useRef<CameraView>(null);

  // ✅ Usar el hook useCameraPermissions en lugar de la función
  const [permission, requestPermission] = useCameraPermissions();

  const [state, setState] = useState<VerificationState>('scanning');
  const [cameraReady, setCameraReady] = useState(false);
  const [canCapture, setCanCapture] = useState(false);

  // 📸 Captura manual
  const captureFace = async () => {
    try {
      // Verificación más robusta
      if (!cameraRef.current) {
        console.error('Camera ref is null');
        Alert.alert('Error', 'Cámara no inicializada');
        setState('error');
        return;
      }

      if (!cameraReady) {
        Alert.alert('Error', 'La cámara aún no está lista');
        return;
      }

      setState('loading');

      // Pequeño delay para asegurar que el estado se actualice
      await new Promise(resolve => setTimeout(resolve, 300));

      // Verificar nuevamente antes de capturar
      if (!cameraRef.current) {
        console.error('Camera ref lost during loading');
        setState('error');
        Alert.alert('Error', 'Se perdió la referencia de la cámara');
        return;
      }

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: true,
      });

      if (!photo?.uri) {
        throw new Error('No se capturó imagen');
      }

      const logUser: LogUser = {
        image: {
          uri: photo.uri,
          name: 'face.jpg',
          type: 'image/jpeg',
        },
      };

      setState('success');

      setTimeout(() => {
        onSuccess(logUser);
      }, 500);

    } catch (error) {
      console.error('Error al capturar:', error);
      setState('error');
      Alert.alert('Error', 'No se pudo capturar el rostro');
    }
  };

  // ⏳ Cargando permisos
  if (!permission) {
    return (
      <Modal visible transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.container}>
            <ActivityIndicator size="large" color="#60A5FA" />
            <Text style={{ color: 'white', marginTop: 10 }}>
              Cargando cámara...
            </Text>
          </View>
        </View>
      </Modal>
    );
  }

  // ❌ Sin permisos
  if (!permission.granted) {
    return (
      <Modal visible transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.container}>
            <Text style={{ color: 'white', marginBottom: 20 }}>
              Se requiere acceso a la cámara
            </Text>

            <TouchableOpacity onPress={requestPermission}>
              <Text style={{ color: '#60A5FA' }}>Permitir cámara</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onCancel} style={{ marginTop: 20 }}>
              <Text style={{ color: '#9CA3AF' }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>

          {/* Mantener la cámara montada siempre, solo ocultarla */}
          <View style={styles.scanFrameContainer}>
            <View 
              style={[
                styles.scanFrame, 
                state !== 'scanning' && { display: 'none' }
              ]}
            >
              <CameraView
                ref={cameraRef}
                facing="front"
                style={{ width: '100%', height: '100%' }}
                onCameraReady={() => {
                  console.log('Camera ready');
                  setCameraReady(true);
                  setTimeout(() => setCanCapture(true), 1500);
                }}
              />
            </View>

            {/* ESCANEANDO */}
            {state === 'scanning' && (
              <>
                <Text style={styles.scanningTitle}>
                  Verificando rostro para marcar {actionType}
                </Text>

                {canCapture && (
                  <TouchableOpacity
                    onPress={captureFace}
                    style={{
                      marginTop: 20,
                      paddingVertical: 12,
                      paddingHorizontal: 20,
                      backgroundColor: '#2563EB',
                      borderRadius: 12,
                    }}
                  >
                    <Text style={{ color: 'white', fontWeight: '600' }}>
                      Capturar rostro
                    </Text>
                  </TouchableOpacity>
                )}

                {!canCapture && cameraReady && (
                  <Text style={{ color: '#FCD34D', marginTop: 15 }}>
                    Preparando cámara...
                  </Text>
                )}
              </>
            )}
          </View>

          {/* CARGANDO */}
          {state === 'loading' && (
            <View style={{ alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#60A5FA" />
              <Text style={{ color: 'white', marginTop: 10 }}>
                Verificando identidad...
              </Text>
            </View>
          )}

          {/* ÉXITO */}
          {state === 'success' && (
            <View style={styles.successContainer}>
              <CheckCircle size={120} color="#22C55E" />
              <Text style={styles.successTitle}>Rostro verificado</Text>
            </View>
          )}

          {/* ERROR */}
          {state === 'error' && (
            <View style={styles.errorContainer}>
              <XCircle size={120} color="#EF4444" />
              <Text style={styles.errorTitle}>Rostro no reconocido</Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={onCancel}>
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setState('scanning');
                    setCameraReady(false);
                    setCanCapture(false);
                  }}
                >
                  <Text style={styles.retryButtonText}>Reintentar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

        </View>
      </View>
    </Modal>
  );
};

export default FacialVerification;