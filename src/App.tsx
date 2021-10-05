/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';

import Geolocation from 'react-native-geolocation-service';
import ExplorationView from './ExplorationView';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ScanView from './ScanView';

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

  const isDarkMode = useColorScheme() === 'dark';

  // TODO: Put styles in a single ts file
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };


  const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    map: {
      ...StyleSheet.absoluteFillObject
    },
    scrollview: {
      flex: 1
    }
  });

  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
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
