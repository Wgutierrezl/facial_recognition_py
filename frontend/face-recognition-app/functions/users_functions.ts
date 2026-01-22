import api from "./api_function";
import Swal from 'sweetalert2'
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
        form.append('file',data.file);

        const response=await api.post<UserResponse>('/users/registerUser',form,{
            headers:{
                'Content-Type':'multipart/form-data'
            }
        })

        console.log(response.data);
        return response.data;

    }catch(error:any){
        console.error('Error registering user:',error.message);
    }
}

//METHOD TO LOG AN USER BY FACE ID
export async function GetUserByFaceId(data:LogUser) : Promise<UserResponse | void> {
    try{
        const form=new FormData();
        form.append('image',data.image);

        const response=await api.post<UserResponse>('/users/searchUserByFace',form,{
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
        const response=await api.post('/users/loginManually',data)
        console.log(response.data)
        return response.data

    }catch(error:any){
        const statusCode=error.response.statusCode
        if(statusCode===401 || statusCode===404){
            Swal.fire('informacion','credenciales invalidad','info')
            return ;
        }

        throw error;

    }
    
}

//METHOD TO GET ALL USERS - ADMIN
export async function GetAllUsers() : Promise<UserResponse[] | void> {
    try{
        const response=await api.get('/users/getAllUsers')
        console.log(response.data)
        return response.data

    }catch(error:any){
        const statusCode=error.response.statusCode
        if(statusCode===401 || statusCode===404){
            Swal.fire('informacion','aun no hay usuarios en el sistema','info')
            return ;
        }

        throw error;

    }
    
}

//METHOD TO GET USER PROFILE
export async function GetProfile() : Promise<UserResponse | void> {
    try{
        const response=await api.get('/users/getProfile')
        console.log(response.data)
        return response.data

    }catch(error:any){
        const statusCode=error.response.statusCode
        if(statusCode===401 || statusCode===404){
            Swal.fire('informacion','credenciales invalidas','info')
            return ;
        }

        throw error;

    }
    
}
