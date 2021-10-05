// TODO: Move exploration view code rom App.tsx to here.

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Alert, Button, PanResponder, ScrollView, StyleSheet, View } from "react-native";
import MapView from "react-native-maps";
import { RootStackParamList } from './RootStackParams';


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

  type ExplorationViewProps = NativeStackScreenProps<RootStackParamList, 'ExplorationView'>;

// export interface ExplorationViewProps {};
export interface ExplorationViewState {};

export default class ExplorationView 
extends React.Component<ExplorationViewProps, ExplorationViewState>
{

    render()
    {
        return (
        <View style={styles.container}>
        <View style={styles.container}>
          <MapView style={styles.map}
          showsCompass={false}
          rotateEnabled={false}
          >
          </MapView>
        </View>
        <ScrollView
          style={styles.scrollview}
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
      </View>);
    }
}