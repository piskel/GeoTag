import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Button, ScrollView, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { RootStackParamList } from './RootStackParams';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './styles';
import { Center, Modal } from 'native-base';
import { BarCodeReadEvent, RNCamera } from 'react-native-camera';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TagStruct } from './typedef';
import { FOUND_TAG_LIST_KEY, ONLINE_TAG_LIST_KEY } from './Constants';

// TODO : Let users set their tag either public (displays them on the map)

const storeData = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, value);
  }
  catch (e) {
    console.error(e);
  }
}


const getData = async (key: string, callback: (value: string) => void) => {
  try {
    console.log("Accessing data storage");
    const value = await AsyncStorage.getItem(key);
    console.log(key, " : ", value);
    if (value !== null) {
      callback(value);
    }
  } catch (e) {
    // error reading value
    console.log("Error while accessing data storage");
  }
}

///////////////////////////////////////////////////////////////
// Marker List ////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

type MarkerListProps =
  {
    navigation: NativeStackNavigationProp<RootStackParamList, "ExplorationView">,
    tagList: TagStruct[]
  }


const MarkerList = ({ navigation, tagList }: MarkerListProps) => {

  const markers = tagList.map((tag) =>
    <Marker
      key={`${tag.coordinate.latitude}, ${tag.coordinate.longitude}, ${tag.creationDate}`}
      coordinate={{ latitude: tag.coordinate.latitude, longitude: tag.coordinate.longitude }}
      pinColor={tag.isFound ? "blue" : "red"}
      onPress={() => { navigation.navigate('TagDetailsView', { tag: tag }); }} />
  );
  return (<>{markers}</>);
};


///////////////////////////////////////////////////////////////
// Button List ////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

type ButtonListProps =
  {
    navigation: NativeStackNavigationProp<RootStackParamList, "ExplorationView">,
    tagList: TagStruct[]
  }

const ButtonList = ({ navigation, tagList }: ButtonListProps) => {
  const buttons = tagList.map((tag) =>
    <Button
      key={`${tag.coordinate.latitude}, ${tag.coordinate.longitude}, ${tag.creationDate}`}
      title={`${tag.coordinate.latitude};${tag.coordinate.longitude}`}
      onPress={() => { navigation.navigate('TagDetailsView', { tag: tag }); }}
    ></Button>
  );

  console.log(buttons.length, " buttons");
  return (<>{buttons}</>);
};


///////////////////////////////////////////////////////////////
// Exploration View ///////////////////////////////////////////
///////////////////////////////////////////////////////////////

type ExplorationViewProps = NativeStackScreenProps<RootStackParamList, 'ExplorationView'>;

export interface ExplorationViewState {
  tagList: TagStruct[],
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
      tagList: [],
      showModal: false,
      initialCoordinates: {
        latitude: 0,
        longitude: 0
      }
    }

    this.updateTags = this.updateTags.bind(this);
    this.setShowModal = this.setShowModal.bind(this);
    this.codeBarRead = this.codeBarRead.bind(this);

  }

  setShowModal(showModal: boolean) {
    this.setState({ showModal: showModal });
    this.updateTags();
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
  updateTags() {
    const currentTagList = this.state.tagList;

    this.setState({
      tagList: currentTagList
    });
  }

  /**
   * Runs once the component is loaded.
   */
  async componentDidMount() {

    // Get the initial coordinates of the user
    Geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          initialCoordinates:
          {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }
        });
        console.log(position);
      },
      (error) => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {
        enableHighAccuracy: true, timeout: 15000, maximumAge: 10000
      }
    );

    // TODO : Use DataTools
    // Get the list of tags from the storage and update the state
    const foundTagList = await AsyncStorage.getItem(FOUND_TAG_LIST_KEY) as string;
    const onlineTagList = await AsyncStorage.getItem(ONLINE_TAG_LIST_KEY) as string;
    
    // Merge the two lists
    const tagList = [...JSON.parse(foundTagList), ...JSON.parse(onlineTagList)];
    this.setState({ tagList: tagList });

    

    this.updateTags();

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
              altitude: 0,
              center: {
                latitude: this.state.initialCoordinates.latitude,
                longitude: this.state.initialCoordinates.longitude
              },
              heading: 0, // Camera rotation
              pitch: 90, // Camera inclination
              zoom: 13 // Camera zoom
            }}
          >
            <MarkerList navigation={this.props.navigation} tagList={this.state.tagList} />
          </MapView>

          <View style={styles.scanButtonView}>

            <Icon.Button
              iconStyle={styles.scanButtonStyle}
              style={styles.scanButton}
              name="qrcode"
              size={50}
              onPress={(e) => this.setShowModal(true)}>
            </Icon.Button>

          </View>
        </View>


        <ScrollView style={styles.scrollview}>
          <ButtonList navigation={this.props.navigation} tagList={this.state.tagList} />
        </ScrollView>

        <Center>
          <Modal style={{}} isOpen={this.state.showModal} onClose={() => this.setShowModal(false)} size="lg">
            <Modal.Content style={{}}>
              <Modal.CloseButton />
              <Modal.Header style={{}}>Scan a tag</Modal.Header>
              <Modal.Body style={{ alignItems: "center" }}>
                <RNCamera
                  ratio={'4:4'}
                  style={{ height: 280, width: "110%" }}
                  onBarCodeRead={(e) => { this.codeBarRead(e); }}
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