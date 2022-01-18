import AsyncStorage from "@react-native-async-storage/async-storage";
import { TAG_LIST_KEY } from "./Constants";
import { CoordinateStruct, TagStruct } from "./typedef";


/**
 * Manages everything tag related.
 */
export class TagManager {
    private server_url: string;

    constructor(server_url: string) {
        this.server_url = server_url;
    }

    /**
     * Clears all tags from local storage.
     */
    public static async clearTags(): Promise<void> {
        await AsyncStorage.removeItem(TAG_LIST_KEY);
    }

    /**
     * Returns all tags from local storage.
     */
    public static async getTags(): Promise<TagStruct[]> {
        const jsonTags = await AsyncStorage.getItem(TAG_LIST_KEY);
        const tagList = jsonTags ? JSON.parse(jsonTags) : [];
        return tagList;
    }


    /**
     * Adds a tag to local storage and checks for duplicates
     * @param tag The tag to add to local storage
     * @param updateTag If true, the tag will be updated in local storage if it already exists
     * @returns If the tag that was added to local storage
     */
    public static async addTag(tag: TagStruct, updateTag: boolean = false): Promise<boolean> {
        // Check if a tag with the same coordinates already exists
        let tagId = await TagManager.findTag(tag.coordinates);

        let tagList = await TagManager.getTags();

        if (tagId === -1) // No tag with the same coordinates exists locally.
        {
            // Add the tag
            tagList.push(tag);
        }
        else if (tagList[tagId].isFound && updateTag) // The tag is already found and the user wants to update it
        {

            // TODO: Check if it works, might cause bugs if the list is not sorted
            tagList[tagId].creationDate = tag.creationDate;
            tagList[tagId].location = tag.location;
        }
        else // If tag does not exist locally at all, add it
        {
            tagList.push(tag);
        }

        await AsyncStorage.setItem(TAG_LIST_KEY, JSON.stringify(tagList));
        return true;
    }

    /**
     * Finds a tag from their coordinates.
     * @param coordinates The coordinates of the tag.
     * @returns The id of the tag if found, -1 otherwise.
     */
    public static async findTag(coordinates: CoordinateStruct): Promise<number> {
        let tagList = await TagManager.getTags();
        let tagId = -1;

        for (let i = 0; i < tagList.length; i++) {
            let currentTag = tagList[i];
            if (currentTag.coordinates.latitude === coordinates.latitude && currentTag.coordinates.longitude === coordinates.longitude) {
                tagId = i;
                break;
            }
        }
        return tagId;
    }

    // /**
    //  * Retrieves a tag from their id in the list.
    //  * @param tagId The id of the tag.
    //  * @returns The tag if found, null otherwise.
    //  */
    // public static async getTagFromId(tagId: number): Promise<TagStruct> {
    //     // TODO: Check if the id is valid
    //     let tagList = await TagManager.getTags();
    //     return tagList[tagId];
    // }


    /**
     * Fetches tags from the server and adds them to local storage.
     */
    public async updateTagsFromServer(): Promise<void> {


        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = async () => {
            console.log("Fetched online tags");
            let jsonOnlineTags = xhttp.responseText;

            // TODO: Check for errors in the response
            let onlineTagsList = JSON.parse(jsonOnlineTags) as TagStruct[];

            // TODO: Remove tags that are not present in the online list

            onlineTagsList.forEach(onlineTag => {
                TagManager.addTag(onlineTag, true);
            });

        }



        console.log("Fetching online tags from " + this.server_url + "/api/geotag");
        xhttp.open("GET", this.server_url + "/api/geotag", true);
        xhttp.send();
    }

    /**
     * Creates a new tag on the server's database.
     * @param latitude Latitude of the tag.
     * @param longitude Longitude of the tag.
     */
    public async postNewTag(coordinates: CoordinateStruct): Promise<void> {
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
        xhttp.send(JSON.stringify({ latitude: coordinates.latitude, longitude: coordinates.longitude }));
    }


    /**
     * Check if the scanned tag is valid.
     * @param latitude Latitude contained in the tag.
     * @param longitude Longitude contained in the tag.
     * @returns If the tag is valid.
     */
    public async verifyScannedTag(coordinates: CoordinateStruct): Promise<boolean> {
        // We update the tags from the server
        await this.updateTagsFromServer();

        // We first check if the tag exists locally
        let tagId = await TagManager.findTag(coordinates);
        if (tagId === -1) {
            return false;
        }

        // We check the distance between the tag and the user's location
        let tagList = await TagManager.getTags();
        let tag = tagList[tagId];
        // let userLocation = await LocationManager.getLocation();


        return false;
    }



}

