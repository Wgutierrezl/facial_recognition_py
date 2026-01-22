import React, { useState } from 'react';
import { AppProvider, useAppContext, User } from '../../components/context/AppContext';
import LoginScreen from '@/components/LoginScreen';
import AdminDashboard from '@/components/AdminDashboard';
import RegisterScreen from '@/components/RegisterScreen';
import EmployeeDashboard from '@/components/EmployeeDashboard';
import SiteSelection from '@/components/SiteSelection';
import FacialVerification from '@/components/FacialVerification';
import EmployeeHistory from '@/components/EmployeeHistory';

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
  const { currentUser, logout, markEntry, markExit } = useAppContext();
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [pendingAction, setPendingAction] = useState<ActionType | null>(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);

  const handleLogin = (user: User) => {
    if (user.role === 'employee') {
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

  const handleSiteSelected = (placeId: string) => {
    setSelectedPlaceId(placeId);
    setPendingAction('entrada');
    setCurrentScreen('facialVerification');
  };

  const handleMarkExit = () => {
    setPendingAction('salida');
    setCurrentScreen('facialVerification');
  };

  const handleFacialSuccess = () => {
    if (currentUser && pendingAction) {
      if (pendingAction === 'entrada' && selectedPlaceId) {
        markEntry(currentUser.id, selectedPlaceId);
      } else if (pendingAction === 'salida') {
        markExit(currentUser.id);
      }
    }
    setPendingAction(null);
    setSelectedPlaceId(null);
    setCurrentScreen('employeeDashboard');
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
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
