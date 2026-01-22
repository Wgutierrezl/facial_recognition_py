import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useAppContext, User } from '@/components/context/AppContext';
import { LogIn, Scan, UserPlus } from 'lucide-react-native';
import { styles } from '@/styles/LoginScreenStyles';

interface LoginScreenProps {
  onLogin: (user: User) => void;
  onNavigateToRegister: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onNavigateToRegister }) => {
  const { loginUser, loginWithFacial } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showFacialLogin, setShowFacialLogin] = useState(false);

  const handleTraditionalLogin = () => {
    const user = loginUser(email, password);
    if (user) {
      onLogin(user);
    } else {
      setError('Credenciales incorrectas');
    }
  };

  const handleFacialLogin = () => {
    // Simulación de reconocimiento facial
    setShowFacialLogin(true);
    setTimeout(() => {
      const user = loginWithFacial('facial-data-1');
      if (user) {
        onLogin(user);
      } else {
        setError('Rostro no reconocido');
        setShowFacialLogin(false);
      }
    }, 2000);
  };

  return (
    <View style={styles.container}>
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

        {/* Información de prueba */}
        <View style={styles.credentialsBox}>
          <Text style={styles.credentialsTitle}>🧪 Credenciales de prueba:</Text>
          <View>
            <Text style={styles.credentialsText}>
              <Text style={styles.credentialsBold}>Empleado:</Text> empleado@example.com / 123456
            </Text>
            <Text style={styles.credentialsText}>
              <Text style={styles.credentialsBold}>Admin:</Text> admin@example.com / admin
            </Text>
          </View>
        </View>

        {/* Login Card */}
        <View style={styles.loginCard}>
          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {!showFacialLogin ? (
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
          ) : (
            <View style={styles.scanningContainer}>
              <View style={styles.scanningIconBox}>
                <Scan size={64} color="#2563EB" />
              </View>
              <Text style={styles.scanningTitle}>
                Escaneando Rostro...
              </Text>
              <Text style={styles.scanningSubtitle}>Mantén tu rostro frente a la cámara</Text>
            </View>
          )}
        </View>

        {/* Registro rápido */}
        <View style={styles.registrationPrompt}>
          <TouchableOpacity
            onPress={onNavigateToRegister}
            style={styles.quickRegisterButton}
          >
            <UserPlus size={20} color="#FFFFFF" />
            <Text style={styles.quickRegisterText}>Registrar Nuevo Empleado</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default LoginScreen;