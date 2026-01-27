import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useAuthContext } from './context/AuthContext';
import { LogIn, Scan, UserPlus } from 'lucide-react-native';
import { styles } from '@/styles/LoginScreenStyles';
import FacialVerification from './FacialVerification';
import { LoginDTO, LogUser, UserResponse } from '@/functions/models/user';

interface LoginScreenProps {
  onLogin: (user: UserResponse) => void;
  onNavigateToRegister: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onNavigateToRegister }) => {
  const { loginUser, loginWithFacial } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showFacialVerification, setShowFacialVerification] = useState(false);

  const handleTraditionalLogin = async () => {
    const data:LoginDTO={
      email:email,
      password:password
    }
    const user = await loginUser(data);
    if (user) {
      onLogin(user);
    } else {
      setError('Credenciales incorrectas');
    }
  };

  const handleFacialLogin = () => {
    setShowFacialVerification(true);
  };

  const handleFacialVerificationSuccess = async (data: LogUser) => {
    // facialFileData es el archivo/objeto devuelto por el componente FacialVerification
    const user = await loginWithFacial(data);
    if (user) {
      onLogin(user);
    } else {
      setError('Rostro no reconocido');
      setShowFacialVerification(false);
    }
  };

  const handleFacialVerificationCancel = () => {
    setShowFacialVerification(false);
    setError('');
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
        {/* Header */}
        <View style={styles.headerSection}>
          <View style={styles.iconContainer}>
            <LogIn size={40} color="#2563EB" />
          </View>
          <Text style={styles.headerTitle}>Control de Asistencia</Text>
          <Text style={styles.headerSubtitle}>Ingresa para registrar tu asistencia</Text>
        </View>

        {/* Login Card */}
        <View style={styles.loginCard}>
          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {!showFacialVerification && (
            <>
              {/* Login Tradicional */}
              <View style={styles.formContainer}>
                <View>
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    placeholder="tu@email.com"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Contraseña</Text>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    style={styles.input}
                    placeholder="••••••"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry
                  />
                </View>

                <TouchableOpacity
                  onPress={handleTraditionalLogin}
                  style={styles.loginButton}
                >
                  <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
                </TouchableOpacity>
              </View>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>O continúa con</Text>
              </View>

              {/* Login Facial */}
              <TouchableOpacity
                onPress={handleFacialLogin}
                style={styles.facialButton}
              >
                <Scan size={20} color="#2563EB" />
                <Text style={styles.facialButtonText}>Reconocimiento Facial</Text>
              </TouchableOpacity>

              {/* Registro */}
              <View style={styles.registrationPrompt}>
                <Text style={styles.promptText}>
                  ¿No tienes cuenta?{' '}
                  <Text
                    onPress={onNavigateToRegister}
                    style={styles.promptLink}
                  >
                    Regístrate aquí
                  </Text>
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Registro rápido */}
        {/* <View style={styles.registrationPrompt}>
          <TouchableOpacity
            onPress={onNavigateToRegister}
            style={styles.quickRegisterButton}
          >
            <UserPlus size={20} color="#FFFFFF" />
            <Text style={styles.quickRegisterText}>Registrar Nuevo Empleado</Text>
          </TouchableOpacity>
        </View> */}
      </ScrollView>
    </View>
  );
};

export default LoginScreen;