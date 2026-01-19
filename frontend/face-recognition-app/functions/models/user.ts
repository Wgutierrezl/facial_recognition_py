export interface UserResponse{
    id: number;
    name: string;
    email: string;
    face_id: string;
}

export interface UserCreate{
    name: string;
    email: string;
    file: any;
}

export interface LogUser{
    image:any;
}