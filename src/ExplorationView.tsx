import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Button, ScrollView, View } from "react-native";
import MapView from "react-native-maps";
import { RootStackParamList } from './RootStackParams';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './styles';
import { Center, Modal } from 'native-base';
import { BarCodeReadEvent, RNCamera } from 'react-native-camera';
import Geolocation from 'react-native-geolocation-service';
import TagStruct from './TagStruct';

// TODO : Let users set their tag either public (displays them on the map)

// const storeData = async (value:any) =>
// {
//   try
//   {
//     await AsyncStorage.setItem('@storage_Key', value);
//   }
//   catch(e)
//   {
//     console.error(e);
//   }
// }


// const getData = async () => {
//   try {
//     const value = await AsyncStorage.getItem('@storage_Key')
//     if(value !== null) {
//       console.log(value)
//     }
//   } catch(e) {
//     // error reading value
//   }
// }

type ExplorationViewProps = NativeStackScreenProps<RootStackParamList, 'ExplorationView'>;

export interface ExplorationViewState {
  markerList: TagStruct[],
  showModal: boolean,
  initialCoordinates: {
    latitude: number,
    longitude: number
  }
};

export default class ExplorationView
  extends React.Component<ExplorationViewProps, ExplorationViewState>
{
  constructor(props: ExplorationViewProps | Readonly<ExplorationViewProps>) {
    super(props);
    // this.setState({markerList:[]})

    this.state = {
      markerList: [],
      showModal: false,
      initialCoordinates:{
        latitude:0, 
        longitude:0}
    }

    this.updateMarkers = this.updateMarkers.bind(this);
    this.setShowModal = this.setShowModal.bind(this);
    this.codeBarRead = this.codeBarRead.bind(this);
  }

  setShowModal(showModal: boolean) {
    this.setState({ showModal: showModal });
  }

  /**
   * Is called when a QRCode is read.
   * @param event 
   */
  codeBarRead(event: BarCodeReadEvent) {
    this.setShowModal(false);
    console.log(event);
  }

  /**
   * Updates the list of markers that are displayed on the map.
   */
  updateMarkers() {

  }

  /**
   * Runs once the component is loaded.
   */
  componentDidMount() {
    this.updateMarkers();

    Geolocation.getCurrentPosition(
      (position) => {
        this.setState({initialCoordinates:
          {
            latitude:position.coords.latitude,
            longitude:position.coords.longitude,
          }});
        // console.log(position);
      },
      (error) => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {
        enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
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

            camera={{
              altitude:0,
              center:{
                latitude:this.state.initialCoordinates.latitude,
                longitude:this.state.initialCoordinates.longitude
              },
              heading:0, // Camera rotation
              pitch:90, // Camera inclination
              zoom:13 // Camera zoom
          }}
          >
            {this.state.markerList}
          </MapView>
          <View style={styles.scanButtonView}>
            <Icon.Button iconStyle={styles.scanButtonStyle} style={styles.scanButton} name="qrcode" size={50}
              onPress={(e) => this.setShowModal(true)}
            ></Icon.Button>

          </View>
        </View>

        <ScrollView style={styles.scrollview}>

          <Button title="OK" onPress={() => this.props.navigation.navigate('TagDetailsView', {tag:{coordinate:{latitude:0, longitude:0}, creationDate:Date.now(), isFound:false}})}></Button>
          {/* <Button title="OK" onPress={() => this.props.navigation.navigate('TagDetailsView')}></Button>
          <Button title="OK" onPress={() => this.props.navigation.navigate('TagDetailsView')}></Button>
          <Button title="OK" onPress={() => this.props.navigation.navigate('TagDetailsView')}></Button>
          <Button title="OK" onPress={() => this.props.navigation.navigate('TagDetailsView')}></Button>
          <Button title="OK" onPress={() => this.props.navigation.navigate('TagDetailsView')}></Button>
          <Button title="OK" onPress={() => this.props.navigation.navigate('TagDetailsView')}></Button>
          <Button title="OK" onPress={() => this.props.navigation.navigate('TagDetailsView')}></Button> */}
          
        </ScrollView>

        <Center>
          <Modal style={{}} isOpen={this.state.showModal} onClose={() => this.setShowModal(false)} size="lg">
            <Modal.Content style={{}}>
              <Modal.CloseButton />
              <Modal.Header style={{}}>Scan a tag</Modal.Header>
              <Modal.Body style={{ alignItems:"center"}}>
                <RNCamera
                  ratio={'4:4'}
                  style={{ height: 280, width:"110%"}}
                  onBarCodeRead={(e)=>{this.codeBarRead(e);}}
                  captureAudio={false}
                >
                </RNCamera>
              </Modal.Body>
            </Modal.Content>
          </Modal>
        </Center>

      </View>);
  }
}