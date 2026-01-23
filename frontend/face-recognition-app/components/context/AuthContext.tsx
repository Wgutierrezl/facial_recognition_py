import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import Swal from "sweetalert2";
import StorageService from "@/functions/storage";
import { Alert } from "react-native";

import { AreaResponse } from "@/functions/models/area";
import { PlaceResponse } from "@/functions/models/place";
import {
  LoginDTO,
  LogUser,
  SessionDTO,
  UserCreate,
  UserResponse
} from "@/functions/models/user";

import {
  RegisterUser,
  LoginManually,
  GetUserByFaceId,
  GetProfile
} from "@/functions/users_functions";

import { GetAllAreas } from "@/functions/area_functions";
import { GetAllPlaces } from "@/functions/place_functions";

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextType {
  currentUser: UserResponse | null;
  places: PlaceResponse[];
  areas: AreaResponse[];

  registerUser: (userData: UserCreate) => Promise<UserResponse | null>;
  loginUser: (data: LoginDTO) => Promise<UserResponse | null>;
  loginWithFacial: (data: LogUser) => Promise<UserResponse | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<UserResponse | null>(null);
  const [places, setPlaces] = useState<PlaceResponse[]>([]);
  const [areas, setAreas] = useState<AreaResponse[]>([]);

  // 🔹 Cargar sedes y áreas para el registro
  useEffect(() => {
    const loadData = async () => {
      try {
        const [placesRes, areasRes] = await Promise.all([
          GetAllPlaces(),
          GetAllAreas()
        ]);

        setPlaces(placesRes ?? []);
        setAreas(areasRes ?? []);
      } catch (error: any) {
        Swal.fire("Error", error.message, "error");
      }
    };

    loadData();
  }, []);

  const registerUser = async (
    userData: UserCreate
  ): Promise<UserResponse | null> => {
    try {
      const response = await RegisterUser(userData);
      return response ?? null;
    } catch (error: any) {
      Alert.alert(`ha ocurrido un error inesperado ${error.message}`)
      return null;
    }
  };

  const loginUser = async (
    data: LoginDTO
  ): Promise<UserResponse | null> => {
    try {
      const session: SessionDTO | void = await LoginManually(data);

      if (!session) return null;

      await StorageService.saveToken(session.token)
      await StorageService.saveRole(session.rol)
      await StorageService.saveUserId(session.user_id)

      const profile = await GetProfile();
      if (profile) {
        setCurrentUser(profile);
        return profile;
      }

      return null;
    } catch (error: any) {
      Alert.alert(`ha ocurrido un error inesperado ${error.message}`)
      return null;
    }
  };

  const loginWithFacial = async (
    data: LogUser
  ): Promise<UserResponse | null> => {
    try {
      const response = await GetUserByFaceId(data);

      if (!response) return null;

      await StorageService.saveToken(response.token)
      await StorageService.saveRole(response.rol)
      await StorageService.saveUserId(response.user_id)

      const profile = await GetProfile();
      if (profile) {
        setCurrentUser(profile);
        return profile;
      }

      return null;
    } catch (error: any) {
      Alert.alert(`ha ocurrido un error inesperado ${error.message}`)
      return null;
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        places,
        areas,
        registerUser,
        loginUser,
        loginWithFacial,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
};
