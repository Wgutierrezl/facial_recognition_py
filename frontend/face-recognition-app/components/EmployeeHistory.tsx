import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList, SafeAreaView, TextInput } from 'react-native';
import { useAppContext, User, Attendance } from '@/components/context/AppContext';
import { ArrowLeft, Calendar, Clock, MapPin, Filter } from 'lucide-react-native';
import { styles } from '@/styles/EmployeeHistoryStyles';

interface EmployeeHistoryProps {
  user: User;
  onBack: () => void;
}

type FilterType = 'all' | 'thisWeek' | 'custom';

const EmployeeHistory: React.FC<EmployeeHistoryProps> = ({ user, onBack }) => {
  const { getAttendancesByUser } = useAppContext();
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const attendances = getAttendancesByUser(user.id);

  const filteredAttendances = useMemo(() => {
    let filtered = [...attendances];

    if (filterType === 'thisWeek') {
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      weekStart.setHours(0, 0, 0, 0);

      filtered = filtered.filter((att) => {
        const attDate = new Date(att.date);
        return attDate >= weekStart;
      });
    } else if (filterType === 'custom' && startDate && endDate) {
      filtered = filtered.filter((att) => {
        const attDate = new Date(att.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return attDate >= start && attDate <= end;
      });
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [attendances, filterType, startDate, endDate]);

  const totalHours = useMemo(() => {
    return filteredAttendances.reduce((sum, att) => sum + (att.hoursWorked || 0), 0);
  }, [filteredAttendances]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
          >
            <ArrowLeft size={20} color="#4B5563" />
            <Text style={styles.backButtonText}>Volver al Dashboard</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mi Historial de Asistencia</Text>
          <Text style={styles.headerSubtitle}>Consulta tus registros de entrada y salida</Text>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Estadísticas */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statCardContent}>
              <View style={styles.statInfo}>
                <Text style={styles.statLabel}>Total Registros</Text>
                <Text style={styles.statValue}>{filteredAttendances.length}</Text>
              </View>
              <View style={[styles.statIcon, { backgroundColor: '#dbeafe' }]}>
                <Calendar size={24} color="#2563EB" />
              </View>
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statCardContent}>
              <View style={styles.statInfo}>
                <Text style={styles.statLabel}>Horas Trabajadas</Text>
                <Text style={styles.statValue}>{totalHours.toFixed(1)}h</Text>
              </View>
              <View style={[styles.statIcon, { backgroundColor: '#dcfce7' }]}>
                <Clock size={24} color="#16A34A" />
              </View>
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statCardContent}>
              <View style={styles.statInfo}>
                <Text style={styles.statLabel}>Sede Principal</Text>
                <Text style={[styles.statValue, { fontSize: 16 }]}>{user.sede}</Text>
              </View>
              <View style={[styles.statIcon, { backgroundColor: '#f3e8ff' }]}>
                <MapPin size={24} color="#9333EA" />
              </View>
            </View>
          </View>
        </View>

        {/* Filtros */}
        <View style={styles.filterSection}>
          <View style={[styles.filterTitle, { flexDirection: 'row', alignItems: 'center', gap: 8 }]}>
            <Filter size={20} color="#4B5563" />
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>Filtros</Text>
          </View>

          <View style={styles.filterButtonsContainer}>
            <TouchableOpacity
              onPress={() => setFilterType('all')}
              style={[
                styles.filterButton,
                filterType === 'all' && styles.filterButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filterType === 'all' && styles.filterButtonTextActive,
                ]}
              >
                Todos
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setFilterType('thisWeek')}
              style={[
                styles.filterButton,
                filterType === 'thisWeek' && styles.filterButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filterType === 'thisWeek' && styles.filterButtonTextActive,
                ]}
              >
                Esta Semana
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setFilterType('custom')}
              style={[
                styles.filterButton,
                filterType === 'custom' && styles.filterButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filterType === 'custom' && styles.filterButtonTextActive,
                ]}
              >
                Personalizado
              </Text>
            </TouchableOpacity>
          </View>

          {filterType === 'custom' && (
            <View style={styles.dateInputsContainer}>
              <View style={styles.dateInputGroup}>
                <Text style={styles.inputLabel}>Fecha Inicio</Text>
                <TextInput
                  value={startDate}
                  onChangeText={setStartDate}
                  style={styles.dateInput}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <View style={styles.dateInputGroup}>
                <Text style={styles.inputLabel}>Fecha Fin</Text>
                <TextInput
                  value={endDate}
                  onChangeText={setEndDate}
                  style={styles.dateInput}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
          )}
        </View>

        {/* Lista de Asistencias */}
        <View style={styles.tableContainer}>
          {filteredAttendances.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No hay registros para mostrar</Text>
            </View>
          ) : (
            <FlatList
              data={filteredAttendances}
              renderItem={({ item, index }) => (
                <View
                  style={[
                    styles.tableRow,
                    index === filteredAttendances.length - 1 && { borderBottomWidth: 0 },
                  ]}
                >
                  {/* Fecha */}
                  <View style={styles.tableCell}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Calendar size={16} color="#9CA3AF" />
                      <Text style={styles.cellValue}>
                        {formatDate(item.date)}
                      </Text>
                    </View>
                  </View>

                  {/* Sede */}
                  <View style={styles.tableCell}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <MapPin size={16} color="#9CA3AF" />
                      <Text style={styles.cellValue}>{item.placeName}</Text>
                    </View>
                  </View>

                  {/* Horarios */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                    <View>
                      <Text style={styles.cellLabel}>Entrada</Text>
                      <Text style={styles.cellValue}>{item.entryTime}</Text>
                    </View>
                    <View>
                      <Text style={styles.cellLabel}>Salida</Text>
                      <Text style={styles.cellValue}>{item.exitTime || '-'}</Text>
                    </View>
                  </View>

                  {/* Horas */}
                  {item.hoursWorked ? (
                    <View style={styles.hoursWorkedBadge}>
                      <Text style={styles.hoursWorkedText}>
                        {item.hoursWorked.toFixed(2)}h
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.inProgressBadge}>
                      <Text style={styles.inProgressText}>En progreso</Text>
                    </View>
                  )}
                </View>
              )}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default EmployeeHistory;