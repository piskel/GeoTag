import AsyncStorage from "@react-native-async-storage/async-storage";
import { TAG_LIST_KEY } from "./Constants";
import { TagStruct } from "./typedef";


export class TagManager {
    private server_url: string;

    constructor(server_url: string) {
        this.server_url = server_url;
    }


    public static async clearTags():  Promise<void>
    {
        await AsyncStorage.removeItem(TAG_LIST_KEY);
    }


    public static async getTags(): Promise<TagStruct[]>
    {
        const jsonTags = await AsyncStorage.getItem(TAG_LIST_KEY);
        const tagList = jsonTags ? JSON.parse(jsonTags) : [];
        return tagList;
    }




    public async fetchTagsFromServer(): Promise<void>
    {


        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = async () => {
            console.log("Fetched online tags");
            let jsonOnlineTags = xhttp.responseText;

            // TODO: Check for errors in the response
            let onlineTagsList = JSON.parse(jsonOnlineTags) as TagStruct[];
            let tagList = await TagManager.getTags();

            let onlineCoordinates = new Set();
            let localCoordinates = new Set();
            for (let tag of onlineTagsList) {
                onlineCoordinates.add(tag.coordinate);
            }
            for (let tag of tagList) {
                localCoordinates.add(tag.coordinate);
            }



            



            // await AsyncStorage.setItem(ONLINE_TAG_LIST_KEY, jsonOnlineTags);
        }



        console.log("Fetching online tags from " + this.server_url + "/api/geotag");
        xhttp.open("GET", this.server_url + "/api/geotag", true);
        xhttp.send();
    }

    public async postNewTag(latitude: number, longitude: number): Promise<void> {
        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = async () => {
            console.log("Posted new tag");
            // Read the response
            let response = xhttp.responseText;
            console.log(response);
        }
        
        console.log("Posting new tag to " + this.server_url + "/api/geotag");
        // Connection is closed after the response is received
        xhttp.open("POST", this.server_url + "/api/geotag", true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify({latitude: latitude, longitude: longitude}));
    }

    public async verifyScannedTag(tag: string): Promise<boolean> {
        return false;
    }



}

