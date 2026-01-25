import api from "./api_function";
import { RoleCreate, RoleResponse } from "./models/role";


export async function CreateRole(data:RoleCreate) : Promise<RoleResponse | void> {
    try{
        const response=await api.post<RoleResponse>('/roles/createRole', data)
        console.log(response.data);
        return response.data;

    }catch(error:any){
        const statusCode=error.response.statusCode
        if(statusCode===401 || statusCode===404){
            console.log(`ha ocurrido un error ${error.message}`)
            return ;
        }
        
        throw error;

    }
    
}

export async function GetAllRoles() : Promise<RoleResponse[] | void> {
    try{
        const response=await api.get<RoleResponse[]>('/roles/getAllRoles')
        console.log(response.data);
        return response.data;

    }catch(error:any){
        const statusCode=error.response.statusCode
        if(statusCode===401 || statusCode===404){
            console.log(`ha ocurrido un error ${error.message}`)
            return ;
        }
        
        throw error;

    }
    
}