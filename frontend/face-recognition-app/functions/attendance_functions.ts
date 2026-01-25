import api from "./api_function";
import { AttendanceEntrance, AttendanceExit, AttendanceResponse } from "./models/attendance";

//METHOD TO REGISTER ENTRANCE
export async function RegisterEntrance(data:AttendanceEntrance)  : Promise<AttendanceResponse | void>{
    try{
        const form=new FormData()

        form.append('place_id', data.place_id.toString());
        form.append('image', data.file)

        const response=await api.post<AttendanceResponse>('/attendance/registerEntrance', form,{
            headers:{
                'Content-Type':'multipart/form-data'
            }
        });

        console.log(response.data);
        return response.data;

    }catch(error:any){
        const statusCode=error.response.status
        if(statusCode===404 || statusCode===400){
            console.log(`ha ocurrido un error ${error.message}`)
            return ;
        }

        throw error;
    }
    
}

//METHOD TO REGISTER EXIT
export async function RegisterExit(data:AttendanceExit)  : Promise<AttendanceResponse | void>{
    try{
        const form=new FormData()

        form.append('image', data.file)

        const response=await api.post<AttendanceResponse>('/attendance/registerExit', form,{
            headers:{
                'Content-Type':'multipart/form-data'
            }
        });

        console.log(response.data);
        return response.data;

    }catch(error:any){
        const statusCode=error.response.status
        if(statusCode===404 || statusCode===400){
            console.log(`ha ocurrido un error ${error.message}`)
            return ;
        }

        throw error;
    }
    
}

//METHOD TO GET ALL MY ATTENDANCE
export async function GetMyAttendance()  : Promise<AttendanceResponse[] | void>{
    try{
        

        const response=await api.get<AttendanceResponse[]>('/attendance/getMyAttendance')
        console.log(response.data);
        return response.data;

    }catch(error:any){
        const statusCode=error.response.status
        if(statusCode===404 || statusCode===400){
            console.log(`ha ocurrido un error ${error.message}`)
            return ;
        }

        throw error;
    }
    
}

//METHOD TO GET ATTENDANCE BY USER ID
export async function GetAttendanceByUserId(user_id:string)  : Promise<AttendanceResponse[] | void>{
    try{
        const response=await api.get<AttendanceResponse[]>(`/attendance/getAttendanceByUserId/${user_id}`)
        console.log(response.data);
        return response.data;

    }catch(error:any){
        const statusCode=error.response.status
        if(statusCode===404 || statusCode===400){
            console.log(`ha ocurrido un error ${error.message}`)
            return ;
        }

        throw error;
    }
    
}

//METHOD TO GET ALL ATTENDANCE
export async function GetAllAttendance()  : Promise<AttendanceResponse[] | void>{
    try{
        const response=await api.get<AttendanceResponse[]>(`/attendance/getAllAttendance`)
        console.log(response.data);
        return response.data;

    }catch(error:any){
        const statusCode=error.response.status
        if(statusCode===404 || statusCode===400){
            console.log(`ha ocurrido un error ${error.message}`)
            return ;
        }

        throw error;
    }
    
}

//METHOD TO GET THE ACTUAL ATTENDANCE BY THE STATE
export async function GetActualAttendance()  : Promise<AttendanceResponse | void>{
    try{
        

        const response=await api.get<AttendanceResponse>('/attendance/getActualAttendance')
        console.log(response.data);
        return response.data;

    }catch(error:any){
        const statusCode=error.response.status
        if(statusCode===404 || statusCode===400){
            console.log(`the user hasnt yet check the entrance ${error.message}`)
            return ;
        }

        throw error;
    }
    
}