import api from "./api_function";
import { LoginDTO, LogUser, SessionDTO, UserCreate, UserResponse } from "./models/user";

//METHOD TO REGISTER AN USER
export async function RegisterUser(data:UserCreate) : Promise<UserResponse | void>  {
    try{
        const form=new FormData();
        form.append('name',data.name);
        form.append('email',data.email);
        form.append('password', data.password);
        form.append('role_id', data.role_id.toString());
        form.append('area_id', data.area_id.toString());
        form.append('place_id', data.place_id.toString());

        // ✅ CORRECCIÓN: Crear el objeto file correctamente para React Native
        if (data.file) {
            // Verificar si data.file ya tiene la estructura correcta (uri, type, name)
            if (typeof data.file === 'object' && 'uri' in data.file) {
                // Ya tiene el formato correcto
                form.append('file', {
                    uri: data.file.uri,
                    type: data.file.type || 'image/jpeg',
                    name: data.file.name || `facial_${Date.now()}.jpg`,
                } as any);
            } else {
                // Si es solo un objeto genérico, intentar construirlo
                console.warn('File object might be incorrectly formatted:', data.file);
                form.append('file', data.file);
            }
        } else {
            console.error('No file provided in registration data');
            throw new Error('Se requiere una imagen facial para el registro');
        }

        console.log('📤 Sending registration data:', {
            name: data.name,
            email: data.email,
            role_id: data.role_id,
            area_id: data.area_id,
            place_id: data.place_id,
            hasFile: !!data.file,
        });

        const response=await api.post<UserResponse>('/users/registerUser',form,{
            headers:{
                'Content-Type':'multipart/form-data'
            }
        })

        console.log(response.data);
        return response.data;

    }catch(error:any){
        console.error('❌ Error registering user:', error);
        console.error('Error details:', error.response?.data || error.message);
        
        // Proporcionar mensaje de error más específico
        if (error.response) {
            throw new Error(error.response.data?.message || 'Error del servidor al registrar usuario');
        } else if (error.request) {
            throw new Error('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
        } else {
            throw new Error(error.message || 'Error desconocido al registrar usuario');
        }
    }
}

//METHOD TO LOG AN USER BY FACE ID
export async function GetUserByFaceId(data:LogUser) : Promise<SessionDTO | void> {
    try{
        const form=new FormData();
        form.append('image',data.image as any);

        const response=await api.post<SessionDTO>('/users/searchUserByFace',form,{
            headers:{
                'Content-Type':'multipart/form-data'
            }
        })

        console.log(response.data);
        return response.data;

    }catch(error:any){
        console.error('Error getting user by face id:',error.message);
    }
}

//METHOD TO LOG USER MANUALLY
export async function LoginManually(data:LoginDTO) : Promise<SessionDTO | void> {
    try{
        const response=await api.post<SessionDTO>('/users/loginManually',data)
        console.log(response.data)
        return response.data

    }catch(error:any){
        const statusCode=error.response.statusCode
        if(statusCode===401 || statusCode===404){
            console.log(`ha ocurrido un error ${error.message}`)
            return ;
        }

        throw error;

    }
    
}

//METHOD TO GET ALL USERS - ADMIN
export async function GetAllUsers() : Promise<UserResponse[] | void> {
    try{
        const response=await api.get<UserResponse[]>('/users/getAllUsers')
        console.log(response.data)
        return response.data 

    }catch(error:any){
        const statusCode=error.response.statusCode
        if(statusCode===401 || statusCode===404){
            console.log(`ha ocurrido un error ${error.message}`)
            return ;
        }

        throw error;

    }
    
}

//METHOD TO GET USER PROFILE
export async function GetProfile() : Promise<UserResponse | void> {
    try{
        const response=await api.get<UserResponse>('/users/getProfile')
        console.log(response.data)
        return response.data

    }catch(error:any){
        const statusCode=error.response.statusCode
        if(statusCode===401 || statusCode===404){
            console.log(`ha ocurrido un error ${error.message}`)
            return ;
        }

        throw error;

    }
    
}
