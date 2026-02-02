import api from "./api_function";
import * as FileSystem from 'expo-file-system';
import { File, Directory, Paths } from 'expo-file-system';
import { AttendanceEntrance, AttendanceExit, AttendanceFilter, AttendanceResponse } from "./models/attendance";
import { Buffer } from 'buffer';
import * as Sharing from 'expo-sharing';

//METHOD TO REGISTER ENTRANCE
export async function RegisterEntrance(data: AttendanceEntrance): Promise<AttendanceResponse | void> {
    try {
        console.log('🔵 INICIO RegisterEntrance');
        console.log('🔵 place_id:', data.place_id);
        console.log('🔵 file.uri:', data.file.uri);
        console.log('🔵 file.name:', data.file.name);
        console.log('🔵 file.type:', data.file.type);

        // ✅ Crear FormData correctamente para React Native
        const formData = new FormData();
        
        // Agregar place_id como string
        formData.append('place_id', data.place_id.toString());
        
        // ✅ CRÍTICO: Formato específico para React Native
        // React Native espera un objeto con uri, type, y name
        formData.append('image', {
            uri: data.file.uri,
            type: data.file.type || 'image/jpeg',
            name: data.file.name || 'face.jpg',
        } as any);

        console.log('📤 Enviando FormData a /attendance/registerEntrance');

        const response = await api.post<AttendanceResponse>(
            '/attendance/registerEntrance',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                // ✅ IMPORTANTE: No transformar el request
                transformRequest: (data) => data,
            }
        );

        console.log('✅ Entrada registrada exitosamente:', response.data);
        return response.data;

    } catch (error: any) {
        console.error('❌ ERROR COMPLETO:', error);
        console.error('❌ Error.message:', error.message);
        console.error('❌ Error.code:', error.code);
        console.error('❌ Error.request:', error.request);
        console.error('❌ Error.response:', error.response);
        
        if (error.response) {
            const statusCode = error.response.status;
            const errorMessage = error.response.data?.detail || error.message;
            console.error(`❌ Backend respondió ${statusCode}: ${errorMessage}`);
            throw new Error(errorMessage);
        } else if (error.request) {
            // Request se hizo pero no hubo respuesta
            console.error('❌ Sin respuesta del servidor');
            console.error('❌ Request enviado:', error.request);
            throw new Error('El servidor no respondió. Verifica la conexión y que el servidor esté corriendo.');
        } else {
            // Error al configurar el request
            console.error('❌ Error al configurar request:', error.message);
            throw new Error('Error al preparar la petición: ' + error.message);
        }
    }
}

//METHOD TO REGISTER EXIT
export async function RegisterExit(data: AttendanceExit): Promise<AttendanceResponse | void> {
    try {
        console.log('🔵 INICIO RegisterExit');
        console.log('🔵 file.uri:', data.file.uri);
        console.log('🔵 file.name:', data.file.name);
        console.log('🔵 file.type:', data.file.type);

        const formData = new FormData();
        
        formData.append('image', {
            uri: data.file.uri,
            type: data.file.type || 'image/jpeg',
            name: data.file.name || 'face.jpg',
        } as any);

        console.log('📤 Enviando FormData a /attendance/registerExit');

        const response = await api.post<AttendanceResponse>(
            '/attendance/registerExit',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                transformRequest: (data) => data,
            }
        );

        console.log('✅ Salida registrada exitosamente:', response.data);
        return response.data;

    } catch (error: any) {
        console.error('❌ ERROR COMPLETO:', error);
        console.error('❌ Error.message:', error.message);
        console.error('❌ Error.code:', error.code);
        console.error('❌ Error.request:', error.request);
        console.error('❌ Error.response:', error.response);
        
        if (error.response) {
            const statusCode = error.response.status;
            const errorMessage = error.response.data?.detail || error.message;
            console.error(`❌ Backend respondió ${statusCode}: ${errorMessage}`);
            throw new Error(errorMessage);
        } else if (error.request) {
            console.error('❌ Sin respuesta del servidor');
            throw new Error('El servidor no respondió. Verifica la conexión.');
        } else {
            console.error('❌ Error al configurar request:', error.message);
            throw new Error('Error al preparar la petición: ' + error.message);
        }
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
export async function GetActualAttendance(): Promise<AttendanceResponse | void> {
    try {
        const response = await api.get<AttendanceResponse>('/attendance/getActualAttendance');
        console.log('✅ GetActualAttendance:', response.data);
        return response.data;

    } catch (error: any) {
        // ✅ No mostrar error si es 400/404 (significa que no hay asistencia activa)
        if (error.response) {
            const statusCode = error.response.status;
            
            if (statusCode === 400 || statusCode === 404) {
                console.log('ℹ️ El usuario aún no ha marcado entrada:', error.response.data?.detail);
                return; // Retornar vacío sin lanzar error
            }
        }
        
        console.error('❌ Error en GetActualAttendance:', error);
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