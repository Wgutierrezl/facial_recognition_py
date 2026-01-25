import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useAuthContext } from './context/AuthContext';
import { Camera, UserPlus, ArrowLeft, Check } from 'lucide-react-native';
import { styles } from '@/styles/RegisterScreenStyles';
import FacialVerification from './FacialVerification';
import { UserCreate } from '@/functions/models/user';

interface RegisterScreenProps {
  onBack: () => void;
  onRegisterSuccess: () => void;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ onBack, onRegisterSuccess }) => {
  const { registerUser, areas, places, loading: contextLoading } = useAuthContext(); // ✅ Obtener loading
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    area: null as number | null,
    sede: null as number | null,
  });
  const [facialCaptured, setFacialCaptured] = useState(false);
  const [facialFile, setFacialFile] = useState<any>(null);
  const [showFacialVerification, setShowFacialVerification] = useState(false);
  const [error, setError] = useState('');
  const [showAreaPicker, setShowAreaPicker] = useState(false);
  const [showSedePicker, setShowSedePicker] = useState(false);

  const handleChange = (name: keyof typeof formData, value: string | number | null) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleCaptureFacial = () => {
    setShowFacialVerification(true);
  };

  const handleFacialVerificationSuccess = (facialFileData: any) => {
    const image=facialFileData.image || facialFileData
    setFacialFile(image);
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

    const data: UserCreate = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role_id: 2,
      area_id: formData.area,
      place_id: formData.sede,
      file: facialFile
    }

    registerUser(data);
    onRegisterSuccess();
  };

  // ✅ Buscar el nombre del área seleccionada
  const selectedAreaName = areas.find(a => a.id === formData.area)?.name || "Selecciona un área";
  
  // ✅ Buscar el nombre de la sede seleccionada
  const selectedSedeName = places.find(p => p.id === formData.sede)?.name || "Selecciona una sede";

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

          {/* ✅ Mostrar loading mientras se cargan los datos */}
          {contextLoading ? (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#2563EB" />
              <Text style={{ marginTop: 16, color: '#6B7280', fontSize: 14 }}>
                Cargando datos...
              </Text>
            </View>
          ) : (
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
                    {selectedAreaName}
                  </Text>
                </TouchableOpacity>
                {showAreaPicker && (
                  <View style={styles.dropdownContainer}>
                    {areas.length > 0 ? (
                      areas.map((area) => (
                        <TouchableOpacity
                          key={area.id}
                          onPress={() => {
                            handleChange('area', area.id);
                            setShowAreaPicker(false);
                          }}
                          style={styles.dropdownItem}
                        >
                          <Text style={styles.dropdownItemText}>{area.name}</Text>
                        </TouchableOpacity>
                      ))
                    ) : (
                      <View style={styles.dropdownItem}>
                        <Text style={[styles.dropdownItemText, { color: '#9CA3AF' }]}>
                          No hay áreas disponibles
                        </Text>
                      </View>
                    )}
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
                    {selectedSedeName}
                  </Text>
                </TouchableOpacity>
                {showSedePicker && (
                  <View style={styles.dropdownContainer}>
                    {places.length > 0 ? (
                      places.map((place) => (
                        <TouchableOpacity
                          key={place.id}
                          onPress={() => {
                            handleChange('sede', place.id);
                            setShowSedePicker(false);
                          }}
                          style={styles.dropdownItem}
                        >
                          <Text style={styles.dropdownItemText}>{place.name}</Text>
                        </TouchableOpacity>
                      ))
                    ) : (
                      <View style={styles.dropdownItem}>
                        <Text style={[styles.dropdownItemText, { color: '#9CA3AF' }]}>
                          No hay sedes disponibles
                        </Text>
                      </View>
                    )}
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
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default RegisterScreen;