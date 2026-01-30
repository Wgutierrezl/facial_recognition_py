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
            <Text style={{ color: 'white', marginBottom: 20, textAlign: 'center', fontSize: 16 }}>
              Se requiere acceso a la cámara
            </Text>

            <TouchableOpacity 
              onPress={requestPermission}
              style={styles.retryButton}
            >
              <Text style={styles.retryButtonText}>Permitir cámara</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={onCancel} 
              style={[styles.cancelButton, { marginTop: 12 }]}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
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

          {/* Mantener la cámara SIEMPRE montada - solo ocultar visualmente */}
          <View style={[
            styles.cameraWrapper,
            state !== 'scanning' && { position: 'absolute', opacity: 0, pointerEvents: 'none' }
          ]}>
            <View style={styles.scanFrame}>
              <CameraView
                ref={cameraRef}
                facing="front"
                style={styles.camera}
                onCameraReady={() => {
                  console.log('Camera ready');
                  setCameraReady(true);
                  setTimeout(() => setCanCapture(true), 1500);
                }}
              />
            </View>

            {/* Indicador de progreso circular */}
            {cameraReady && !canCapture && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#60A5FA" />
              </View>
            )}
          </View>

          {/* ESCANEANDO */}
          {state === 'scanning' && (
            <View style={styles.scanningContainer}>
              {/* Título principal */}
              <Text style={styles.scanningTitle}>
                Control de Asistencia
              </Text>
              
              <Text style={styles.scanningSubtitle}>
                Verificando rostro para marcar {actionType}
              </Text>

              {/* Espacio para la cámara que está arriba */}
              <View style={{ height: 340, marginBottom: 32 }} />

              {/* Botón de captura */}
              {canCapture ? (
                <TouchableOpacity
                  onPress={captureFace}
                  style={styles.captureButton}
                >
                  <Text style={styles.captureButtonText}>
                    Capturar rostro
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.preparingContainer}>
                  <ActivityIndicator size="small" color="#FCD34D" />
                  <Text style={styles.preparingText}>
                    Preparando cámara...
                  </Text>
                </View>
              )}

              {/* Botón cancelar en la parte inferior */}
              <TouchableOpacity 
                onPress={onCancel}
                style={styles.bottomCancelButton}
              >
                <Text style={styles.bottomCancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* CARGANDO */}
          {state === 'loading' && (
            <View style={styles.loadingContainer}>
              <View style={styles.loadingIconBox}>
                <ActivityIndicator size="large" color="#ffffff" />
              </View>
              <View style={styles.loadingCard}>
                <Text style={styles.loadingTitle}>
                  Verificando identidad
                </Text>
                <Text style={styles.loadingSubtitle}>
                  Por favor espera un momento...
                </Text>
              </View>
            </View>
          )}

          {/* ÉXITO */}
          {state === 'success' && (
            <View style={styles.successContainer}>
              <View style={styles.successIconBox}>
                <CheckCircle size={64} color="#ffffff" />
              </View>
              <View style={styles.successCard}>
                <Text style={styles.successTitle}>¡Rostro verificado!</Text>
                <Text style={styles.successSubtitle}>
                  {actionType === 'entrada' ? 'Entrada' : 'Salida'} registrada correctamente
                </Text>
                <Text style={styles.successDescription}>
                  Tu asistencia ha sido marcada con éxito
                </Text>
              </View>
            </View>
          )}

          {/* ERROR */}
          {state === 'error' && (
            <View style={styles.errorContainer}>
              <View style={styles.errorIconBox}>
                <XCircle size={64} color="#ffffff" />
              </View>
              <View style={styles.errorCard}>
                <Text style={styles.errorTitle}>Rostro no reconocido</Text>
                <Text style={styles.errorSubtitle}>
                  No pudimos verificar tu identidad
                </Text>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity 
                    onPress={onCancel}
                    style={styles.cancelButton}
                  >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setState('scanning');
                      setCameraReady(false);
                      setCanCapture(false);
                    }}
                    style={styles.retryButton}
                  >
                    <Text style={styles.retryButtonText}>Reintentar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

        </View>
      </View>
    </Modal>
  );
};

export default FacialVerification;