import {
  RegisterEntrance,
  RegisterExit,
  GetMyAttendance,
} from "@/functions/attendance_functions";

import {
  AttendanceEntrance,
  AttendanceExit,
  AttendanceResponse,
} from "@/functions/models/attendance";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";

interface AttendanceContextType {
  attendances: AttendanceResponse[];
  loading: boolean;

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
  const [loading, setLoading] = useState(false);

  const refreshMyAttendances = async () => {
    try {
      setLoading(true);
      const response = await GetMyAttendance();
      setAttendances(response ?? []);
    } catch (error: any) {
      Swal.fire("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshMyAttendances();
  }, []);

  const markEntry = async (data: AttendanceEntrance) => {
    try {
      setLoading(true);
      await RegisterEntrance(data);
      Swal.fire("Éxito", "Entrada registrada correctamente", "success");
      await refreshMyAttendances();
    } catch (error: any) {
      Swal.fire("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const markExit = async (data: AttendanceExit) => {
    try {
      setLoading(true);
      await RegisterExit(data);
      Swal.fire("Éxito", "Salida registrada correctamente", "success");
      await refreshMyAttendances();
    } catch (error: any) {
      Swal.fire("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AttendanceContext.Provider
      value={{
        attendances,
        loading,
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
