

export interface CoordinateStruct
{
    latitude: number,
    longitude: number
}

export interface TagStruct
{
    location: string;
    coordinates: CoordinateStruct,
    creationDate: number,
    isFound?: boolean,
    findDate?: number
}

