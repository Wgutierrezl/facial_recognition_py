import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useAppContext } from '@/components/context/AppContext';
import { Camera, UserPlus, ArrowLeft, Check } from 'lucide-react-native';
import { styles } from '@/styles/RegisterScreenStyles';
import FacialVerification from './FacialVerification';

interface RegisterScreenProps {
  onBack: () => void;
  onRegisterSuccess: () => void;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ onBack, onRegisterSuccess }) => {
  const { registerUser, areas, places } = useAppContext();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    area: '',
    sede: '',
  });
  const [facialCaptured, setFacialCaptured] = useState(false);
  const [facialFile, setFacialFile] = useState<any>(null);
  const [showFacialVerification, setShowFacialVerification] = useState(false);
  const [error, setError] = useState('');
  const [showAreaPicker, setShowAreaPicker] = useState(false);
  const [showSedePicker, setShowSedePicker] = useState(false);

  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleCaptureFacial = () => {
    setShowFacialVerification(true);
  };

  const handleFacialVerificationSuccess = (facialFileData: any) => {
    // facialFileData es el archivo/objeto devuelto por el componente FacialVerification
    setFacialFile(facialFileData);
    setFacialCaptured(true);
    setShowFacialVerification(false);
    setError('');
  };

  const handleFacialVerificationCancel = () => {
    setShowFacialVerification(false);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.area || !formData.sede) {
      setError('Todos los campos son obligatorios');
      return;
    }

    if (!facialCaptured) {
      setError('Debes capturar tu imagen facial');
      return;
    }

    registerUser({
      ...formData,
      role: 'employee',
      facialImage: facialFile,
    });

    onRegisterSuccess();
  };

  return (
    <View style={styles.container}>
      {/* Componente de verificación facial */}
      {showFacialVerification && (
        <FacialVerification
          actionType="entrada"
          onSuccess={handleFacialVerificationSuccess}
          onCancel={handleFacialVerificationCancel}
        />
      )}

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
          >
            <ArrowLeft size={20} color="#4B5563" />
            <Text style={styles.backButtonText}>Volver al login</Text>
          </TouchableOpacity>

          <View style={styles.headerSection}>
            <View style={styles.headerIcon}>
              <UserPlus size={32} color="#2563EB" />
            </View>
            <Text style={styles.headerTitle}>Registro de Empleado</Text>
            <Text style={styles.headerSubtitle}>
              Completa todos los datos para registrarte
            </Text>
          </View>

          <View style={styles.formContainer}>
            {/* Nombre */}
            <View>
              <Text style={styles.label}>
                Nombre Completo *
              </Text>
              <TextInput
                value={formData.name}
                onChangeText={(value) => handleChange('name', value)}
                style={styles.input}
                placeholder="Juan Pérez"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Email */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                value={formData.email}
                onChangeText={(value) => handleChange('email', value)}
                style={styles.input}
                placeholder="tu@email.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Contraseña */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Contraseña *
              </Text>
              <TextInput
                value={formData.password}
                onChangeText={(value) => handleChange('password', value)}
                style={styles.input}
                placeholder="••••••"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
              />
            </View>

            {/* Área */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Área *</Text>
              <TouchableOpacity
                onPress={() => setShowAreaPicker(!showAreaPicker)}
                style={styles.pickerButton}
              >
                <Text style={[
                  styles.pickerButtonText,
                  !formData.area && styles.pickerButtonPlaceholder
                ]}>
                  {formData.area || "Selecciona un área"}
                </Text>
              </TouchableOpacity>
              {showAreaPicker && (
                <View style={styles.dropdownContainer}>
                  {areas.map((area) => (
                    <TouchableOpacity
                      key={area.id}
                      onPress={() => {
                        handleChange('area', area.name);
                        setShowAreaPicker(false);
                      }}
                      style={styles.dropdownItem}
                    >
                      <Text style={styles.dropdownItemText}>{area.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Sede */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Sede *</Text>
              <TouchableOpacity
                onPress={() => setShowSedePicker(!showSedePicker)}
                style={styles.pickerButton}
              >
                <Text style={[
                  styles.pickerButtonText,
                  !formData.sede && styles.pickerButtonPlaceholder
                ]}>
                  {formData.sede || "Selecciona una sede"}
                </Text>
              </TouchableOpacity>
              {showSedePicker && (
                <View style={styles.dropdownContainer}>
                  {places.map((place) => (
                    <TouchableOpacity
                      key={place.id}
                      onPress={() => {
                        handleChange('sede', place.name);
                        setShowSedePicker(false);
                      }}
                      style={styles.dropdownItem}
                    >
                      <Text style={styles.dropdownItemText}>{place.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Captura Facial */}
            <View style={[styles.formGroup, styles.facialContainer]}>
              <View style={styles.facialIconBox}>
                <Camera size={48} color="#9CA3AF" />
              </View>
              <Text style={styles.facialTitle}>
                Captura Facial Obligatoria *
              </Text>
              <Text style={styles.facialSubtitle}>
                Esta imagen se usará para autenticación y asistencia
              </Text>
              {!facialCaptured ? (
                <TouchableOpacity
                  onPress={handleCaptureFacial}
                  style={styles.captureButton}
                >
                  <Text style={styles.captureButtonText}>Capturar Rostro</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.capturedContainer}>
                  <View style={styles.capturedIconBox}>
                    <Check size={32} color="#16A34A" />
                  </View>
                  <Text style={styles.capturedText}>
                    Rostro Capturado
                  </Text>
                </View>
              )}
            </View>

            {/* Botón Submit */}
            <TouchableOpacity
              onPress={handleSubmit}
              style={styles.submitButton}
            >
              <Text style={styles.submitButtonText}>
                Registrarse
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default RegisterScreen;