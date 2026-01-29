import api from "./api_function";
import * as FileSystem from 'expo-file-system';
import { File, Directory, Paths } from 'expo-file-system';
import { AttendanceEntrance, AttendanceExit, AttendanceFilter, AttendanceResponse } from "./models/attendance";
import { Buffer } from 'buffer';
import * as Sharing from 'expo-sharing';

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
        if(statusCode===404 || statusCode===400 || statusCode===500){
            console.log(`el usuario aun no tiene asistencias registradas : ${error.message}`)
            return []
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
            console.log(`el usuario aun no ha marcado entrada : ${error.message}`)
            return ;
        }

        throw error;
    }
    
}

//METHOD TO DOWNLOAD EXCEL REPORT
export async function DownloadExcelReport(data: AttendanceFilter) {
    try {
        const fileName = `reporte_asistencia_${Date.now()}.xlsx`;
        
        // Crear el File correctamente - pasando Paths.cache como primer argumento
        const file = new File(Paths.cache, fileName);

        // Descargar con Axios
        const response = await api.post('/attendance/createReportAttendance', data, {
            responseType: 'arraybuffer', 
            headers: {
                'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            }
        });

        // Convertir arraybuffer a Uint8Array (bytes)
        const bytes = new Uint8Array(response.data);

        // Escribir el archivo
        await file.write(bytes);

        console.log('Archivo guardado en:', file.uri);

        // Compartir el archivo
        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(file.uri, {
                mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                dialogTitle: 'Reporte de Asistencia',
                UTI: 'com.microsoft.excel.xlsx'
            });
        }

        return file.uri;

    } catch (error: any) {
        console.error('Error al descargar:', error);
        throw error;
    }
}