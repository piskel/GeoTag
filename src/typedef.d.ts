
export interface TagStruct
{
    location: string;
    coordinate:
    {
        latitude: number,
        longitude: number
    },
    creationDate: number,
    isFound?: boolean,
    findDate?: number
}

