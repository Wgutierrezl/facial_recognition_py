import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Camera } from 'expo-camera';
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
  const cameraRef = useRef<Camera>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const [state, setState] = useState<VerificationState>('scanning');
  const [cameraReady, setCameraReady] = useState(false);
  const [canCapture, setCanCapture] = useState(false);

  // 🔹 Pedir permisos al montar
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // 📸 Captura manual usando takePictureAsync
  const captureFace = async () => {
    try {
      if (!cameraRef.current) {
        console.log('❌ Referencia de cámara no disponible');
        Alert.alert('Error', 'Cámara no inicializada');
        return;
      }

      if (!cameraReady) {
        console.log('❌ Cámara aún no está lista');
        Alert.alert('Error', 'Por favor espera a que la cámara esté lista');
        return;
      }

      setState('loading');

      // 🔹 Pequeño delay para estabilidad
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log('📸 Capturando imagen...');
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      if (!photo || !photo.uri) {
        throw new Error('No se capturó imagen correctamente');
      }

      console.log('📸 FOTO CAPTURADA:', photo.uri);

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

    } catch (error: any) {
      console.error('❌ Error en captura facial:', error);
      setState('error');
      Alert.alert(
        'Error',
        'No se pudo capturar el rostro. Intenta nuevamente.'
      );
    }
  };

  // ❌ Sin permisos de cámara
  if (hasPermission === null) {
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

  if (hasPermission === false) {
    return (
      <Modal visible transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.container}>
            <Text style={{ color: 'white', marginBottom: 20 }}>
              Se requiere acceso a la cámara
            </Text>

            <TouchableOpacity 
              onPress={async () => {
                const { status } = await Camera.requestCameraPermissionsAsync();
                setHasPermission(status === 'granted');
              }}
            >
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

          {/* ESCANEANDO */}
          {state === 'scanning' && (
            <View style={styles.scanFrameContainer}>
              <View style={styles.scanFrame}>
                <Camera
                  ref={cameraRef}
                  type='front'
                  style={{ width: '100%', height: '100%' }}
                  onCameraReady={() => {
                    console.log('📷 Cámara lista');
                    setCameraReady(true);

                    // ⏱️ Delay para estabilidad
                    setTimeout(() => {
                      setCanCapture(true);
                    }, 1500);
                  }}
                />
              </View>

              <Text style={styles.scanningTitle}>
                Verificando rostro para marcar {actionType}
              </Text>

              {/* BOTÓN DE CAPTURA */}
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
            </View>
          )}

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