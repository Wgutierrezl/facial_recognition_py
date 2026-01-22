import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { CheckCircle, XCircle } from 'lucide-react-native';
import { styles } from '@/styles/FacialVerificationStyles';

interface FacialVerificationProps {
  actionType: 'entrada' | 'salida';
  onSuccess: (facialFile: any) => void;
  onCancel: () => void;
}

type VerificationState = 'scanning' | 'success' | 'error' | 'loading';

const FacialVerification: React.FC<FacialVerificationProps> = ({
  actionType,
  onSuccess,
  onCancel,
}) => {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [state, setState] = useState<VerificationState>('scanning');

  // 👉 pedir permiso apenas se monta
  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);

  // 👉 capturar rostro automáticamente
  useEffect(() => {
    if (!permission?.granted) return;

    const timer = setTimeout(() => {
      captureFace();
    }, 2000);

    return () => clearTimeout(timer);
  }, [permission]);

  const captureFace = async () => {
    try {
      if (!cameraRef.current) return;

      setState('loading');

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: false,
      });

      // 🔥 AQUÍ VA TU BACKEND (Rekognition)
      // const formData = new FormData();
      // formData.append('image', {
      //   uri: photo.uri,
      //   name: 'face.jpg',
      //   type: 'image/jpeg',
      // } as any);
      // await api.verifyFace(formData, actionType);

      // 👉 simulamos éxito y devolvemos el objeto photo
      setTimeout(() => {
        setState('success');
        setTimeout(() => onSuccess(photo), 1200);
      }, 1000);

    } catch (error) {
      setState('error');
    }
  };

  // ❌ sin permisos
  if (!permission || !permission.granted) {
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

          {/* ESCANEANDO */}
          {state === 'scanning' && (
            <View style={styles.scanFrameContainer}>
              <View style={styles.scanFrame}>
                <CameraView
                  ref={cameraRef}
                  facing="front"
                  style={{ width: '100%', height: '100%' }}
                />
              </View>

              <Text style={styles.scanningTitle}>
                Verificando rostro para marcar {actionType}
              </Text>
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

                <TouchableOpacity onPress={() => setState('scanning')}>
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
