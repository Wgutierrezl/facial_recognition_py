import React, { createContext, useContext, ReactNode } from 'react';
import { Alert } from 'react-native';

import { AreaCreate } from '@/functions/models/area';
import { PlaceCreate, PlaceResponse } from '@/functions/models/place';
import { AttendanceResponse } from '@/functions/models/attendance';

import { CreatePlace } from '@/functions/place_functions';
import { CreateArea } from '@/functions/area_functions';
import {
  GetAllAttendance,
  GetAttendanceByUserId,
} from '@/functions/attendance_functions';

/* =======================
   CONTEXT TYPES
======================= */

interface AdminContextType {
  addPlace: (data: PlaceCreate) => Promise<PlaceResponse | void>;
  addArea: (data: AreaCreate) => Promise<AreaCreate | void>;
  getAttendancesByUser: (userId: string) => Promise<AttendanceResponse[]>;
  getAllAttendances: () => Promise<AttendanceResponse[]>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

/* =======================
   PROVIDER
======================= */

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider = ({ children }: AdminProviderProps) => {
  const addPlace = async (data: PlaceCreate): Promise<PlaceResponse | void> => {
    try {
      return await CreatePlace(data);
    } catch (error: any) {
      Alert.alert(`Error al crear sede: ${error.message}`)
    }
  };

  const addArea = async (data: AreaCreate): Promise<AreaCreate | void> => {
    try {
      return await CreateArea(data);
    } catch (error: any) {
      Alert.alert(`Error al crear área: ${error.message}`)
    }
  };

  const getAttendancesByUser = async (
    userId: string
  ): Promise<AttendanceResponse[]> => {
    try {
      const response = await GetAttendanceByUserId(userId);
      return response ?? [];
    } catch (error: any) {
      Alert.alert(`Error al obtener asistencias: ${error.message}`)
      return [];
    }
  };

  const getAllAttendances = async (): Promise<AttendanceResponse[]> => {
    try {
      const response = await GetAllAttendance();
      return response ?? [];
    } catch (error: any) {
      Alert.alert(`Error al obtener asistencias: ${error.message}`)
      return [];
    }
  };

  return (
    <AdminContext.Provider
      value={{
        addPlace,
        addArea,
        getAttendancesByUser,
        getAllAttendances,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

/* =======================
   HOOK
======================= */

export const useAdminContext = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdminContext must be used within AdminProvider');
  }
  return context;
};
