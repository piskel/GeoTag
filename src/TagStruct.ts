
export default interface TagStruct
    {
        coordinate:
        {
            latitude: number,
            longitude: number
        },
        creationDate: number,
        isFound: boolean,
        findDate?: Date
    }