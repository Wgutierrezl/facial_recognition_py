import React, { useState } from 'react';
import { useAuthContext, AuthProvider } from '@/components/context/AuthContext';
import { AdminProvider } from '@/components/context/AdminContext';
import { AttendanceProvider } from '@/components/context/AttendanceContext';
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
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [pendingAction, setPendingAction] = useState<ActionType | null>(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);

  const handleLogin = async () => {
    const role=await StorageService.getRole()
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
    setCurrentScreen('facialVerification');
  };

  const handleMarkExit = () => {
    setPendingAction('salida');
    setCurrentScreen('facialVerification');
  };

  const handleFacialSuccess = async (data: LogUser) => {
    try {
      // Llamar al login facial con la imagen capturada
      const user = await loginWithFacial(data);
      
      if (user) {
        // Obtener el rol guardado para navegar a la pantalla correcta
        const role = await StorageService.getRole();
        if (role === 'employee') {
          setCurrentScreen('employeeDashboard');
        } else {
          setCurrentScreen('adminDashboard');
        }
        setPendingAction(null);
        setSelectedPlaceId(null);
      } else {
        Alert.alert('no se ha logrado reconocer el rostro')
        setPendingAction(null);
        setSelectedPlaceId(null);
        setCurrentScreen('employeeDashboard');
      }
    } catch (error: any) {
      console.error('Error en facial login:', error);
      Alert.alert('no se ha logrado reconocer el rostro')
      setPendingAction(null);
      setSelectedPlaceId(null);
      setCurrentScreen('employeeDashboard');
    }
  };

  const handleFacialCancel = () => {
    setPendingAction(null);
    setSelectedPlaceId(null);
    setCurrentScreen('employeeDashboard');
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
        <LoginScreen onLogin={handleLogin} onNavigateToRegister={handleNavigateToRegister} />
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

      {currentScreen === 'facialVerification' && pendingAction && (
        <FacialVerification
          actionType={pendingAction}
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
