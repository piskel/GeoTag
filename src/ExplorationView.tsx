import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, TouchableOpacity, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { RootStackParamList } from './RootStackParams';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { customMapLightStyle, styles, themeColors } from './styles';
import { Box, Center, Heading, Modal } from 'native-base';
import { BarCodeReadEvent, RNCamera } from 'react-native-camera';
import { TagStruct } from './typedef';
import { TagManager } from './TagManager';
import { ConfigManager } from './ConfigManager';
import { ErrorModal } from './Components';



// TODO : Let users set their tag either public (displays them on the map)

// TODO : Move components in a separate file


///////////////////////////////////////////////////////////////
// Marker List ////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

// type MarkerListProps =
//   {
//     navigation: NativeStackNavigationProp<RootStackParamList, "ExplorationView">,
//     tagList: TagStruct[]
//   }


// const MarkerList = ({ navigation, tagList }: MarkerListProps) => {

//   const markers = tagList.map((tag, i) =>
//     <Marker
//       key={i}
//       coordinate={{ latitude: tag.coordinates.latitude, longitude: tag.coordinates.longitude }}
//       pinColor={tag.isFound ? "blue" : "red"}
//       onPress={() => { navigation.navigate('TagDetailsView', { tag: tag }); }} />
//   );
//   return (<>{markers}</>);
// };





///////////////////////////////////////////////////////////////
// Button List ////////////////////////////////////////////////
///////////////////////////////////////////////////////////////




type GeoTagButtonProps =
  {
    navigation: NativeStackNavigationProp<RootStackParamList, "ExplorationView">,
    tag: TagStruct
  }




