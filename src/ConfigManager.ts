import AsyncStorage from "@react-native-async-storage/async-storage";
import { FIRST_START_KEY, FOUND_TAG_LIST_KEY, ONLINE_TAG_LIST_KEY } from "./Constants";



/**
 * Resets the config to the default values.
 */
export const resetConfig = async () =>
{
    console.log("Resetting configuration");
    await AsyncStorage.clear();
    await AsyncStorage.multiSet([
        [FIRST_START_KEY,'false'],
        [ONLINE_TAG_LIST_KEY,"[]"],
        [FOUND_TAG_LIST_KEY,"[]"]
    ]);
}


/**
 * Initializes the configuration.
 */
export const initConfig = async () =>
{
    const firstStart = await AsyncStorage.getItem(FIRST_START_KEY);
    if(firstStart === 'true' || firstStart === null)
    {
        await resetConfig();
    }

    console.log("Configuration initialized");
}


export const setFirstStart = async () =>
{
    await AsyncStorage.setItem(FIRST_START_KEY, 'true');
}


/**
 * A function that loads the found tags with mock data.
 */
export const loadMockConfig = async () =>
{
    let test = JSON.stringify([
        {
            address: "1 rue de la paix",
            coordinate: { latitude: 46.99099099099099, longitude: 6.947142665974343 },
            creationDate: 0,
            isFound: false
        },
        {
            address: "2 rue de la paix",
            coordinate: { latitude: 46.0, longitude: 6.1 },
            creationDate: 0,
            isFound: false
        },
        {
            address: "3 rue de la paix",
            coordinate: { latitude: 46.1, longitude: 6.2 },
            creationDate: 0,
            isFound: false
        },
        {
            address: "4 rue de la paix",
            coordinate: { latitude: 46.2, longitude: 6.3 },
            creationDate: 0,
            isFound: false
        },
        {
            address: "5 rue de la paix",
            coordinate: { latitude: 46.3, longitude: 6.4 },
            creationDate: 0,
            isFound: false
        }
        ]);

        await AsyncStorage.setItem(ONLINE_TAG_LIST_KEY, test);

        console.log("Loaded mock config");
}



