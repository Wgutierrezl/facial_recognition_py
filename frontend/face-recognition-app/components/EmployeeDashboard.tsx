import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useAppContext, User } from '@/components/context/AppContext';
import { LogOut, Clock, History, MapPin, CheckCircle, XCircle, Briefcase, LogIn as LogInIcon, AlertTriangle } from 'lucide-react-native';
import { styles } from '@/styles/EmployeeDashboardStyles';

interface EmployeeDashboardProps {
  user: User;
  onLogout: () => void;
  onNavigateToHistory: () => void;
  onSelectSiteForEntry: () => void;
  onMarkExit: () => void;
}

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({
  user,
  onLogout,
  onNavigateToHistory,
  onSelectSiteForEntry,
  onMarkExit,
}) => {
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const formattedDate = currentTime.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <View style={styles.userAvatar}>
              <Text style={styles.userAvatarText}>
                {user.name.charAt(0)}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userArea}>{user.area}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={onLogout}
            style={styles.logoutButton}
          >
            <LogOut size={20} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Reloj y Estado */}
        <View style={styles.clockCard}>
          <View style={styles.clockSection}>
            <View style={styles.clockIcon}>
              <Clock size={32} color="#2563EB" />
            </View>
            <Text style={styles.clockTime}>{formattedTime}</Text>
            <Text style={styles.clockDate}>{formattedDate}</Text>
          </View>

          <View style={styles.statusSection}>
            <View
              style={[
                styles.statusBadge,
                user.status === 'dentro' ? styles.statusBadgeInside : styles.statusBadgeOutside,
              ]}
            >
              {user.status === 'dentro' ? (
                <>
                  <CheckCircle size={20} color="#15803D" />
                  <Text style={styles.statusTextInside}>Dentro - Trabajando</Text>
                </>
              ) : (
                <>
                  <XCircle size={20} color="#991b1b" />
                  <Text style={styles.statusTextOutside}>Fuera - Sin Registro</Text>
                </>
              )}
            </View>
          </View>

          {/* Info Card */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <MapPin size={20} color="#4B5563" />
              <View>
                <Text style={styles.infoLabel}>Sede Actual</Text>
                <Text style={styles.infoValue}>{user.sede}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Briefcase size={20} color="#4B5563" />
              <View>
                <Text style={styles.infoLabel}>Área</Text>
                <Text style={styles.infoValue}>{user.area}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Botones de Acción */}
        <View style={styles.actionButtons}>
          {user.status === 'fuera' ? (
            <TouchableOpacity
              onPress={onSelectSiteForEntry}
              style={styles.actionButtonEntry}
            >
              <View style={styles.actionButtonContent}>
                <View style={styles.actionButtonIcon}>
                  <LogInIcon size={32} color="#FFFFFF" />
                </View>
                <Text style={[styles.actionButtonText, styles.actionButtonTextWhite]}>Marcar Entrada</Text>
                <Text style={[styles.actionButtonSubtext, styles.actionButtonSubtextLight]}>Presiona para registrar tu llegada</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={onMarkExit}
              style={styles.actionButtonExit}
            >
              <View style={styles.actionButtonContent}>
                <View style={styles.actionButtonIcon}>
                  <LogOut size={32} color="#FFFFFF" />
                </View>
                <Text style={[styles.actionButtonText, styles.actionButtonTextWhite]}>Marcar Salida</Text>
                <Text style={[styles.actionButtonSubtext, styles.actionButtonSubtextLight]}>Presiona para registrar tu salida</Text>
              </View>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={onNavigateToHistory}
            style={styles.actionButtonHistory}
          >
            <View style={styles.actionButtonContent}>
              <View style={[styles.actionButtonIcon, { backgroundColor: '#dbeafe' }]}>
                <History size={32} color="#2563EB" />
              </View>
              <Text style={[styles.actionButtonText, styles.actionButtonTextGray]}>Mi Historial</Text>
              <Text style={[styles.actionButtonSubtext, styles.actionButtonTextGray]}>Ver registro de asistencias</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Advertencia */}
        <View style={styles.warningCard}>
          <View style={styles.warningContent}>
            <AlertTriangle size={24} color="#CA8A04" />
            <View style={{ flex: 1 }}>
              <Text style={styles.warningTitle}>
                ⚠️ Verificación Facial Obligatoria
              </Text>
              <Text style={styles.warningText}>
                Todas las acciones de entrada y salida requieren verificación facial para garantizar la seguridad y autenticidad del registro.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default EmployeeDashboard;