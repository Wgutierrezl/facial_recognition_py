import api from "./api_function";
import { LogUser, UserCreate, UserResponse } from "./models/user";

export async function RegisterUser(data:UserCreate) : Promise<UserResponse | void>  {
    try{
        const form=new FormData();
        form.append('name',data.name);
        form.append('email',data.email);
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