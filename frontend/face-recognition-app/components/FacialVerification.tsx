import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Scan, CheckCircle, XCircle, Loader } from 'lucide-react-native';
import { styles } from '@/styles/FacialVerificationStyles';

interface FacialVerificationProps {
  actionType: 'entrada' | 'salida';
  onSuccess: () => void;
  onCancel: () => void;
}

type VerificationState = 'scanning' | 'success' | 'error';

const FacialVerification: React.FC<FacialVerificationProps> = ({
  actionType,
  onSuccess,
  onCancel,
}) => {
  const [verificationState, setVerificationState] = useState<VerificationState>('scanning');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulación de escaneo facial
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    const verificationTimer = setTimeout(() => {
      // Simulación: 90% de probabilidad de éxito
      const isSuccess = Math.random() > 0.1;
      setVerificationState(isSuccess ? 'success' : 'error');

      if (isSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    }, 2000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(verificationTimer);
    };
  }, [onSuccess]);

  const handleRetry = () => {
    setVerificationState('scanning');
    setProgress(0);
  };

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Estado: Escaneando */}
          {verificationState === 'scanning' && (
            <View style={styles.scanningContainer}>
              <View style={styles.scanFrameContainer}>
                <View style={styles.scanFrame}>
                  <Scan size={128} color="#60A5FA" />
                  <View 
                    style={[
                      styles.progressBar,
                      { width: `${progress}%` }
                    ]}
                  />
                </View>
              </View>

              <View style={styles.scanningCard}>
                <Text style={styles.scanningTitle}>
                  Verificación Facial Obligatoria
                </Text>
                <Text style={styles.scanningSubtitle}>
                  Escaneando rostro para marcar {actionType}...
                </Text>
                <View style={styles.progressContainer}>
                  <Loader size={20} color="#9CA3AF" />
                  <Text style={styles.progressText}>Progreso: {progress}%</Text>
                </View>
              </View>
            </View>
          )}

          {/* Estado: Éxito */}
          {verificationState === 'success' && (
            <View style={styles.successContainer}>
              <View style={styles.successIconBox}>
                <CheckCircle size={128} color="#FFFFFF" />
              </View>

              <View style={styles.successCard}>
                <Text style={styles.successTitle}>
                  ✓ Rostro Verificado
                </Text>
                <Text style={styles.successSubtitle}>
                  Identidad confirmada con éxito
                </Text>
                <Text style={styles.successDescription}>
                  Registrando {actionType === 'entrada' ? 'entrada' : 'salida'}...
                </Text>
              </View>
            </View>
          )}

          {/* Estado: Error */}
          {verificationState === 'error' && (
            <View style={styles.errorContainer}>
              <View style={styles.errorIconBox}>
                <XCircle size={128} color="#FFFFFF" />
              </View>

              <View style={styles.errorCard}>
                <Text style={styles.errorTitle}>
                  ✗ Rostro No Reconocido
                </Text>
                <Text style={styles.errorSubtitle}>
                  No se pudo verificar tu identidad
                </Text>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={onCancel}
                    style={styles.cancelButton}
                  >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleRetry}
                    style={styles.retryButton}
                  >
                    <Text style={styles.retryButtonText}>Reintentar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* Botón cancelar (solo durante escaneo) */}
          {verificationState === 'scanning' && (
            <TouchableOpacity
              onPress={onCancel}
              style={styles.bottomCancelButton}
            >
              <Text style={styles.bottomCancelButtonText}>
                Cancelar Verificación
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default FacialVerification;