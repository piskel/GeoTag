import AsyncStorage from "@react-native-async-storage/async-storage";
import { CURRENT_LOCATION_KEY, FIRST_START_KEY } from "./Constants";
import { TagManager } from "./TagManager";
import Geolocation from 'react-native-geolocation-service';
import { CoordinatesStruct } from "./typedef";
import { PermissionsAndroid } from "react-native";



export class ConfigManager {
    /**
     * Resets the config to the default values.
     */
    public static resetConfig = async () => {
        console.log("Resetting configuration");
        await AsyncStorage.clear();
        await AsyncStorage.setItem(FIRST_START_KEY, "false");
        await TagManager.clearTags();
    }

    /**
     * Initializes the configuration.
     */
    public static initConfig = async () => {
        const firstStart = await AsyncStorage.getItem(FIRST_START_KEY);
        if (firstStart === 'true' || firstStart === null) {
            await ConfigManager.resetConfig();
            await AsyncStorage.setItem(FIRST_START_KEY, "false");
        }

        // Request fine geolocation permission
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: "GeoTag Fine Location Permission",
                    message:
                        "GeoTag needs to access your location " +
                        "to work properly.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You have fine location access");
            } else {
                console.log("Location permission denied");
            }
        } catch (err) {
            console.warn(err);
        }


        // We update our location every 5 seconds
        let locationUpdateTimer = setInterval(async () => {
            await ConfigManager.updateCurrentLocation();
        }, 5000);

        console.log("Configuration initialized");
    }


    /**
     * Sets our application to "first start" mode in the storage.
     * Will reset all configuration.
     */
    public static setFirstStart = async () => {
        await AsyncStorage.setItem(FIRST_START_KEY, 'true');
    }

    /**
     * Resets our location in the storage.
     */
    public static resetCurrentLocation = async () => {
        await AsyncStorage.removeItem(CURRENT_LOCATION_KEY);
        await AsyncStorage.setItem(CURRENT_LOCATION_KEY, JSON.stringify({ latitude: 0, longitude: 0 }));
    }

    /**
     * Fetches the user's current location and stores in the local storage.
     */
    public static updateCurrentLocation = async () => {
        Geolocation.getCurrentPosition(
            async (position) => {
                await AsyncStorage.setItem(CURRENT_LOCATION_KEY, JSON.stringify(position.coords));

            },
            (error) => {
                console.log(error.code, error.message);
            },
            {
                enableHighAccuracy: true,
                timeout: 15000
            });
    }

    /**
     * Returns the user's current location.
     * @returns The promise for the current location as a CoordinatesStruct.
     */
    public static getCurrentLocation = async (): Promise<CoordinatesStruct> => {
        const location = await AsyncStorage.getItem(CURRENT_LOCATION_KEY);
        if (location === null) // If there is no location set in storage yet, we return the default location
        {
            return { latitude: 0, longitude: 0 };
        }
        else {
            return JSON.parse(location);
        }
    }
}
