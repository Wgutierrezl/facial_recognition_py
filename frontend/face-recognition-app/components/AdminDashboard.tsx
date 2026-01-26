import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useAdminContext } from './context/AdminContext';
import { useAuthContext } from './context/AuthContext';
import { AreaCreate, AreaResponse } from '@/functions/models/area';
import { PlaceCreate, PlaceResponse } from '@/functions/models/place';
import { UserResponse } from '@/functions/models/user';
import {
  LogOut,
  Users,
  Clock,
  Calendar,
  Building2,
  Briefcase,
  Download,
  Filter,
  Plus,
  TrendingUp,
} from 'lucide-react-native';
import { styles } from '@/styles/AdminDashboardStyles';
import { AttendanceResponse } from '@/functions/models/attendance';
import { GetAllAttendance } from '@/functions/attendance_functions';

interface AdminDashboardProps {
  user: UserResponse;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const { getAllAttendances, addPlace, addArea } = useAdminContext();
  const { getUsers } = useAuthContext();
  const [allAttendances, setAllAttendances] = useState<AttendanceResponse[]>([])
  const {users, places, areas} = useAuthContext()
  const [filterSede, setFilterSede] = useState('');
  const [filterArea, setFilterArea] = useState('');
  const [filterEmployee, setFilterEmployee] = useState('');
  const [filterDateStart, setFilterDateStart] = useState('');
  const [filterDateEnd, setFilterDateEnd] = useState('');
  const [showAddPlace, setShowAddPlace] = useState(false);
  const [showAddArea, setShowAddArea] = useState(false);
  const [newPlaceName, setNewPlaceName] = useState('');
  const [newAreaName, setNewAreaName] = useState('');
  const [showSedePicker, setShowSedePicker] = useState(false);
  const [showAreaPicker, setShowAreaPicker] = useState(false);
  const [showEmployeePicker, setShowEmployeePicker] = useState(false);

  useEffect(()=> {
    const loadData=async() =>{
      try {
        
        const response=await getAllAttendances()
        setAllAttendances(response ?? []);

        await getUsers()
      } catch (error) {
        Alert.alert('Error', 'No se pudieron cargar las asistencias');
      }
    }
    loadData()
  },[])

  const employees = users.filter((u) => u.role.name === 'employee');

  const filteredAttendances = useMemo(() => {
    let filtered = [...allAttendances];

    if (filterSede) {
      filtered = filtered.filter((att) => att.place.name === filterSede);
    }

    if (filterArea) {
      filtered = filtered.filter((att) => att.user.area.name === filterArea);
    }

    if (filterEmployee) {
      filtered = filtered.filter((att) => att.user.name === filterEmployee);
    }

    if (filterDateStart) {
      filtered = filtered.filter((att) => att.work_date.toString() >= filterDateStart);
    }

    if (filterDateEnd) {
      filtered = filtered.filter((att) => att.work_date.toString() <= filterDateEnd);
    }

    return filtered.sort((a, b) => new Date(b.work_date).getTime() - new Date(a.work_date).getTime());
  }, [allAttendances, filterSede, filterArea, filterEmployee, filterDateStart, filterDateEnd]);

  const stats = useMemo(() => {
    const totalHours = filteredAttendances.reduce(
      (sum, att) => sum + (att.total_hours || 0),
      0
    );

    const thisWeek = filteredAttendances.filter((att) => {
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      weekStart.setHours(0, 0, 0, 0);
      const attDate = new Date(att.work_date);
      return attDate >= weekStart;
    });

    const thisWeekHours = thisWeek.reduce((sum, att) => sum + (att.total_hours || 0), 0);

    const thisMonth = filteredAttendances.filter((att) => {
      const now = new Date();
      const attDate = new Date(att.work_date);
      return (
        attDate.getMonth() === now.getMonth() && attDate.getFullYear() === now.getFullYear()
      );
    });

    const thisMonthHours = thisMonth.reduce((sum, att) => sum + (att.total_hours || 0), 0);

    return {
      totalHours: totalHours.toFixed(1),
      thisWeekHours: thisWeekHours.toFixed(1),
      thisMonthHours: thisMonthHours.toFixed(1),
      totalRecords: filteredAttendances.length,
    };
  }, [filteredAttendances]);

