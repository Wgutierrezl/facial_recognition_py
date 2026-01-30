import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  container: {
    maxWidth: 450,
    width: '100%',
    alignItems: 'center',
  },
  scanningContainer: {
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  scanningTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  scanningSubtitle: {
    fontSize: 15,
    color: '#93c5fd',
    marginBottom: 32,
    textAlign: 'center',
  },
  
  // 🎯 NUEVO: Contenedor para centrar la cámara
  cameraWrapper: {
    position: 'absolute',
    top: 100,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    zIndex: 1,
  },
  
  // 🎯 NUEVO: Marco ovalado mejorado y más grande
  scanFrame: {
    width: 280,
    height: 340,
    borderColor: '#60a5fa',
    borderWidth: 4,
    borderRadius: 170, // Hace el óvalo más pronunciado
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#000',
    // Sombra para dar profundidad
    shadowColor: '#60a5fa',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  
  // 🎯 NUEVO: Cámara que llena todo el espacio
  camera: {
    width: '100%',
    height: '100%',
  },
  
  // 🎯 NUEVO: Overlay de carga sobre la cámara
  loadingOverlay: {
    position: 'absolute',
    width: 280,
    height: 340,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 170,
  },
  
  // 🎯 NUEVO: Botón de captura mejorado
  captureButton: {
    paddingVertical: 16,
    paddingHorizontal: 48,
    backgroundColor: '#2563eb',
    borderRadius: 30,
    marginBottom: 16,
    // Sombra
    shadowColor: '#2563eb',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  captureButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
  },
  
  // 🎯 NUEVO: Contenedor de preparación
  preparingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
    paddingVertical: 12,
  },
  preparingText: {
    color: '#FCD34D',
    fontSize: 14,
    fontWeight: '500',
  },
  
  // Botón cancelar inferior
  bottomCancelButton: {
    marginTop: 8,
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(55, 65, 81, 0.6)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(156, 163, 175, 0.3)',
  },
  bottomCancelButtonText: {
    color: '#d1d5db',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14,
  },
  
  // 🎯 NUEVO: Estado de carga
  loadingContainer: {
    alignItems: 'center',
  },
  loadingIconBox: {
    paddingHorizontal: 40,
    paddingVertical: 40,
    backgroundColor: '#2563eb',
    borderRadius: 64,
    marginBottom: 24,
  },
  loadingCard: {
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderRadius: 16,
    paddingHorizontal: 32,
    paddingVertical: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.3)',
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#93c5fd',
    marginBottom: 8,
    textAlign: 'center',
  },
  loadingSubtitle: {
    fontSize: 15,
    color: '#9ca3af',
    textAlign: 'center',
  },
  
  // Estados de éxito
  successContainer: {
    alignItems: 'center',
  },
  successIconBox: {
    paddingHorizontal: 40,
    paddingVertical: 40,
    backgroundColor: '#10b981',
    borderRadius: 64,
    marginBottom: 24,
  },
  successCard: {
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderRadius: 16,
    paddingHorizontal: 32,
    paddingVertical: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.3)',
  },
  successTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#4ade80',
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
  successDescription: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  
  // Estados de error
  errorContainer: {
    alignItems: 'center',
  },
  errorIconBox: {
    paddingHorizontal: 40,
    paddingVertical: 40,
    backgroundColor: '#ef4444',
    borderRadius: 64,
    marginBottom: 24,
  },
  errorCard: {
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderRadius: 16,
    paddingHorizontal: 32,
    paddingVertical: 24,
    width: '100%',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.3)',
  },
  errorTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#f87171',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 24,
    textAlign: 'center',
  },
  
  // Botones
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: '#374151',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4b5563',
  },
  cancelButtonText: {
    color: '#e5e7eb',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14,
  },
  retryButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: '#2563eb',
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14,
  },
  
  // Estilos antiguos que se mantienen por compatibilidad
  scanFrameContainer: {
    marginBottom: 32,
  },
  progressBar: {
    position: 'absolute',
    height: 4,
    top: '50%',
    left: 0,
    backgroundColor: '#60a5fa',
  },
  scanningCard: {
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 24,
    width: '100%',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  progressText: {
    color: '#9ca3af',
    fontSize: 13,
  },
});