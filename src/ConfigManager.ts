import AsyncStorage from "@react-native-async-storage/async-storage";
import { CURRENT_LOCATION_KEY, FIRST_START_KEY } from "./Constants";
import { TagManager } from "./TagManager";
import Geolocation from 'react-native-geolocation-service';
import { CoordinatesStruct } from "./typedef";
import { PermissionsAndroid } from "react-native";
import { requestLocationAccuracy } from "react-native-permissions";



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

        // Set the Geolocation request to the fine accuracy

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


    public static setFirstStart = async () => {
        await AsyncStorage.setItem(FIRST_START_KEY, 'true');
    }

    public static resetCurrentLocation = async () => {
        await AsyncStorage.removeItem(CURRENT_LOCATION_KEY);
        await AsyncStorage.setItem(CURRENT_LOCATION_KEY, JSON.stringify({ latitude: 0, longitude: 0 }));
    }

    public static updateCurrentLocation = async () => {

        Geolocation.getCurrentPosition(
            async (position) => {
                await AsyncStorage.setItem(CURRENT_LOCATION_KEY, JSON.stringify(position.coords));
                // console.log("Current location updated");
                // console.log(position);
            },
            (error) => {
                console.log(error.code, error.message);
            },
            {
                enableHighAccuracy: true,
                timeout: 15000/*, maximumAge: 10000*/,
                // distanceFilter: 10,
                // accuracy:{android: 'high'}
            });
    }


    public static getCurrentLocation = async (): Promise<CoordinatesStruct> => {
        const location = await AsyncStorage.getItem(CURRENT_LOCATION_KEY);
        if (location === null) {
            return { latitude: 0, longitude: 0 };
        }
        else {
            return JSON.parse(location);
        }
    }
}
