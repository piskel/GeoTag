// TODO: Move exploration view code rom App.tsx to here.

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Alert, Button, ScrollView, StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { RootStackParamList } from './RootStackParams';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './styles';


type ExplorationViewProps = NativeStackScreenProps<RootStackParamList, 'ExplorationView'>;

export interface ExplorationViewState {
  markerList: any[]
};

export default class ExplorationView
  extends React.Component<ExplorationViewProps, ExplorationViewState>
{
  constructor(props: ExplorationViewProps | Readonly<ExplorationViewProps>) {
    super(props);
    // this.setState({markerList:[]})

    this.state = {
      markerList: []
    }

    this.updateMarkers = this.updateMarkers.bind(this);
  }


  updateMarkers() {
    this.setState({ markerList: [] });

    let tmpMarkerList = [];

    for (let i = 0; i < 100; i++) {
      tmpMarkerList.push(<Marker key={i} coordinate={{ latitude: i%180-90, longitude: i%180 }} />);
    }

    this.setState({ markerList: tmpMarkerList });
  }

  componentDidMount() {
    this.updateMarkers();
  }


  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <MapView style={styles.map}
            showsCompass={false}
            rotateEnabled={false}
            showsUserLocation={true}
            showsMyLocationButton={false}
            followsUserLocation={true}

            showsBuildings={true}
          >
            {this.state.markerList}
          </MapView>
          <View style={styles.scanButtonView}>
          <Icon.Button  iconStyle={styles.scanButtonStyle} style={styles.scanButton}  name="qrcode" size={50} onPress={(e) => this.props.navigation.navigate('ScanView')}></Icon.Button>

          </View>
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