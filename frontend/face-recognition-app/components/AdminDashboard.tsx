import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useAppContext, User } from '@/components/context/AppContext';
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

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const { getAllAttendances, users, places, areas, addPlace, addArea } = useAppContext();
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

  const allAttendances = getAllAttendances();
  const employees = users.filter((u) => u.role === 'employee');

  const filteredAttendances = useMemo(() => {
    let filtered = [...allAttendances];

    if (filterSede) {
      filtered = filtered.filter((att) => att.placeName === filterSede);
    }

    if (filterArea) {
      filtered = filtered.filter((att) => att.userArea === filterArea);
    }

    if (filterEmployee) {
      filtered = filtered.filter((att) => att.userName === filterEmployee);
    }

    if (filterDateStart) {
      filtered = filtered.filter((att) => att.date >= filterDateStart);
    }

    if (filterDateEnd) {
      filtered = filtered.filter((att) => att.date <= filterDateEnd);
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [allAttendances, filterSede, filterArea, filterEmployee, filterDateStart, filterDateEnd]);

  const stats = useMemo(() => {
    const totalHours = filteredAttendances.reduce(
      (sum, att) => sum + (att.hoursWorked || 0),
      0
    );

    const thisWeek = filteredAttendances.filter((att) => {
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      weekStart.setHours(0, 0, 0, 0);
      const attDate = new Date(att.date);
      return attDate >= weekStart;
    });

    const thisWeekHours = thisWeek.reduce((sum, att) => sum + (att.hoursWorked || 0), 0);

    const thisMonth = filteredAttendances.filter((att) => {
      const now = new Date();
      const attDate = new Date(att.date);
      return (
        attDate.getMonth() === now.getMonth() && attDate.getFullYear() === now.getFullYear()
      );
    });

    const thisMonthHours = thisMonth.reduce((sum, att) => sum + (att.hoursWorked || 0), 0);

    return {
      totalHours: totalHours.toFixed(1),
      thisWeekHours: thisWeekHours.toFixed(1),
      thisMonthHours: thisMonthHours.toFixed(1),
      totalRecords: filteredAttendances.length,
    };
  }, [filteredAttendances]);

  const handleAddPlace = () => {
    if (newPlaceName.trim()) {
      addPlace(newPlaceName.trim());
      setNewPlaceName('');
      setShowAddPlace(false);
    }
  };

  const handleAddArea = () => {
    if (newAreaName.trim()) {
      addArea(newAreaName.trim());
      setNewAreaName('');
      setShowAddArea(false);
    }
  };

  const handleExport = () => {
    // Simulación de exportación
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
        <View className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center gap-2">
              <Building2 size={20} color="#4B5563" />
              <Text className="text-lg font-semibold text-gray-900">Sedes</Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowAddPlace(true)}
              className="p-2 bg-blue-100 rounded-lg"
            >
              <Plus size={20} color="#2563EB" />
            </TouchableOpacity>
          </View>
          <View className="space-y-2">
            {places.map((place) => (
              <View
                key={place.id}
                className="p-3 bg-gray-50 rounded-lg mb-2"
              >
                <Text className="text-sm font-medium text-gray-900">{place.name}</Text>
              </View>
            ))}
          </View>
          {showAddPlace && (
            <View className="mt-4 gap-2">
              <TextInput
                value={newPlaceName}
                onChangeText={setNewPlaceName}
                placeholder="Nombre de la sede"
                placeholderTextColor="#9CA3AF"
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
              />
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={handleAddPlace}
                  className="flex-1 px-4 py-2 bg-blue-600 rounded-lg"
                >
                  <Text className="text-white text-center font-medium">Agregar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setShowAddPlace(false);
                    setNewPlaceName('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 rounded-lg"
                >
                  <Text className="text-gray-700 text-center font-medium">Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Gestión de Áreas */}
        <View className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center gap-2">
              <Briefcase size={20} color="#4B5563" />
              <Text className="text-lg font-semibold text-gray-900">Áreas</Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowAddArea(true)}
              className="p-2 bg-blue-100 rounded-lg"
            >
              <Plus size={20} color="#2563EB" />
            </TouchableOpacity>
          </View>
          <View className="space-y-2">
            {areas.map((area) => (
              <View
                key={area.id}
                className="p-3 bg-gray-50 rounded-lg mb-2"
              >
                <Text className="text-sm font-medium text-gray-900">{area.name}</Text>
              </View>
            ))}
          </View>
          {showAddArea && (
            <View className="mt-4 gap-2">
              <TextInput
                value={newAreaName}
                onChangeText={setNewAreaName}
                placeholder="Nombre del área"
                placeholderTextColor="#9CA3AF"
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
              />
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={handleAddArea}
                  className="flex-1 px-4 py-2 bg-blue-600 rounded-lg"
                >
                  <Text className="text-white text-center font-medium">Agregar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setShowAddArea(false);
                    setNewAreaName('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 rounded-lg"
                >
                  <Text className="text-gray-700 text-center font-medium">Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Filtros */}
        <View className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <View className="flex-row items-center gap-2 mb-6">
            <Filter size={20} color="#4B5563" />
            <Text className="text-lg font-semibold text-gray-900">Filtros Avanzados</Text>
          </View>

          <View className="gap-4 mb-4">
            {/* Sede */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">Sede</Text>
              <TouchableOpacity
                onPress={() => setShowSedePicker(!showSedePicker)}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
              >
                <Text className={filterSede ? "text-gray-900" : "text-gray-400"}>
                  {filterSede || "Todas las sedes"}
                </Text>
              </TouchableOpacity>
              {showSedePicker && (
                <View className="border border-gray-300 rounded-lg mt-2 bg-white">
                  <TouchableOpacity
                    onPress={() => {
                      setFilterSede('');
                      setShowSedePicker(false);
                    }}
                    className="px-3 py-2 border-b border-gray-200"
                  >
                    <Text className="text-gray-900">Todas las sedes</Text>
                  </TouchableOpacity>
                  {places.map((place) => (
                    <TouchableOpacity
                      key={place.id}
                      onPress={() => {
                        setFilterSede(place.name);
                        setShowSedePicker(false);
                      }}
                      className="px-3 py-2 border-b border-gray-200"
                    >
                      <Text className="text-gray-900">{place.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Área */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">Área</Text>
              <TouchableOpacity
                onPress={() => setShowAreaPicker(!showAreaPicker)}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
              >
                <Text className={filterArea ? "text-gray-900" : "text-gray-400"}>
                  {filterArea || "Todas las áreas"}
                </Text>
              </TouchableOpacity>
              {showAreaPicker && (
                <View className="border border-gray-300 rounded-lg mt-2 bg-white">
                  <TouchableOpacity
                    onPress={() => {
                      setFilterArea('');
                      setShowAreaPicker(false);
                    }}
                    className="px-3 py-2 border-b border-gray-200"
                  >
                    <Text className="text-gray-900">Todas las áreas</Text>
                  </TouchableOpacity>
                  {areas.map((area) => (
                    <TouchableOpacity
                      key={area.id}
                      onPress={() => {
                        setFilterArea(area.name);
                        setShowAreaPicker(false);
                      }}
                      className="px-3 py-2 border-b border-gray-200"
                    >
                      <Text className="text-gray-900">{area.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Empleado */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">Empleado</Text>
              <TouchableOpacity
                onPress={() => setShowEmployeePicker(!showEmployeePicker)}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
              >
                <Text className={filterEmployee ? "text-gray-900" : "text-gray-400"}>
                  {filterEmployee || "Todos los empleados"}
                </Text>
              </TouchableOpacity>
              {showEmployeePicker && (
                <View className="border border-gray-300 rounded-lg mt-2 bg-white">
                  <TouchableOpacity
                    onPress={() => {
                      setFilterEmployee('');
                      setShowEmployeePicker(false);
                    }}
                    className="px-3 py-2 border-b border-gray-200"
                  >
                    <Text className="text-gray-900">Todos los empleados</Text>
                  </TouchableOpacity>
                  {employees.map((emp) => (
                    <TouchableOpacity
                      key={emp.id}
                      onPress={() => {
                        setFilterEmployee(emp.name);
                        setShowEmployeePicker(false);
                      }}
                      className="px-3 py-2 border-b border-gray-200"
                    >
                      <Text className="text-gray-900">{emp.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Fechas */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">Fecha Inicio</Text>
              <TextInput
                value={filterDateStart}
                onChangeText={setFilterDateStart}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9CA3AF"
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">Fecha Fin</Text>
              <TextInput
                value={filterDateEnd}
                onChangeText={setFilterDateEnd}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9CA3AF"
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
              />
            </View>

            <TouchableOpacity
              onPress={handleExport}
              className="px-4 py-2 bg-green-600 rounded-lg flex-row items-center justify-center gap-2"
            >
              <Download size={20} color="#FFFFFF" />
              <Text className="text-white font-medium">Exportar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Lista de Asistencias */}
        <View className="bg-white rounded-xl shadow-lg overflow-hidden">
          <View className="p-6 border-b border-gray-200">
            <Text className="text-lg font-semibold text-gray-900">
              Registros de Asistencia ({filteredAttendances.length})
            </Text>
          </View>

          {filteredAttendances.length === 0 ? (
            <View className="px-6 py-12 items-center">
              <Text className="text-gray-500">No hay registros para mostrar</Text>
            </View>
          ) : (
            <View>
              {filteredAttendances.map((attendance, index) => (
                <View
                  key={attendance.id}
                  className={`p-6 ${index !== filteredAttendances.length - 1 ? 'border-b border-gray-200' : ''}`}
                >
                  <View className="mb-3">
                    <Text className="text-sm font-medium text-gray-900">{attendance.userName}</Text>
                    <Text className="text-xs text-gray-600">{attendance.userArea}</Text>
                  </View>
                  
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-sm text-gray-700">{attendance.placeName}</Text>
                    <Text className="text-sm text-gray-700">{formatDate(attendance.date)}</Text>
                  </View>

                  <View className="flex-row justify-between mb-3">
                    <View>
                      <Text className="text-xs text-gray-600">Entrada</Text>
                      <Text className="text-sm text-gray-900">{attendance.entryTime}</Text>
                    </View>
                    <View>
                      <Text className="text-xs text-gray-600">Salida</Text>
                      <Text className="text-sm text-gray-900">{attendance.exitTime || '-'}</Text>
                    </View>
                  </View>

                  {attendance.hoursWorked ? (
                    <View className="px-3 py-1 rounded-full bg-green-100 self-start">
                      <Text className="text-sm font-medium text-green-800">
                        {attendance.hoursWorked.toFixed(2)}h
                      </Text>
                    </View>
                  ) : (
                    <View className="px-3 py-1 rounded-full bg-yellow-100 self-start">
                      <Text className="text-sm font-medium text-yellow-800">En progreso</Text>
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