const GeoTagButton = ({ navigation, tag }: GeoTagButtonProps) => {
  return (
    <TouchableOpacity
      onPress={() => { navigation.navigate('TagDetailsView', { tag: tag }); }}
      style={{ marginBottom: 10 }}

    >
      <Box
        style={{
          backgroundColor: themeColors.lightdark,
          borderRadius: 5,
          padding: 10,
        }}>
        <Heading size="xs" textAlign={"center"} color={"white"}>
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

  // const buttons = tagList.map((tag, i) =>
  //   <GeoTagButton navigation={navigation} tag={tag} key={i} />
  // );

  let noFoundTags = true;
  // Add buttons only if they are found and check if there are any tags
  let buttons = tagList.filter((tag) => tag.isFound).map((tag, i) => {
    noFoundTags = false;
    return <GeoTagButton navigation={navigation} tag={tag} key={i} />
  });

  // If there are no tags, display a message

  if (noFoundTags) {
    buttons.push(
      <View style={{ flex: 1, margin: 10 }} key={0}>
        <Heading size="xs" textAlign={"center"} color={"white"}>
          You haven't found any tags yet.
        </Heading>
      </View>
    )
  }


  return (<>{buttons}</>);
};


///////////////////////////////////////////////////////////////
// Exploration View ///////////////////////////////////////////
///////////////////////////////////////////////////////////////

type ExplorationViewProps = NativeStackScreenProps<RootStackParamList, 'ExplorationView'>;

export interface ExplorationViewState {
  tagList: TagStruct[],
  markers: JSX.Element[],
  errorMessage: string,
  showModal: boolean,
  showErrorModal: boolean,
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

    this.state = {
      tagList: [],
      markers: [],
      errorMessage: "But we don't what...",
      showModal: false,
      showErrorModal: false,
      showStagger: false,
      initialCoordinates: {
        latitude: 0,
        longitude: 0
      }
    }

    this.updateMarkers = this.updateMarkers.bind(this);
    this.updateCurrentLocation = this.updateCurrentLocation.bind(this);
    this.updateTags = this.updateTags.bind(this);
    this.setShowModal = this.setShowModal.bind(this);
    this.setShowErrorModal = this.setShowErrorModal.bind(this);
    this.codeBarRead = this.codeBarRead.bind(this);

  }




  setShowModal(showModal: boolean) {
    this.setState({ showModal: showModal });
  }

  setShowErrorModal(showErrorModal: boolean) {
    this.setState({ showErrorModal: showErrorModal });
  }

  setShowStagger(showStagger: boolean) {
    this.setState({ showStagger: showStagger });
  }




  /**
   * Is called when a QRCode is read.
   * @param event 
   */
  async codeBarRead(event: BarCodeReadEvent) {
    console.log("Scanning QR Code");
    this.setShowModal(false);
    this.updateTags();

    // let qrCodeData = JSON.parse(event["data"]);


    // let coordinates = { latitude: coordinateList[0], longitude: coordinateList[1] };

    let tm = TagManager.getInstance();
    await tm.verifyScannedTag(event["data"],
      async () => {
        await this.updateTags();
        await this.updateMarkers();
        console.log("OK")
      },
      (message) => {
        this.setState({ errorMessage: message });
        this.setShowErrorModal(true);
      });

    // If the tag is found, display a toast message and update the map
    // console.log(results);


  }

  /**
   * Updates the list of markers that are displayed on the map.
   */
  async updateTags() {

    let tagList = await TagManager.getTags();

    this.setState({
      tagList: tagList
    });

    await this.updateMarkers();
    this.forceUpdate();
  }

  async updateMarkers() {
    let tagList = await TagManager.getTags();
    let markerList = tagList.map((tag, i) =>
      <Marker
        key={i}
        coordinate={{ latitude: tag.coordinates.latitude, longitude: tag.coordinates.longitude }}
        pinColor={tag.isFound ? "blue" : "red"}
        onPress={() => { this.props.navigation.navigate('TagDetailsView', { tag: tag }); }}
      />
    );


    this.setState({ markers: [] }); // Neceessary for the markers to update
    this.setState({
      markers: markerList
    });
  }


  async updateCurrentLocation() {
    let currentLocation = await ConfigManager.getCurrentLocation();
    this.setState({
      initialCoordinates: {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude
      }
    })
  }


  /**
   * Runs once the component is loaded.
   */
  async componentDidMount() {
    // Get the initial coordinates of the user
    this.updateCurrentLocation();

    // TODO: Create a periondic function that updates the user's location


    this.updateTags();

  }

  componentDidUpdate() {
  }




  render() {

    return (
      <View style={{
        flex: 1,
        // backgroundColor: '#f0f0f0'}}>
        backgroundColor: '#000'
      }}>

        <View style={{
          flex: 0.6,
          overflow: 'hidden',
          borderRadius: 15,
        }}>


          <MapView style={styles.map}
            showsCompass={false}
            // rotateEnabled={false}
            showsUserLocation={true}
            showsMyLocationButton={false}
            followsUserLocation={true}
            showsBuildings={true}

            toolbarEnabled={false}

            customMapStyle={customMapLightStyle}

            provider={PROVIDER_GOOGLE}

            userLocationPriority={'high'}
            userLocationUpdateInterval={5000}
            userLocationFastestInterval={5000}




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
            {/* <MarkerList navigation={this.props.navigation} tagList={this.state.tagList} /> */}
            {this.state.markers}

          </MapView>

          <Heading size={"xl"} paddingLeft={1.5} borderRadius={5} fontWeight={900} style={{ position: "absolute", top: 50, left: 20 }} color={themeColors.dark}>
            GEOTAG
            <Icon name="map-marker" color={themeColors.dark} size={28}></Icon>
          </Heading>

        </View>

        <View style={styles.navView}>

          {/* <Stagger visible={this.state.showStagger}>
            <Icon name="bomb" color="#fff" size={25}></Icon>
            <Icon name="skull" color="#fff" size={25}></Icon>
            <Icon name="radioactive" color="#fff" size={25}></Icon>
            <Icon name="biohazard" color="#fff" size={25}></Icon>
            <Icon name="emoticon-happy" color="#fff" size={25}></Icon>
          </Stagger>


          <View style={{ marginBottom: 10 }}>
            <Icon.Button
              iconStyle={styles.scanButtonStyle}
              style={styles.scanButton}
              name="knife"
              color="#fff"
              size={50}
              onPress={(e) => this.setShowStagger(!this.state.showStagger)}>
            </Icon.Button>
          </View> */}

          <View style={{ marginBottom: 25 }}>
            <Icon.Button
              iconStyle={styles.scanButtonStyle}
              style={styles.scanButton}
              name="map-marker-plus"
              color="#fff"
              size={35}
              onPress={(e) => this.setShowStagger(!this.state.showStagger)}>
            </Icon.Button>
          </View>

          {/* TODO: Add stagger */}

          <View style={styles.scanButtonView}>
            <Icon.Button
              iconStyle={styles.scanButtonStyle}
              style={styles.scanButton}
              name="qrcode"
              color="#fff"
              size={50}
              onPress={(e) => this.setShowModal(true)}>
            </Icon.Button>
          </View>


        </View>


        <ScrollView style={styles.buttonListView}>

          <Heading size="xl" fontWeight={800} textAlign={"center"} mb={2} color={'white'}>
            Tags found
          </Heading>
          <ButtonList navigation={this.props.navigation} tagList={this.state.tagList} />
        </ScrollView>





        <Center>
          <Modal style={{}} isOpen={this.state.showModal} onClose={() => this.setShowModal(false)} size="lg">
            <Modal.Content style={{}}>
              <Modal.CloseButton />

              <Modal.Header>
                <Heading fontWeight={800} textAlign={"center"}>
                  Scan a tag
                </Heading>
              </Modal.Header>
              <Modal.Body style={{ alignItems: "center" }}>
                <RNCamera
                  ratio={'4:4'}
                  style={{ height: 280, width: "110%" }}
                  onBarCodeRead={async (e) => { await this.codeBarRead(e); }}
                  captureAudio={false}
                >
                </RNCamera>
              </Modal.Body>
            </Modal.Content>
          </Modal>
        </Center>

        <ErrorModal visible={this.state.showErrorModal} message={this.state.errorMessage} onClose={() => this.setShowErrorModal(false)} />

      </View>);
  }
}