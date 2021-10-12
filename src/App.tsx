import React from 'react';
import {
  Platform,
  StatusBar,
} from 'react-native';


import Geolocation from 'react-native-geolocation-service';
import ExplorationView from './ExplorationView';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ScanView from './ScanView';
import TagDetailsView from './TagDetailsView';

StatusBar.setBarStyle("dark-content");

if (Platform.OS === "android") {
  StatusBar.setBackgroundColor("rgba(0,0,0,0)");
  StatusBar.setTranslucent(true);
}



const App = () => {

  // GEOLOCATION
  Geolocation.getCurrentPosition(
    (position) => {
      console.log(position);
    },
    (error) => {
      // See error code charts below.
      console.log(error.code, error.message);
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
  );

  ///////////////////////////////////

  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>


      <Stack.Screen
          name="TagDetailsView"
          component={TagDetailsView}
          options={{ headerShown: false }}
        />

      <Stack.Screen
          name="ExplorationView"
          component={ExplorationView}
          options={{ headerShown: false }}
        />
 
      <Stack.Screen
          name="ScanView"
          component={ScanView}
          options={{ headerShown: false }}
        />


      </Stack.Navigator>
    </NavigationContainer>

  );
}


export default App;
