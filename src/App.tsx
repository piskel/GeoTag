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

// Turns the top bar icons dark
StatusBar.setBarStyle("dark-content");

// Makes the top bar translucent on Android devices
if (Platform.OS === "android") {
  StatusBar.setBackgroundColor("rgba(0,0,0,0)");
  StatusBar.setTranslucent(true);
}




const App = () => {


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
