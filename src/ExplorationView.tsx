// TODO: Move exploration view code rom App.tsx to here.

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Alert, Button, Pressable, ScrollView, StyleSheet, View } from "react-native";
import MapView, { AnimatedRegion, Marker, MarkerAnimated } from "react-native-maps";
import { RootStackParamList } from './RootStackParams';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  scrollview: {
    flex: 1
  },
  scanButtonView:{
    position:'absolute',
    // alignSelf:'center',
    // alignItems:'center',
    // alignSelf:'center',

    // top:10,
    // left:10,
    bottom:10,
    right:10,
    margin:0,
    padding:0
  },
  scanButton:
  {
    // justifyContent:'center',
    // textAlign:'center',
    // flex:0,
    margin:0,
    padding:2,
    // paddingTop:0,
    // left:0,
    // right:0
  },
  scanButtonStyle:
  {
    marginRight:0,
  }
});


type ExplorationViewProps = NativeStackScreenProps<RootStackParamList, 'ExplorationView'>;

// export interface ExplorationViewProps {};
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

    this.test = this.test.bind(this);
  }


  test() {
    this.setState({ markerList: [] });

    let tmpMarkerList = [];

    for (let i = 0; i < 100; i++) {
      tmpMarkerList.push(<Marker key={i} coordinate={{ latitude: i%180-90, longitude: i%180 }} />);
    }
    this.setState({ markerList: tmpMarkerList });
  }

  componentDidMount() {
    this.test();
  }


  render() {
    // Geolocation.getCurrentPosition(
    //   (position) => {
    //     console.log(position);
    //   },
    //   (error) => {
    //     // See error code charts below.
    //     console.log(error.code, error.message);
    //   },
    //   { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    // );

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