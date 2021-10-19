import React from 'react';
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
import TagStruct from './TagStruct';

// Turns the top bar icons dark
StatusBar.setBarStyle("dark-content");

// Makes the top bar translucent on Android devices
if (Platform.OS === "android") {
  StatusBar.setBackgroundColor("rgba(0,0,0,0)");
  StatusBar.setTranslucent(true);
}


async function resetConfiguration()
{
  // Clears all the storage.
  AsyncStorage.clear();
  await AsyncStorage.setItem('first_start', 'false');

  let tagList:TagStruct[] = [] 
  let jsonTagList = JSON.stringify(tagList); 


  await AsyncStorage.multiSet([
    ['first_start','false'],
    ['TagList',jsonTagList]
  ]);
}

/**
 * Checks if the app is being launched for the first time
 */
async function checkFirstStart()
{
  try
  {
    // TODO : Should use proper JSON parsing instead of string comparison here.
    const firstStart = await AsyncStorage.getItem('first_start');
    if (firstStart === null || firstStart == "true")
    {
      console.log('First launch');
      resetConfiguration();
    }

  }
  catch(e)
  {
    console.error(e);
  }
}



const App = () => {

  checkFirstStart();

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
