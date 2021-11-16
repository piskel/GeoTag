import React, { useEffect } from 'react';
import {
  Platform,
  StatusBar,
} from 'react-native';


import ExplorationView from './ExplorationView';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TagDetailsView from './TagDetailsView';
import { NativeBaseProvider } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FIRST_START_KEY, FOUND_TAG_LIST_KEY, ONLINE_TAG_LIST_KEY } from './constants';



// Turns the top bar icons dark
StatusBar.setBarStyle("dark-content");

// Makes the top bar translucent on Android devices
if (Platform.OS === "android") {
  StatusBar.setBackgroundColor("rgba(0,0,0,0)");
  StatusBar.setTranslucent(true);
}




// Resets the app configuration.
const resetConfiguration = async () =>
{
  console.log("Resetting configuration...")
  try
  {

    let test = JSON.stringify([
      {
        coordinate: { latitude: 46.99099099099099, longitude: 6.947142665974343 },
        creationDate: 0,
        isFound: false
      },
      {
        coordinate: { latitude: 46.0, longitude: 6.0 },
        creationDate: 0,
        isFound: false
      }
    ]);
    await AsyncStorage.clear();

    await AsyncStorage.multiSet([
      [FIRST_START_KEY,'false'],
      [ONLINE_TAG_LIST_KEY,"[]"],
      [FOUND_TAG_LIST_KEY,test]
    ]);
  }
  catch(error)
  {
    console.log(error);
  }
}



/**
 * Checks if the app is being launched for the first time
 */
const checkFirstStart = async () =>
{
  // Debug only : resets the configuration
  // await AsyncStorage.clear();
  try
  {
    // TODO : Should use proper JSON parsing instead of string comparison here.
    const firstStart = await AsyncStorage.getItem(FIRST_START_KEY);

    if (firstStart === null || firstStart == "true")
    {
      console.log('First launch');
      await resetConfiguration();
    }

  }
  catch(e)
  {
    // Maybe also reset the configuration here?
    console.error(e);
  }
}

const initApp = async () =>
{
  await checkFirstStart();
}


const App = () => {

  useEffect(() => {
    initApp();
  }, []);  

  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <NativeBaseProvider>
        <Stack.Navigator>

          <Stack.Screen
            name="ExplorationView"
            component={ExplorationView}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="TagDetailsView"
            component={TagDetailsView}
            options={{ headerShown: false }}
          />

        </Stack.Navigator>
      </NativeBaseProvider>
    </NavigationContainer>
  );
}


export default App;
