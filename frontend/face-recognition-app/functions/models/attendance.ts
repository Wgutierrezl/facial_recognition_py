import { Float } from "react-native/Libraries/Types/CodegenTypes"
import { UserResponse } from "./user"
import { PlaceResponse } from "./place"

export interface AttendanceEntrance{
    place_id:number
    file:any
}

export interface AttendanceExit{
    file:any
}

export interface AttendanceResponse{
    id: number
    /* user_id: string */
    user: UserResponse
    /* place_id: number */
    place: PlaceResponse
    work_date: Date
    entry_time: string
    exit_time: string | null
    total_hours: Float | null
    face_verified: string
}

