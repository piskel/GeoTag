import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, ToastAndroid, TouchableOpacity, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { RootStackParamList } from './RootStackParams';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { customMapLightStyle, styles, themeColors } from './styles';
import { Box, Heading } from 'native-base';
import { BarCodeReadEvent } from 'react-native-camera';
import { CoordinatesStruct, TagStruct } from './typedef';
import { TagManager } from './TagManager';
import { ConfigManager } from './ConfigManager';
import { AddTagModal, CameraModal, ErrorModal } from './Components';



// TODO : Let users set their tag either public (displays them on the map)

// TODO : Move components in a separate file


///////////////////////////////////////////////////////////////
// GeoTag Button //////////////////////////////////////////////
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

///////////////////////////////////////////////////////////////
// Button List ////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

type ButtonListProps =
  {
    navigation: NativeStackNavigationProp<RootStackParamList, "ExplorationView">,
    tagList: TagStruct[]
  }

const ButtonList = ({ navigation, tagList }: ButtonListProps) => {

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
  showCameraModal: boolean,
  showErrorModal: boolean,
  showAddTagModal: boolean,
  showStagger: boolean,
  initialCoordinates: CoordinatesStruct,
  currentCoordinates: CoordinatesStruct
};


export default class ExplorationView
  extends React.Component<ExplorationViewProps, ExplorationViewState>
{
  constructor(props: ExplorationViewProps | Readonly<ExplorationViewProps>) {
    super(props);

    this.state = {
      tagList: [],
      markers: [],
      errorMessage: "But we don't know what...",
      showCameraModal: false,
      showErrorModal: false,
      showAddTagModal: false,
      showStagger: false,
      initialCoordinates: {
        latitude: 0,
        longitude: 0
      },
      currentCoordinates: {
        latitude: 0,
        longitude: 0
      }
    }

    this.updateInformations = this.updateInformations.bind(this);
    this.updateMarkers = this.updateMarkers.bind(this);
    this.updateCurrentLocation = this.updateCurrentLocation.bind(this);
    this.updateTags = this.updateTags.bind(this);
    this.setShowCameraModal = this.setShowCameraModal.bind(this);
    this.setShowErrorModal = this.setShowErrorModal.bind(this);
    this.setShowAddTagModal = this.setShowAddTagModal.bind(this);
    this.codeBarRead = this.codeBarRead.bind(this);
    this.createNewTag = this.createNewTag.bind(this);

  }




  setShowCameraModal(showCameraModal: boolean) {
    this.setState({ showCameraModal: showCameraModal });
  }

  setShowErrorModal(showErrorModal: boolean) {
    this.setState({ showErrorModal: showErrorModal });
  }

  setShowAddTagModal(showAddTagModal: boolean) {
    this.setState({ showAddTagModal: showAddTagModal });
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
    this.setShowCameraModal(false);
    this.updateTags();

    let tm = TagManager.getInstance();

    await tm.verifyScannedTag(event["data"],
      async () => {
        await this.updateInformations();
      },
      (message) => {
        this.setState({ errorMessage: message });
        this.setShowErrorModal(true);
      });

    // If the tag is found, display a toast message
    if (this.state.tagList.filter((tag) => tag.isFound).length > 0) {
      ToastAndroid.showWithGravity(
        "Tag found!",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    }



    // console.log(results);
  }

  async createNewTag() {
    this.setShowAddTagModal(false);
    let tm = TagManager.getInstance();
    let currentLocation = await ConfigManager.getCurrentLocation();

    await tm.postNewTag(currentLocation,
      async () => {
        await this.updateInformations();
      },
      (message) => {
        this.setState({ errorMessage: message });
        this.setShowErrorModal(true);
      });

  }


  async updateInformations() {
    this.updateCurrentLocation();
    this.updateTags();
    this.updateMarkers();
    this.forceUpdate();
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


    this.setState({ markers: [] }); // Necessary for the markers to update
    this.setState({
      markers: markerList
    });
  }


  async updateCurrentLocation() {

    let currentLocation = await ConfigManager.getCurrentLocation();
    this.setState({
      currentCoordinates: {
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
    // this.updateCurrentLocation();

    let currentLocation = await ConfigManager.getCurrentLocation();
    this.setState({
      initialCoordinates: {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude
      }
    })
    

    const tm = TagManager.getInstance();
    await tm.updateTagsFromServer(
      async () => { },
      (message) => {
        this.setState({ errorMessage: message });
        this.setShowErrorModal(true);
      });


    await this.updateInformations();


    setInterval(async () => {
      console.log("Auto update");

      await tm.updateTagsFromServer(
        async () => {},
        (message) => {});

      await this.updateInformations();

    }, 10000);

  }


  componentDidUpdate() {}




  render() {

    // let currentLocation = await ConfigManager.getCurrentLocation();

    return (
      <View style={{
        flex: 1,
        // backgroundColor: '#f0f0f0'}}>
        backgroundColor: themeColors.dark
      }}>

        <View style={{
          flex: 0.6,
          overflow: 'hidden',
          borderRadius: 15,
        }}>


          <MapView style={styles.map}
            showsCompass={false}
            // children={this.state.markers}
            // rotateEnabled={false}
            showsUserLocation={true}
            showsMyLocationButton={false}
            // followsUserLocation={true}
            showsBuildings={true}

            toolbarEnabled={false}

            customMapStyle={customMapLightStyle}

            provider={PROVIDER_GOOGLE}

            userLocationPriority={'high'}
            userLocationUpdateInterval={5000}
            userLocationFastestInterval={5000}

            // onUserLocationChange={(location) => { console.log("OK") }}




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
            {this.state.markers}
          </MapView>

          <Heading size={"xl"} paddingLeft={1.5} borderRadius={5} fontWeight={900} style={{ position: "absolute", top: 45, left: 20 }} color={themeColors.dark}>
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
              color={themeColors.white}
              size={35}
              onPress={(e) => this.setShowAddTagModal(true)}>
            </Icon.Button>
          </View>

          {/* TODO: Add stagger */}

          <View style={styles.scanButtonView}>
            <Icon.Button
              iconStyle={styles.scanButtonStyle}
              style={styles.scanButton}
              name="qrcode"
              color={themeColors.white}
              size={50}
              onPress={(e) => this.setShowCameraModal(true)}>
            </Icon.Button>
          </View>


        </View>


        <ScrollView style={styles.buttonListView}>
          <Heading size="xl" fontWeight={800} textAlign={"center"} mb={2} color={themeColors.white}>
            Tags found
          </Heading>
          <ButtonList navigation={this.props.navigation} tagList={this.state.tagList} />
        </ScrollView>

        <CameraModal visible={this.state.showCameraModal} onClose={() => this.setShowCameraModal(false)} onBarCodeRead={async (e) => await this.codeBarRead(e)} />
        <ErrorModal visible={this.state.showErrorModal} message={this.state.errorMessage} onClose={() => this.setShowErrorModal(false)} />
        <AddTagModal visible={this.state.showAddTagModal} onClose={() => this.setShowAddTagModal(false)} onAddTag={async () => await this.createNewTag()} />

      </View>);
  }
}