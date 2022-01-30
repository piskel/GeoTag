import AsyncStorage from "@react-native-async-storage/async-storage";
import { MAX_TAG_DISTANCE, SERVER_URL, TAG_LIST_KEY } from "./Constants";
import { CoordinatesStruct, TagStruct } from "./typedef";
import { ConfigManager } from "./ConfigManager";
import { ToastAndroid } from "react-native";


enum RequestType {
    GET = "GET",
    POST = "POST"
}


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


    public async initRequestListeners() {

    }



    /**
     * Sends a request to the API server.
     * @param requestType The type of request to send.
     * @param path The path to the API endpoint.
     * @param data The data to send if the request is a POST request.
     * @param successCallback The callback to call if the request was successful.
     * @param errorCallback The callback to call if the request failed.
     */
    public async makeRequestToServer(
        requestType: RequestType,
        path: string,
        data: any = null,
        successCallback: (response: any) => void,
        errorCallback: (error_message: string) => void
    ): Promise<void> {
        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = async () => {

            // Catching errors from the server
            if (xhttp.readyState != 4 || xhttp.status != 200) {
                //@ts-ignore
                if (xhttp._hasError) {
                    errorCallback("There seems to be an issue with the server. Please try again later.");
                }
                return;
            }

            // If the request was successful
            try {
                // TODO: Define the response format of the server and handle it accordingly
                let response = JSON.parse(xhttp.responseText);
                console.log("SERVER OK")
                successCallback(response);
            }
            catch (e) {
                errorCallback("There seems to be an issue with the server. Please try again later.");
            }
        }

        try {

            xhttp.open(requestType, this.server_url + path, true);
            console.log("Sending " + requestType + " request to " + this.server_url + path);

            if (requestType === RequestType.POST) {
                xhttp.setRequestHeader("Content-Type", "application/json");
                xhttp.send(JSON.stringify(data));
            }
            else {
                xhttp.send();
            }
        }
        catch (error) {
            // If fails, JSON is probably invalid
            errorCallback("There has been an issue while trying to reach the server.");
        }
    }


    /**
     * Update the tags on the local storage by fetching them from the server.
     * @param successCallback Callback function that is called when the tags are updated.
     * @param errorCallback Callback function that is called when an error occurs.
     */
    public async updateTagsFromServer(errorCallback: (message: string) => void): Promise<void> {


        let successCallbackWrapper = async (response: any) => {
            let onlineTagsList = response as TagStruct[];
            console.log("Parse successful");

            // TODO: Remove tags that are not present in the online list

            for (let i = 0; i < onlineTagsList.length; i++) {
                let onlineTag = onlineTagsList[i];
                await TagManager.addTag(onlineTag, true);
            }
        }



        this.makeRequestToServer(
            RequestType.GET,
            "/api/geotag",
            null,
            successCallbackWrapper,
            errorCallback
        );
    }

    /**
     * Creates a new tag on the server's database.
     * @param latitude Latitude of the tag.
     * @param longitude Longitude of the tag.
     */
    public async postNewTag(coordinates: CoordinatesStruct, successCallback: () => void, errorCallback: (message: string) => void): Promise<void> {

        // TODO: Should be done only after confirmation that the user placed the tag at the correct location

        this.makeRequestToServer(
            RequestType.POST,
            "/api/geotag",
            {
                "latitude": coordinates.latitude,
                "longitude": coordinates.longitude
            },
            successCallback,
            errorCallback
        );
    }

    /**
     * Returns de distance between two coordinates.
     * @param c1 Coordinate 1.
     * @param c2 Coordinate 2.
     */
    public static getDistance(
        c1: CoordinatesStruct,
        c2: CoordinatesStruct): number {
        // https://www.movable-type.co.uk/scripts/latlong.html

        let R = 6371e3; // Constant for the earth's radius
        let φ1 = c1.latitude * Math.PI / 180; // Convert to radians
        let φ2 = c2.latitude * Math.PI / 180; // Convert to radians
        let Δφ = (c2.latitude - c1.latitude) * Math.PI / 180; // Difference in latitude
        let Δλ = (c2.longitude - c1.longitude) * Math.PI / 180; // Difference in longitude

        // Calculate the great circle distance using the Haversine formula
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
    public async verifyScannedTag(data: any, successCallback: () => void, errorCallback: (message: string) => void): Promise<void> {
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


        // We fetch the tags from the server
        await this.updateTagsFromServer(errorCallback);

        let currentLocation = await ConfigManager.getCurrentLocation()
        let tagDistance = TagManager.getDistance(currentLocation, coordinates);
        console.log("Distance between tag and user: " + tagDistance);



        // If the tag is within the range, we add it to the list of found tags
        if (tagDistance <= MAX_TAG_DISTANCE) {


            // We check if the tag exists locally
            let tagId = await TagManager.findTag(coordinates);

            if (tagId === -1) {
                // errorCallback("The tag you scanned is not in the database.");
                // Add the tag to the database
                await this.postNewTag(coordinates, () => {
                    ToastAndroid.show("Tag added to the database", ToastAndroid.SHORT);
                    successCallback();
                }
                    , errorCallback);

            }
            else {
                // console.log(distanceBetweenTags);

                console.log("Tag found");
                ToastAndroid.show("Tag found!", ToastAndroid.SHORT);
                // Warning: We use the tag coordinates as the id and not the user's coordinates
                // this is because the user's coordinates do not match the tag's coordinates in the database
            }
            await TagManager.setTagToFound(coordinates);


            successCallback();
        }
        else {
            errorCallback("This tag is not where it should be. A tag should be within " + MAX_TAG_DISTANCE + " it's from it's set location.");
        }
    }



}

