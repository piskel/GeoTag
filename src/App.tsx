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
import { TagManager } from './TagManager';
import { ConfigManager } from './ConfigManager';
import { theme } from './styles';





// Turns the top bar icons dark
StatusBar.setBarStyle("dark-content");

// Makes the top bar translucent on Android devices
if (Platform.OS === "android") {
  StatusBar.setBackgroundColor("rgba(0,0,0,0)");
  StatusBar.setTranslucent(true);
}



const initApp = async () =>
{
  // await ConfigManager.setFirstStart(); // Debug only
  await ConfigManager.initConfig();
  // await loadMockConfig(); // Debug only

  const tm = TagManager.getInstance();
  await tm.updateTagsFromServer();
}
 

const App = () => {

  useEffect(() => {
    initApp();
  }, []);  

  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <NativeBaseProvider theme={theme}>
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
