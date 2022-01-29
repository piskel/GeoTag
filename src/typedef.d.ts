

export interface CoordinatesStruct {
    latitude: number,
    longitude: number
}

export interface TagStruct {
    location: string;               // The name of the location of the tag
    coordinates: CoordinatesStruct, // The coordinates of the tag
    creationDate: number,           // The date of creation of the tag
    isFound?: boolean,              // The status of the tag
    findDate?: number               // The date of the find
}

