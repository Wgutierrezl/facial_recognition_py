import { Float } from "react-native/Libraries/Types/CodegenTypes"

export interface AttendanceEntrance{
    place_id:number
    file:any
}

export interface AttendanceExit{
    file:any
}

export interface AttendanceResponse{
    id: number
    user_id: string
    place_id: number
    work_date: Date
    entry_time: string
    exit_time: string | null
    total_hours: Float | null
    face_verified: string
}

