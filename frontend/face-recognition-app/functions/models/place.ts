export interface PlaceCreate{
    name: string
    latitude: string
    longitude: string
    radius_meters: number
}

export interface PlaceResponse{
    id:number
    name: string
    latitude: string
    longitude: string
    radius_meters: number
}