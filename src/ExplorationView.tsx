import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { RootStackParamList } from './RootStackParams';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './styles';
import { Box, Center, Heading, Modal, Stagger } from 'native-base';
import { BarCodeReadEvent, RNCamera } from 'react-native-camera';
import Geolocation from 'react-native-geolocation-service';
import { TagStruct } from './typedef';
import { TagManager } from './TagManager';

// TODO : Let users set their tag either public (displays them on the map)

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




type GeoTagButtonProps =
  {
    navigation: NativeStackNavigationProp<RootStackParamList, "ExplorationView">,
    tag: TagStruct
  }




const GeoTagButton = ({ navigation, tag }: GeoTagButtonProps) => {
  console.log(tag);
  return (
    <TouchableOpacity
      onPress={() => { navigation.navigate('TagDetailsView', { tag: tag }); }}
      style={{marginBottom:10}}

    >
      <Box
      style={{
        backgroundColor: "#fff",
        borderRadius: 5,
      }}>
        <Heading size="xs" textAlign={"center"} >
        {tag.location}
        </Heading>
      </Box>
    </TouchableOpacity>
    );
    }
    


type ButtonListProps =
{
  navigation: NativeStackNavigationProp<RootStackParamList, "ExplorationView">,
  tagList: TagStruct[]
}

const ButtonList = ({ navigation, tagList }: ButtonListProps) => {

  const buttons = tagList.map((tag, i) =>
    <GeoTagButton navigation={navigation} tag={tag} key={i} />
  );
  

  return (<>{buttons}</>);
};


///////////////////////////////////////////////////////////////
// Exploration View ///////////////////////////////////////////
///////////////////////////////////////////////////////////////

type ExplorationViewProps = NativeStackScreenProps<RootStackParamList, 'ExplorationView'>;

export interface ExplorationViewState {
  tagList: TagStruct[],
  showModal: boolean,
  showStagger: boolean,
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
      showStagger: false,
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
  }

  setShowStagger(showStagger: boolean) {
    this.setState({ showStagger: showStagger });
  }

  /**
   * Is called when a QRCode is read.
   * @param event 
   */
  codeBarRead(event: BarCodeReadEvent) {

    console.log(event["data"]);
    this.setShowModal(false);
  }

  /**
   * Updates the list of markers that are displayed on the map.
   */
  async updateTags() {
    
    let tagList = await TagManager.getTags();

    
    this.setState({
      tagList: tagList
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
        // console.log(position);
      },
      (error) => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {
        enableHighAccuracy: true, timeout: 15000, maximumAge: 10000
      }
    );

    
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
          
          
          <View style={styles.navView}>

            <Stagger visible={this.state.showStagger}>
              <Icon name="bomb"color="#f0f"size={25}></Icon>
              <Icon name="skull"color="#f00"size={25}></Icon>
              <Icon name="radioactive"color="#00f"size={25}></Icon>
              <Icon name="biohazard"color="#ff0"size={25}></Icon>
              <Icon name="emoticon-happy"color="#0ff"size={25}></Icon>
            </Stagger>


            <View style={{marginBottom:10}}>
              <Icon.Button
                iconStyle={styles.scanButtonStyle}
                style={styles.staggerButton}
                name="knife"
                size={50}
                onPress={(e) => this.setShowStagger(!this.state.showStagger)}>
              </Icon.Button>
            </View>

            {/* TODO: Add stagger */}
              
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


          <ScrollView style={styles.buttonListView}>
            <ButtonList navigation={this.props.navigation} tagList={this.state.tagList} />
          </ScrollView>


        </View>




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