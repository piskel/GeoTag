import AsyncStorage from "@react-native-async-storage/async-storage";
import { MAX_TAG_DISTANCE, SERVER_URL, TAG_LIST_KEY } from "./Constants";
import { CoordinatesStruct, TagStruct } from "./typedef";
import Geolocation from 'react-native-geolocation-service';
import { ConfigManager } from "./ConfigManager";

/**
 * Manages everything tag related.
 */
export class TagManager {

    private static instance: TagManager;

    private server_url: string;

    private constructor() {
        // TODO: Move this, might be useless
        this.server_url = SERVER_URL;
    }

    /**
     * Returns the instance of the TagManager.
     * @returns Instance of TagManager.
     */
    public static getInstance(): TagManager {
        if (TagManager.instance === undefined) {
            TagManager.instance = new TagManager();
        }
        return TagManager.instance;
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

    public static async setTagToFound(coordinates: CoordinatesStruct): Promise<void> {
        let tagId = await TagManager.findTag(coordinates);
        let tagList = await TagManager.getTags();

        if (tagId !== -1) {
            tagList[tagId].isFound = true;
            tagList[tagId].findDate = new Date().getTime();
            await AsyncStorage.setItem(TAG_LIST_KEY, JSON.stringify(tagList));
        }
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
    public static async findTag(coordinates: CoordinatesStruct): Promise<number> {
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


    /**
     * Fetches tags from the server and adds them to local storage.
     */
    public async updateTagsFromServer(): Promise<void> {


        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = async () => {
            console.log("Fetched online tags");
            let jsonOnlineTags = xhttp.responseText;

            try {
                // TODO: Check for errors in the response

                let onlineTagsList = JSON.parse(jsonOnlineTags) as TagStruct[];
                console.log("Parse successful");

                // TODO: Remove tags that are not present in the online list

                for (let i = 0; i < onlineTagsList.length; i++) {
                    let onlineTag = onlineTagsList[i];
                    await TagManager.addTag(onlineTag, true);
                }
            }
            catch (e) {
                // console.log("Error parsing JSON");
                // console.log(e);
            }

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
    public async postNewTag(coordinates: CoordinatesStruct): Promise<void> {
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
     * Returns de distance between two coordinates.
     * @param c1 Coordinate 1.
     * @param c2 Coordinate 2.
     */
    public static getDistance(c1: CoordinatesStruct, c2: CoordinatesStruct): number {
        // TODO : Add sources

        let R = 6371e3; // metres
        let φ1 = c1.latitude * Math.PI / 180;
        let φ2 = c2.latitude * Math.PI / 180;
        let Δφ = (c2.latitude - c1.latitude) * Math.PI / 180;
        let Δλ = (c2.longitude - c1.longitude) * Math.PI / 180;

        let a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        let d = R * c;
        return d;
    }

    /**
     * Check if the scanned tag is valid.
     * @param latitude Latitude contained in the tag.
     * @param longitude Longitude contained in the tag.
     * @returns If the tag is valid.
     */
    public async verifyScannedTag(data: any, successCallback: () => void, errorCallback: (message:string) => void): Promise<void> {
        // Check that the data are coordinates following the CoordinatesStruct format
        let coordinates = { latitude: 0, longitude: 0 };
        try {
            let coordinatesList = JSON.parse(data);
            coordinates.latitude = coordinatesList[0];
            coordinates.longitude = coordinatesList[1];
            console.log("Parsed coordinates");
        }
        catch (e) {
            console.log("Error parsing coordinates");
            errorCallback("This doesn't seem to be a GeoTag...");
            return;
        }
        
        
        // We update the tags from the server
        console.log("Verifying scanned tag");
        await this.updateTagsFromServer();

        // We first check if the tag exists locally
        let tagId = await TagManager.findTag(coordinates);
        if (tagId === -1) {
            console.log("Tag not found locally");
            errorCallback("The tag you scanned is not in the database.");
            return;
        }

        let currentLocation = await ConfigManager.getCurrentLocation()
        
        let distanceBetweenTags = TagManager.getDistance(currentLocation, coordinates);
        // console.log(distanceBetweenTags);
        console.log("Distance between tag and user: " + distanceBetweenTags);

        // If the tag is within the range, we add it to the list of found tags
        if (distanceBetweenTags <= MAX_TAG_DISTANCE) {
            console.log("Tag found");
            // Warning: We use the tag coordinates as the id and not the user's coordinates
            // this is because the user's coordinates do not match the tag's coordinates in the database
            await TagManager.setTagToFound(coordinates);
            successCallback();
        }
        else
        {
            console.log("Tag not within range");
            errorCallback("This tag is not where it should be.");
        }
    }



}

