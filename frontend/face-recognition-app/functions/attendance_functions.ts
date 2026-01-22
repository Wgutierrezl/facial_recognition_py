import api from "./api_function";
import Swal from "sweetalert2";
import { AttendanceEntrance, AttendanceExit, AttendanceResponse } from "./models/attendance";

//METHOD TO REGISTER ENTRANCE
export async function RegisterEntrance(data:AttendanceEntrance)  : Promise<AttendanceResponse | void>{
    try{
        const form=new FormData()

        form.append('place_id', data.place_id.toString());
        form.append('image', data.file)

        const response=await api.post('/attendance/registerEntrance', form,{
            headers:{
                'Content-Type':'multipart/form-data'
            }
        });

        console.log(response.data);
        return response.data;

    }catch(error:any){
        const statusCode=error.response.status
        if(statusCode===404 || statusCode===400){
            Swal.fire('informacion', 'ya has marcado entrada, no puedes volver a marcar','info')
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

        const response=await api.post('/attendance/registerExit', form,{
            headers:{
                'Content-Type':'multipart/form-data'
            }
        });

        console.log(response.data);
        return response.data;

    }catch(error:any){
        const statusCode=error.response.status
        if(statusCode===404 || statusCode===400){
            Swal.fire('informacion', 'ya has marcado salida, no puedes volver a marcar','info')
            return ;
        }

        throw error;
    }
    
}

//METHOD TO GET ALL MY ATTENDANCE
export async function GetMyAttendance()  : Promise<AttendanceResponse[] | void>{
    try{
        

        const response=await api.get('/attendance/getMyAttendance')
        console.log(response.data);
        return response.data;

    }catch(error:any){
        const statusCode=error.response.status
        if(statusCode===404 || statusCode===400){
            Swal.fire('informacion', 'aun no has empezado a marcar entrada y salida','info')
            return ;
        }

        throw error;
    }
    
}