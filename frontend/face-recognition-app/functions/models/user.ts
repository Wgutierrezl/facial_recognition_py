import { RoleResponse } from "./role";
import { PlaceResponse } from "./place";
import { AreaResponse } from "./area";


export interface UserResponse{
    id: string;
    name: string;
    email: string;
    role:RoleResponse
    area:AreaResponse
    place:PlaceResponse
    face_id: string;
}

export interface UserCreate{
    name: string;
    email: string;
    password: string;
    role_id:number
    area_id:number
    place_id:number
    file: ImageFile;
}

export interface LogUser {
  image: {
    uri: string;
    name: string;
    type: string;
  };
}

export interface ImageFile {
  uri: string;
  type?: string;
  name?: string;
  fileName?: string; // Algunos componentes usan fileName en lugar de name
}

export interface LoginDTO{
    email:string;
    password:string;
}

export interface SessionDTO{
    user_id:string;
    name:string;
    rol:string;
    token:string;
}