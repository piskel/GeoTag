

export interface CoordinatesStruct
{
    latitude: number,
    longitude: number
}

export interface TagStruct
{
    location: string;
    coordinates: CoordinatesStruct,
    creationDate: number,
    isFound?: boolean,
    findDate?: number
}

