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
  Alert,
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import MapView, {  } from 'react-native-maps';

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';

import Geolocation from 'react-native-geolocation-service';


const App = () =>
{

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

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      // alignItems: 'center',
      // justifyContent: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
      flex:1
    },
    scrollview: {
      flex:1
    }
  });


  return (
    <SafeAreaView style={styles.container} >
      <View style={styles.container}>
        <MapView style={styles.map}>
        </MapView>
      </View>
      <ScrollView
        style={styles.scrollview}
        // style={styles.container}
        >

          <Button title="OK" onPress={() => Alert.alert('Button with adjusted color pressed')}></Button>

      </ScrollView>
    </SafeAreaView>

  );
}


export default App;
