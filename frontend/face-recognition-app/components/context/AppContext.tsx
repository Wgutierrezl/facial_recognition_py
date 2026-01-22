import React, { createContext, useContext, useState, ReactNode } from 'react';

// Tipos
export type UserRole = 'employee' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  area: string;
  sede: string;
  facialImage?: string;
  status: 'dentro' | 'fuera';
}

export interface Place {
  id: string;
  name: string;
}

export interface Area {
  id: string;
  name: string;
}

export interface Attendance {
  id: string;
  userId: string;
  userName: string;
  userArea: string;
  placeId: string;
  placeName: string;
  date: string;
  entryTime?: string;
  exitTime?: string;
  hoursWorked?: number;
  facialVerified: boolean;
}

interface AppContextType {
  users: User[];
  places: Place[];
  areas: Area[];
  attendances: Attendance[];
  currentUser: User | null;
  registerUser: (userData: Omit<User, 'id' | 'status'>) => void;
  loginUser: (email: string, password: string) => User | null;
  loginWithFacial: (facialData: string) => User | null;
  logout: () => void;
  markEntry: (userId: string, placeId: string) => void;
  markExit: (userId: string) => void;
  addPlace: (name: string) => void;
  addArea: (name: string) => void;
  getAttendancesByUser: (userId: string) => Attendance[];
  getAllAttendances: () => Attendance[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Datos iniciales mock
const initialPlaces: Place[] = [
  { id: 'place-1', name: 'Oficina Central' },
  { id: 'place-2', name: 'Sucursal Norte' },
  { id: 'place-3', name: 'Sucursal Sur' },
];

const initialAreas: Area[] = [
  { id: 'area-1', name: 'Desarrollo' },
  { id: 'area-2', name: 'Diseño' },
  { id: 'area-3', name: 'Marketing' },
  { id: 'area-4', name: 'Ventas' },
  { id: 'area-5', name: 'Recursos Humanos' },
];

const initialUsers: User[] = [
  {
    id: 'user-1',
    name: 'Juan Pérez',
    email: 'empleado@example.com',
    password: '123456',
    role: 'employee',
    area: 'Desarrollo',
    sede: 'Oficina Central',
    facialImage: 'facial-data-1',
    status: 'fuera',
  },
  {
    id: 'user-2',
    name: 'Admin Usuario',
    email: 'admin@example.com',
    password: 'admin',
    role: 'admin',
    area: 'Recursos Humanos',
    sede: 'Oficina Central',
    status: 'fuera',
  },
];

const initialAttendances: Attendance[] = [
  {
    id: 'att-1',
    userId: 'user-1',
    userName: 'Juan Pérez',
    userArea: 'Desarrollo',
    placeId: 'place-1',
    placeName: 'Oficina Central',
    date: '2026-01-20',
    entryTime: '08:30',
    exitTime: '17:45',
    hoursWorked: 9.25,
    facialVerified: true,
  },
  {
    id: 'att-2',
    userId: 'user-1',
    userName: 'Juan Pérez',
    userArea: 'Desarrollo',
    placeId: 'place-1',
    placeName: 'Oficina Central',
    date: '2026-01-21',
    entryTime: '09:00',
    exitTime: '18:00',
    hoursWorked: 9,
    facialVerified: true,
  },
  {
    id: 'att-3',
    userId: 'user-1',
    userName: 'Juan Pérez',
    userArea: 'Desarrollo',
    placeId: 'place-1',
    placeName: 'Oficina Central',
    date: '2026-01-22',
    entryTime: '08:45',
    exitTime: undefined,
    hoursWorked: undefined,
    facialVerified: true,
  },
];

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [places, setPlaces] = useState<Place[]>(initialPlaces);
  const [areas, setAreas] = useState<Area[]>(initialAreas);
  const [attendances, setAttendances] = useState<Attendance[]>(initialAttendances);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const registerUser = (userData: Omit<User, 'id' | 'status'>) => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      status: 'fuera',
    };
    setUsers((prev) => [...prev, newUser]);
  };

  const loginUser = (email: string, password: string): User | null => {
    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      return user;
    }
    return null;
  };

  const loginWithFacial = (facialData: string): User | null => {
    // Simulación de reconocimiento facial
    const user = users.find((u) => u.facialImage === facialData);
    if (user) {
      setCurrentUser(user);
      return user;
    }
    return null;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const markEntry = (userId: string, placeId: string) => {
    const user = users.find((u) => u.id === userId);
    const place = places.find((p) => p.id === placeId);
    
    if (user && place) {
      const today = new Date().toISOString().split('T')[0];
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      const newAttendance: Attendance = {
        id: `att-${Date.now()}`,
        userId: user.id,
        userName: user.name,
        userArea: user.area,
        placeId: place.id,
        placeName: place.name,
        date: today,
        entryTime: currentTime,
        exitTime: undefined,
        hoursWorked: undefined,
        facialVerified: true,
      };

      setAttendances((prev) => [...prev, newAttendance]);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: 'dentro' as const } : u))
      );
      setCurrentUser((prev) => (prev?.id === userId ? { ...prev, status: 'dentro' as const } : prev));
    }
  };

  const markExit = (userId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setAttendances((prev) =>
      prev.map((att) => {
        if (att.userId === userId && att.date === today && !att.exitTime) {
          const entry = att.entryTime;
          const [entryHour, entryMin] = entry!.split(':').map(Number);
          const [exitHour, exitMin] = currentTime.split(':').map(Number);
          const hoursWorked = exitHour - entryHour + (exitMin - entryMin) / 60;

          return {
            ...att,
            exitTime: currentTime,
            hoursWorked: Math.round(hoursWorked * 100) / 100,
          };
        }
        return att;
      })
    );

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: 'fuera' as const } : u))
    );
    setCurrentUser((prev) => (prev?.id === userId ? { ...prev, status: 'fuera' as const } : prev));
  };

  const addPlace = (name: string) => {
    const newPlace: Place = {
      id: `place-${Date.now()}`,
      name,
    };
    setPlaces((prev) => [...prev, newPlace]);
  };

  const addArea = (name: string) => {
    const newArea: Area = {
      id: `area-${Date.now()}`,
      name,
    };
    setAreas((prev) => [...prev, newArea]);
  };

  const getAttendancesByUser = (userId: string): Attendance[] => {
    return attendances.filter((att) => att.userId === userId);
  };

  const getAllAttendances = (): Attendance[] => {
    return attendances;
  };

  return (
    <AppContext.Provider
      value={{
        users,
        places,
        areas,
        attendances,
        currentUser,
        registerUser,
        loginUser,
        loginWithFacial,
        logout,
        markEntry,
        markExit,
        addPlace,
        addArea,
        getAttendancesByUser,
        getAllAttendances,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};