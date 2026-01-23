import api from "./api_function";
import Swal from "sweetalert2";
import { PlaceCreate, PlaceResponse } from "./models/place";
import { RoleResponse } from "./models/role";


export async function CreatePlace(data:PlaceCreate) : Promise<PlaceResponse | void> {
    try{
        const response=await api.post<PlaceResponse>('/places/createPlace', data)
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

export async function GetAllPlaces() : Promise<PlaceResponse[] | void> {
    try{
        const response=await api.get<PlaceResponse[]>('/places/getAllPlaces')
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