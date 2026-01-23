import api from "./api_function";
import Swal from "sweetalert2";
import { AreaCreate, AreaResponse } from "./models/area";


export async function CreateArea(data:AreaCreate) : Promise<AreaResponse | void> {
    try{
        const response=await api.post<AreaResponse>('/areas/createArea', data)
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

export async function GetAllAreas() : Promise<AreaResponse[] | void> {
    try{
        const response=await api.get<AreaResponse[]>('/areas/getAllAreas')
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