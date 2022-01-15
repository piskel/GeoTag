import AsyncStorage from "@react-native-async-storage/async-storage";

// /**
//  * A function that stores data in the async storage.
//  * @param key The key to store the data under.
//  * @param value The value to store.
//  */
//  export const storeData = async (key: string, value: any) => {
//     try {
//         await AsyncStorage.setItem(key, value);
//     }
//     catch (e) {
//         console.error(e);
//     }
// }

// /**
//  * A function that stores multiple data in the async storage.
//  * @param keyValuePairs The key value pairs to store.
//  */
//  export const multiStoreData = async (keyValuePairs: string[][]) => {
//     try {
//         await AsyncStorage.multiSet(keyValuePairs);
//     }
//     catch (e) {
//         console.error(e);
//     }
// }

// /**
//  * A function that retrieves data from the async storage.
//  * @param key The key to retrieve the data from.
//  * @param callback The callback to call with the retrieved data.
//  */
//  export const getData = async (key: string, callback: (value: string) => void) => {
//     try {
//         console.log("Accessing data storage");
//         const value = await AsyncStorage.getItem(key);
//         console.log(key, " : ", value);
//         if (value !== null) {
//             callback(value);
//         }
//     } catch (e) {
//         // error reading value
//         console.log("Error while accessing data storage");
//     }
// }

// /**
//  * A function that clears data from the async storage.
//  */
// export const clearData = async () => {
//     try {
//         AsyncStorage.clear();
//     }
//     catch (e) {
//         console.error(e);
//     }
// }