  const handleAddPlace = () => {
    if (newPlaceName.trim()) {
      const data:PlaceCreate={
        name:newPlaceName,
        latitude:'',
        longitude:'',
        radius_meters:80
      }

      addPlace(data);
      setNewPlaceName('');
      setShowAddPlace(false);
    }
  };

  const handleAddArea = () => {
    if (newAreaName.trim()) {
      const data:AreaCreate={
        name:newAreaName
      }
      addArea(data);
      setNewAreaName('');
      setShowAddArea(false);
    }
  };

  const handleExport = () => {
    Alert.alert('Exportar', 'Exportando registros filtrados a Excel/CSV...');
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
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
          <View style={styles.headerLeft}>
            <View style={styles.userAvatar}>
              <Text style={styles.userAvatarText}>
                {user.name.charAt(0)}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userRole}>Administrador</Text>
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

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={styles.title}>Panel de Administración</Text>
        <Text style={styles.subtitle}>
          Gestiona asistencias, sedes y áreas de la organización
        </Text>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statCardHeader}>
              <View style={[styles.statIconBox, { backgroundColor: '#dbeafe' }]}>
                <Users size={24} color="#2563EB" />
              </View>
              <TrendingUp size={20} color="#10B981" />
            </View>
            <Text style={styles.statLabel}>Empleados</Text>
            <Text style={styles.statValue}>{employees.length}</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statCardHeader}>
              <View style={[styles.statIconBox, { backgroundColor: '#dcfce7' }]}>
                <Clock size={24} color="#16A34A" />
              </View>
            </View>
            <Text style={styles.statLabel}>Horas Esta Semana</Text>
            <Text style={styles.statValue}>{stats.thisWeekHours}h</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statCardHeader}>
              <View style={[styles.statIconBox, { backgroundColor: '#f3e8ff' }]}>
                <Calendar size={24} color="#9333EA" />
              </View>
            </View>
            <Text style={styles.statLabel}>Horas Este Mes</Text>
            <Text style={styles.statValue}>{stats.thisMonthHours}h</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statCardHeader}>
              <View style={[styles.statIconBox, { backgroundColor: '#fed7aa' }]}>
                <Building2 size={24} color="#EA580C" />
              </View>
            </View>
            <Text style={styles.statLabel}>Total Registros</Text>
            <Text style={styles.statValue}>{stats.totalRecords}</Text>
          </View>
        </View>

        {/* Gestión de Sedes */}
        <View style={styles.managementCard}>
          <View style={styles.managementCardHeader}>
            <View style={styles.managementCardTitleContainer}>
              <Building2 size={20} color="#4B5563" />
              <Text style={styles.managementCardTitle}>Sedes</Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowAddPlace(true)}
              style={styles.addIconButton}
            >
              <Plus size={20} color="#2563EB" />
            </TouchableOpacity>
          </View>
          <View style={styles.itemsContainer}>
            {places.map((place) => (
              <View key={place.id} style={styles.placeItem}>
                <Text style={styles.placeItemText}>{place.name}</Text>
              </View>
            ))}
          </View>
          {showAddPlace && (
            <View style={styles.addFormContainer}>
              <TextInput
                value={newPlaceName}
                onChangeText={setNewPlaceName}
                placeholder="Nombre de la sede"
                placeholderTextColor="#9CA3AF"
                style={styles.formInput}
              />
              <View style={styles.formButtonsRow}>
                <TouchableOpacity
                  onPress={handleAddPlace}
                  style={styles.formSubmitButton}
                >
                  <Text style={styles.formSubmitButtonText}>Agregar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setShowAddPlace(false);
                    setNewPlaceName('');
                  }}
                  style={styles.formCancelButton}
                >
                  <Text style={styles.formCancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Gestión de Áreas */}
        <View style={styles.managementCard}>
          <View style={styles.managementCardHeader}>
            <View style={styles.managementCardTitleContainer}>
              <Briefcase size={20} color="#4B5563" />
              <Text style={styles.managementCardTitle}>Áreas</Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowAddArea(true)}
              style={styles.addIconButton}
            >
              <Plus size={20} color="#2563EB" />
            </TouchableOpacity>
          </View>
          <View style={styles.itemsContainer}>
            {areas.map((area) => (
              <View key={area.id} style={styles.areaItem}>
                <Text style={styles.areaItemText}>{area.name}</Text>
              </View>
            ))}
          </View>
          {showAddArea && (
            <View style={styles.addFormContainer}>
              <TextInput
                value={newAreaName}
                onChangeText={setNewAreaName}
                placeholder="Nombre del área"
                placeholderTextColor="#9CA3AF"
                style={styles.formInput}
              />
              <View style={styles.formButtonsRow}>
                <TouchableOpacity
                  onPress={handleAddArea}
                  style={styles.formSubmitButton}
                >
                  <Text style={styles.formSubmitButtonText}>Agregar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setShowAddArea(false);
                    setNewAreaName('');
                  }}
                  style={styles.formCancelButton}
                >
                  <Text style={styles.formCancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Filtros */}
        <View style={styles.filterCard}>
          <View style={styles.filterHeader}>
            <Filter size={20} color="#4B5563" />
            <Text style={styles.filterTitle}>Filtros Avanzados</Text>
          </View>

          <View style={styles.filterFields}>
            {/* Sede */}
            <View style={styles.filterField}>
              <Text style={styles.filterFieldLabel}>Sede</Text>
              <TouchableOpacity
                onPress={() => setShowSedePicker(!showSedePicker)}
                style={styles.filterPickerButton}
              >
                <Text style={filterSede ? styles.filterPickerButtonTextActive : styles.filterPickerButtonTextPlaceholder}>
                  {filterSede || "Todas las sedes"}
                </Text>
              </TouchableOpacity>
              {showSedePicker && (
                <View style={styles.filterDropdown}>
                  <TouchableOpacity
                    onPress={() => {
                      setFilterSede('');
                      setShowSedePicker(false);
                    }}
                    style={styles.filterDropdownItem}
                  >
                    <Text style={styles.filterDropdownItemText}>Todas las sedes</Text>
                  </TouchableOpacity>
                  {places.map((place) => (
                    <TouchableOpacity
                      key={place.id}
                      onPress={() => {
                        setFilterSede(place.name);
                        setShowSedePicker(false);
                      }}
                      style={styles.filterDropdownItem}
                    >
                      <Text style={styles.filterDropdownItemText}>{place.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Área */}
            <View style={styles.filterField}>
              <Text style={styles.filterFieldLabel}>Área</Text>
              <TouchableOpacity
                onPress={() => setShowAreaPicker(!showAreaPicker)}
                style={styles.filterPickerButton}
              >
                <Text style={filterArea ? styles.filterPickerButtonTextActive : styles.filterPickerButtonTextPlaceholder}>
                  {filterArea || "Todas las áreas"}
                </Text>
              </TouchableOpacity>
              {showAreaPicker && (
                <View style={styles.filterDropdown}>
                  <TouchableOpacity
                    onPress={() => {
                      setFilterArea('');
                      setShowAreaPicker(false);
                    }}
                    style={styles.filterDropdownItem}
                  >
                    <Text style={styles.filterDropdownItemText}>Todas las áreas</Text>
                  </TouchableOpacity>
                  {areas.map((area) => (
                    <TouchableOpacity
                      key={area.id}
                      onPress={() => {
                        setFilterArea(area.name);
                        setShowAreaPicker(false);
                      }}
                      style={styles.filterDropdownItem}
                    >
                      <Text style={styles.filterDropdownItemText}>{area.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Empleado */}
            <View style={styles.filterField}>
              <Text style={styles.filterFieldLabel}>Empleado</Text>
              <TouchableOpacity
                onPress={() => setShowEmployeePicker(!showEmployeePicker)}
                style={styles.filterPickerButton}
              >
                <Text style={filterEmployee ? styles.filterPickerButtonTextActive : styles.filterPickerButtonTextPlaceholder}>
                  {filterEmployee || "Todos los empleados"}
                </Text>
              </TouchableOpacity>
              {showEmployeePicker && (
                <View style={styles.filterDropdown}>
                  <TouchableOpacity
                    onPress={() => {
                      setFilterEmployee('');
                      setShowEmployeePicker(false);
                    }}
                    style={styles.filterDropdownItem}
                  >
                    <Text style={styles.filterDropdownItemText}>Todos los empleados</Text>
                  </TouchableOpacity>
                  {employees.map((emp) => (
                    <TouchableOpacity
                      key={emp.id}
                      onPress={() => {
                        setFilterEmployee(emp.name);
                        setShowEmployeePicker(false);
                      }}
                      style={styles.filterDropdownItem}
                    >
                      <Text style={styles.filterDropdownItemText}>{emp.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Fechas */}
            <View style={styles.filterField}>
              <Text style={styles.filterFieldLabel}>Fecha Inicio</Text>
              <TextInput
                value={filterDateStart}
                onChangeText={setFilterDateStart}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9CA3AF"
                style={styles.filterDateInput}
              />
            </View>

            <View style={styles.filterField}>
              <Text style={styles.filterFieldLabel}>Fecha Fin</Text>
              <TextInput
                value={filterDateEnd}
                onChangeText={setFilterDateEnd}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9CA3AF"
                style={styles.filterDateInput}
              />
            </View>

            <TouchableOpacity
              onPress={handleExport}
              style={styles.filterExportButton}
            >
              <Download size={20} color="#FFFFFF" />
              <Text style={styles.filterExportButtonText}>Exportar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Lista de Asistencias */}
        <View style={styles.attendanceList}>
          <View style={styles.attendanceListHeaderSection}>
            <Text style={styles.attendanceListHeaderTitle}>
              Registros de Asistencia ({filteredAttendances.length})
            </Text>
          </View>

          {filteredAttendances.length === 0 ? (
            <View style={styles.attendanceEmptyState}>
              <Text style={styles.attendanceEmptyStateText}>No hay registros para mostrar</Text>
            </View>
          ) : (
            <View style={styles.attendanceItemsContainer}>
              {filteredAttendances.map((attendance, index) => (
                <View
                  key={attendance.id}
                  style={index !== filteredAttendances.length - 1 ? styles.attendanceItemContainerWithBorder : styles.attendanceItemContainer}
                >
                  <View style={styles.attendanceItemUser}>
                    <Text style={styles.attendanceItemUserName}>{attendance.user.name}</Text>
                    <Text style={styles.attendanceItemUserArea}>{attendance.user.area.name}</Text>
                  </View>
                  
                  <View style={styles.attendanceItemInfo}>
                    <Text style={styles.attendanceItemPlace}>{attendance.place.name}</Text>
                    <Text style={styles.attendanceItemDate}>{formatDate(attendance.work_date.toString())}</Text>
                  </View>

                  <View style={styles.attendanceItemTimes}>
                    <View style={styles.attendanceItemTimeBlock}>
                      <Text style={styles.attendanceItemTimeLabel}>Entrada</Text>
                      <Text style={styles.attendanceItemTimeValue}>{attendance.entry_time}</Text>
                    </View>
                    <View style={styles.attendanceItemTimeBlock}>
                      <Text style={styles.attendanceItemTimeLabel}>Salida</Text>
                      <Text style={styles.attendanceItemTimeValue}>{attendance.exit_time || '-'}</Text>
                    </View>
                  </View>

                  {attendance.total_hours ? (
                    <View style={styles.attendanceItemBadgeCompleted}>
                      <Text style={styles.attendanceItemBadgeCompletedText}>
                        {attendance.total_hours.toFixed(2)}h
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.attendanceItemBadgeInProgress}>
                      <Text style={styles.attendanceItemBadgeInProgressText}>En progreso</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default AdminDashboard;