import {
  RegisterEntrance,
  RegisterExit,
  GetMyAttendance,
  GetActualAttendance
} from "@/functions/attendance_functions";

import {
  AttendanceEntrance,
  AttendanceExit,
  AttendanceResponse,
} from "@/functions/models/attendance";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";

interface AttendanceContextType {
  attendances: AttendanceResponse[];
  actualAttendance : AttendanceResponse | void;
  loading: boolean;

  canMarkEntry: boolean;
  canMarkExit: boolean;
  finishedToday: boolean;

  getMyAttendances : () => Promise<AttendanceResponse[] | null>
  getActualAttendanceRes : () => Promise<AttendanceResponse | undefined>;
  markEntry: (data: AttendanceEntrance) => Promise<void>;
  markExit: (data: AttendanceExit) => Promise<void>;
  refreshMyAttendances: () => Promise<void>;
}

interface AttendanceProviderProps {
  children: ReactNode;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(
  undefined
);

export const AttendanceProvider = ({ children }: AttendanceProviderProps) => {
  const [attendances, setAttendances] = useState<AttendanceResponse[]>([]);
  const [actualAttendance, setActualAttendance] = useState<AttendanceResponse | void>()
  const [loading, setLoading] = useState(false);

  const refreshMyAttendances = async () => {
    try {
      setLoading(true);

      const [attendanceRes, actualAttendanceRes] = await Promise.all([
        GetMyAttendance(),
        GetActualAttendance()
      ]);

      setAttendances(attendanceRes ?? []);
      setActualAttendance(actualAttendanceRes);

    } catch (error: any) {
      Alert.alert(`ha ocurrido un error inesperado ${error.message}`)
    } finally {
      setLoading(false);
    }
  };

  /* useEffect(() => {
    refreshMyAttendances();
  }, []); */

  const getMyAttendances = async() : Promise<AttendanceResponse[] | null>=> {
    try{
      const response=await GetMyAttendance()

      const data=response ?? []
      setAttendances(data)
      return data

    }catch(error:any){
      Alert.alert(`ha ocurrido un error inesperado ${error.message}`);
      setAttendances([])
      return []
      
    }
  }
  
  const getActualAttendanceRes=async() : Promise<AttendanceResponse | undefined> => {
    try{
      const response=await GetActualAttendance()
      const data=response ??  undefined
      setActualAttendance(data)
      return data

    }catch(error:any){
      Alert.alert(`ha ocurrido un error inesperado ${error.message}`);
      return ;
    }
  }

  const markEntry = async (data: AttendanceEntrance) => {
    try {
      setLoading(true);
      await RegisterEntrance(data);
      Alert.alert(`Entrada registrada correctamente`)
      await refreshMyAttendances();
    } catch (error: any) {
      Alert.alert(`ha ocurrido un error inesperado ${error.message}`)
    } finally {
      setLoading(false);
    }
  };

  const markExit = async (data: AttendanceExit) => {
    try {
      setLoading(true);
      await RegisterExit(data);
      Alert.alert(`Salida registrada correctamente`)
      await refreshMyAttendances();
    } catch (error: any) {
      Alert.alert(`ha ocurrido un error inesperado ${error.message}`)
    } finally {
      setLoading(false);
    }
  };

  const canMarkEntry = !actualAttendance;

  const canMarkExit =
    !!actualAttendance && !actualAttendance.exit_time;

  const finishedToday =
    !!actualAttendance && !!actualAttendance.exit_time;


  return (
    <AttendanceContext.Provider
      value={{
        attendances,
        actualAttendance,
        loading,
        canMarkEntry,
        canMarkExit,
        finishedToday,
        getMyAttendances,
        getActualAttendanceRes,
        markEntry,
        markExit,
        refreshMyAttendances,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendanceContext = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error(
      "useAttendanceContext must be used within AttendanceProvider"
    );
  }
  return context;
};
