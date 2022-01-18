import AsyncStorage from "@react-native-async-storage/async-storage";
import { FIRST_START_KEY } from "./Constants";
import { TagManager } from "./TagManager";



/**
 * Resets the config to the default values.
 */
export const resetConfig = async () =>
{
    console.log("Resetting configuration");
    await AsyncStorage.clear();
    await AsyncStorage.setItem(FIRST_START_KEY, "false");
    TagManager.clearTags();

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






