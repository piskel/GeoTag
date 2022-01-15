import AsyncStorage from "@react-native-async-storage/async-storage";
import { FOUND_TAG_LIST_KEY, ONLINE_TAG_LIST_KEY } from "./Constants";
import { TagStruct } from "./typedef";


export class TagManager
{
    private server_url: string;
    
    constructor(server_url: string)
    {
        this.server_url = server_url;
    }

    public static async getOnlineTags(): Promise<TagStruct[]>
    {
        const jsonOnlineTags = await AsyncStorage.getItem(ONLINE_TAG_LIST_KEY);
        const onlineTagsList = jsonOnlineTags ? JSON.parse(jsonOnlineTags) : [];
        return onlineTagsList;
    }

    public static async getFoundTags(): Promise<TagStruct[]>
    {
        const jsonFoundTags = await AsyncStorage.getItem(FOUND_TAG_LIST_KEY);
        const foundTagsList = jsonFoundTags ? JSON.parse(jsonFoundTags) : [];
        return foundTagsList;
    }



    public async fetchOnlineTags(): Promise<void>
    {

        // Fonctionne quand le debugger fait le changement en live, mais pas à un refresh

        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = async () =>
        {
            console.log("Fetched online tags");
            // console.log(JSON.stringify(xhttp, null, 2));
            // console.log(xhttp);

            // TODO: Make sure that the response is valid
            let jsonOnlineTags = xhttp.responseText;
            await AsyncStorage.setItem(ONLINE_TAG_LIST_KEY, jsonOnlineTags);
        }

        console.log("Fetching online tags from " + this.server_url+"/api/geotag");
        // Connection is closed after the response is received
        xhttp.open("GET", this.server_url + "/api/geotag", true);
        xhttp.send();


        // Fetching tags from Flask API server
        
        // GET /api/geotag
        // let response = await fetch(this.server_url + "/api/geotag");
        // let jsonOnlineTags = await response.json();
        // console.log("Fetched online tags");
        // console.log(jsonOnlineTags);


    }

    public async verifyScannedTag(tag: string): Promise<boolean>
    {
        return false;
    }


}