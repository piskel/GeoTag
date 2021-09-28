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
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import MapView, {  } from 'react-native-maps';

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';

import Geolocation from 'react-native-geolocation-service';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

StatusBar.setBarStyle("dark-content");

if (Platform.OS === "android") {
  StatusBar.setBackgroundColor("rgba(0,0,0,0)");  
  StatusBar.setTranslucent(true);
}



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
      flex: 1
    },
    map: {
      ...StyleSheet.absoluteFillObject
    },
    scrollview: {
      flex:1
    }
  });


  return (
    <SafeAreaView style={styles.container} >
      <View style={styles.container}>
        {/* <MapView style={styles.map}
        showsCompass={false}
        // rotateEnabled={false}
        >
        </MapView> */}
      
      {/* <QRCodeScanner
        onRead={(e)=> Alert.alert(e.data)}
        // flashMode={RNCamera.Constants.FlashMode.torch}
        topContent={
          <Text>
            Go to{' '}
            <Text>wikipedia.org/wiki/QR_code</Text> on
            your computer and scan the QR code.
          </Text>
        }
        bottomContent={
          <TouchableOpacity>
            <Text>OK. Got it!</Text>
          </TouchableOpacity>
        }
      /> */}
      </View>
      <ScrollView
        style={styles.scrollview}
      // style={styles.container}
      >

        <Button title="OK" onPress={() => Alert.alert('Button with adjusted color pressed')}></Button>
        <Button title="OK" onPress={() => Alert.alert('Button with adjusted color pressed')}></Button>
        <Button title="OK" onPress={() => Alert.alert('Button with adjusted color pressed')}></Button>
        <Button title="OK" onPress={() => Alert.alert('Button with adjusted color pressed')}></Button>
        <Button title="OK" onPress={() => Alert.alert('Button with adjusted color pressed')}></Button>
        <Button title="OK" onPress={() => Alert.alert('Button with adjusted color pressed')}></Button>
        <Button title="OK" onPress={() => Alert.alert('Button with adjusted color pressed')}></Button>
        <Button title="OK" onPress={() => Alert.alert('Button with adjusted color pressed')}></Button>
        <Button title="OK" onPress={() => Alert.alert('Button with adjusted color pressed')}></Button>
        <Button title="OK" onPress={() => Alert.alert('Button with adjusted color pressed')}></Button>
        <Button title="OK" onPress={() => Alert.alert('Button with adjusted color pressed')}></Button>
        <Button title="OK" onPress={() => Alert.alert('Button with adjusted color pressed')}></Button>
        <Button title="OK" onPress={() => Alert.alert('Button with adjusted color pressed')}></Button>
        <Button title="OK" onPress={() => Alert.alert('Button with adjusted color pressed')}></Button>
        <Button title="OK" onPress={() => Alert.alert('Button with adjusted color pressed')}></Button>

      </ScrollView>
    </SafeAreaView>

  );
}


export default App;
