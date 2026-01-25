import React, { useState } from 'react';
import { useAuthContext, AuthProvider } from '@/components/context/AuthContext';
import { AdminProvider } from '@/components/context/AdminContext';
import { AttendanceProvider, useAttendanceContext } from '@/components/context/AttendanceContext';
import LoginScreen from '@/components/LoginScreen';
import AdminDashboard from '@/components/AdminDashboard';
import RegisterScreen from '@/components/RegisterScreen';
import EmployeeDashboard from '@/components/EmployeeDashboard';
import SiteSelection from '@/components/SiteSelection';
import FacialVerification from '@/components/FacialVerification';
import EmployeeHistory from '@/components/EmployeeHistory';
import { UserResponse, LogUser } from '@/functions/models/user';
import StorageService from '@/functions/storage';
import { Alert } from 'react-native';

type Screen =
  | 'login'
  | 'register'
  | 'employeeDashboard'
  | 'adminDashboard'
  | 'siteSelection'
  | 'facialVerification'
  | 'employeeHistory';

type ActionType = 'entrada' | 'salida';

function AppContent() {
  const { currentUser, logout, loginWithFacial } = useAuthContext();
  const { markEntry, markExit } = useAttendanceContext();
  
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [pendingAction, setPendingAction] = useState<ActionType | null>(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);
  const [facialVerificationMode, setFacialVerificationMode] = useState<'login' | 'attendance'>('login');

  const handleLogin = async () => {
    const role = await StorageService.getRole();
    if (role === 'employee') {
      setCurrentScreen('employeeDashboard');
    } else {
      setCurrentScreen('adminDashboard');
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentScreen('login');
  };

  const handleSelectSiteForEntry = () => {
    setCurrentScreen('siteSelection');
  };

  const handleSiteSelected = (placeId: number) => {
    setSelectedPlaceId(placeId);
    setPendingAction('entrada');
    setFacialVerificationMode('attendance');
    setCurrentScreen('facialVerification');
  };

  const handleMarkExit = () => {
    setPendingAction('salida');
    setFacialVerificationMode('attendance');
    setCurrentScreen('facialVerification');
  };

  // Handler para LOGIN con reconocimiento facial
  const handleFacialLoginSuccess = async (data: LogUser) => {
    try {
      const user = await loginWithFacial(data);
      
      if (user) {
        const role = await StorageService.getRole();
        if (role === 'employee') {
          setCurrentScreen('employeeDashboard');
        } else {
          setCurrentScreen('adminDashboard');
        }
      } else {
        Alert.alert('Error', 'No se ha logrado reconocer el rostro');
        setCurrentScreen('login');
      }
    } catch (error: any) {
      console.error('Error en facial login:', error);
      Alert.alert('Error', 'No se ha logrado reconocer el rostro');
      setCurrentScreen('login');
    }
  };

  // Handler para MARCAR ASISTENCIA (entrada/salida) con reconocimiento facial
  const handleFacialAttendanceSuccess = async (data: LogUser) => {
    try {
      if (pendingAction === 'entrada') {
        if (!selectedPlaceId) {
          Alert.alert('Error', 'No se seleccionó una sede');
          setPendingAction(null);
          setCurrentScreen('employeeDashboard');
          return;
        }

        // Llamar a markEntry del contexto
        await markEntry({
          place_id: selectedPlaceId,
          file: data.image
        });
        
      } else if (pendingAction === 'salida') {
        // Llamar a markExit del contexto
        await markExit({
          file: data.image
        });
      }

      // Limpiar estados y volver al dashboard
      setPendingAction(null);
      setSelectedPlaceId(null);
      setCurrentScreen('employeeDashboard');

    } catch (error: any) {
      console.error('Error al marcar asistencia:', error);
      // Los errores ya se manejan en el contexto con Alert
      setPendingAction(null);
      setSelectedPlaceId(null);
      setCurrentScreen('employeeDashboard');
    }
  };

  // Handler unificado que decide qué hacer según el modo
  const handleFacialSuccess = async (data: LogUser) => {
    if (facialVerificationMode === 'login') {
      await handleFacialLoginSuccess(data);
    } else {
      await handleFacialAttendanceSuccess(data);
    }
  };

  const handleFacialCancel = () => {
    setPendingAction(null);
    setSelectedPlaceId(null);
    
    // Volver a la pantalla correcta según el modo
    if (facialVerificationMode === 'login') {
      setCurrentScreen('login');
    } else {
      setCurrentScreen('employeeDashboard');
    }
  };

  const handleNavigateToHistory = () => {
    setCurrentScreen('employeeHistory');
  };

  const handleBackToDashboard = () => {
    setCurrentScreen('employeeDashboard');
  };

  const handleNavigateToRegister = () => {
    setCurrentScreen('register');
  };

  const handleBackToLogin = () => {
    setCurrentScreen('login');
  };

  const handleRegisterSuccess = () => {
    setCurrentScreen('login');
  };

  return (
    <>
      {currentScreen === 'login' && (
        <LoginScreen 
          onLogin={handleLogin} 
          onNavigateToRegister={handleNavigateToRegister} 
        />
      )}

      {currentScreen === 'register' && (
        <RegisterScreen
          onBack={handleBackToLogin}
          onRegisterSuccess={handleRegisterSuccess}
        />
      )}

      {currentScreen === 'employeeDashboard' && currentUser && (
        <EmployeeDashboard
          user={currentUser}
          onLogout={handleLogout}
          onNavigateToHistory={handleNavigateToHistory}
          onSelectSiteForEntry={handleSelectSiteForEntry}
          onMarkExit={handleMarkExit}
        />
      )}

      {currentScreen === 'adminDashboard' && currentUser && (
        <AdminDashboard user={currentUser} onLogout={handleLogout} />
      )}

      {currentScreen === 'siteSelection' && (
        <SiteSelection
          onSelectSite={handleSiteSelected}
          onCancel={handleBackToDashboard}
        />
      )}

      {currentScreen === 'facialVerification' && (
        <FacialVerification
          actionType={pendingAction || 'entrada'} 
          onSuccess={handleFacialSuccess}
          onCancel={handleFacialCancel}
        />
      )}

      {currentScreen === 'employeeHistory' && currentUser && (
        <EmployeeHistory user={currentUser} onBack={handleBackToDashboard} />
      )}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <AttendanceProvider>
          <AppContent />
        </AttendanceProvider>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;