import api from "./api_function";
import Swal from "sweetalert2";
import { PlaceCreate, PlaceResponse } from "./models/place";


export async function CreatePlace(data:PlaceCreate) : Promise<PlaceResponse | void> {
    try{
        const response=await api.post('/places/createPlace', data)
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

export async function GetAllPlaces() : Promise<PlaceResponse[] | void> {
    try{
        const response=await api.get('/places/getAllPlaces')
        console.log(response.data);
        return response.data;

    }catch(error:any){
        const statusCode=error.response.statusCode
        if(statusCode===401 || statusCode===404){
            Swal.fire('informacion','aun no hay sedes en el sistema','info')
            return ;
        }
        
        throw error;

    }
    
}