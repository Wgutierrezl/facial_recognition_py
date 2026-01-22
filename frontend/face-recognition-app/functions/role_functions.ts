import api from "./api_function";
import Swal from "sweetalert2";
import { RoleCreate, RoleResponse } from "./models/role";


export async function CreateRole(data:RoleCreate) : Promise<RoleResponse | void> {
    try{
        const response=await api.post('/roles/createRole', data)
        console.log(response.data);
        return response.data;

    }catch(error:any){
        const statusCode=error.response.statusCode
        if(statusCode===401 || statusCode===404){
            Swal.fire('informacion','credenciales invalidas','info')
            return ;
        }
        
        throw error;

    }
    
}

export async function GetAllRoles() : Promise<RoleResponse[] | void> {
    try{
        const response=await api.get('/roles/getAllRoles')
        console.log(response.data);
        return response.data;

    }catch(error:any){
        const statusCode=error.response.statusCode
        if(statusCode===401 || statusCode===404){
            Swal.fire('informacion','aun no hay roles en el sistema','info')
            return ;
        }
        
        throw error;

    }
    
}