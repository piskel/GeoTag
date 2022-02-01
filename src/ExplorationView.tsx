import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, ToastAndroid, TouchableOpacity, View } from "react-native";
import MapView, { MapEvent, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { RootStackParamList } from './RootStackParams';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { customMapLightStyle, styles, themeColors } from './styles';
import { Box, Heading } from 'native-base';
import { BarCodeReadEvent } from 'react-native-camera';
import { CoordinatesStruct, TagStruct } from './typedef';
import { TagManager } from './TagManager';
import { ConfigManager } from './ConfigManager';
import { AddInfoModal, AddTagModal, CameraModal, ErrorModal } from './Components';




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
  markersCoords: CoordinatesStruct[],
  errorMessage: string,
  showCameraModal: boolean,
  showErrorModal: boolean,
  showAddTagModal: boolean,
  showAddInfoModal: boolean,
  initialCoordinates: CoordinatesStruct,
  currentCoordinates: CoordinatesStruct,
  newTagCoordinates: CoordinatesStruct,
};


export default class ExplorationView
  extends React.Component<ExplorationViewProps, ExplorationViewState>
{
  constructor(props: ExplorationViewProps | Readonly<ExplorationViewProps>) {
    super(props);

    this.state = {
      tagList: [],
      // markers: [],
      markersCoords: [],
      errorMessage: "But we don't know what...",
      showCameraModal: false,
      showErrorModal: false,
      showAddTagModal: false,
      showAddInfoModal: false,
      initialCoordinates: {
        latitude: 0,
        longitude: 0
      },
      currentCoordinates: {
        latitude: 0,
        longitude: 0
      },
      newTagCoordinates: {
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
    this.setShowAddInfoModal = this.setShowAddInfoModal.bind(this);
    this.codeBarRead = this.codeBarRead.bind(this);
    this.createNewTag = this.createNewTag.bind(this);
    this.renderMarkers = this.renderMarkers.bind(this);

  }



  /**
   * Sets the visibility of the camera modal
   * @param showCameraModal if true, the modal is displayed
   */
  setShowCameraModal(showCameraModal: boolean) {
    this.setState({ showCameraModal: showCameraModal });
  }

  /**
   * Sets the visibility of the error modal
   * @param showErrorModal if true, the modal is displayed
   */
  setShowErrorModal(showErrorModal: boolean) {
    this.setState({ showErrorModal: showErrorModal });
  }

  /**
   * Sets the visibility of the add tag modal
   * @param showAddTagModal if true, the modal is displayed
   */
  setShowAddTagModal(showAddTagModal: boolean) {
    this.setState({ showAddTagModal: showAddTagModal });
  }


  /**
   * Sets the visibility of the add info modal
   * @param showAddInfoModal if true, the modal is displayed
   */
  setShowAddInfoModal(showAddInfoModal: boolean) {
    this.setState({ showAddInfoModal: showAddInfoModal });
  }



  /**
   * Is called when a QRCode is read.
   * @param event the event containing the QRCode's data
   */
  async codeBarRead(event: BarCodeReadEvent) {
    console.log("Scanning QR Code");
    this.setShowCameraModal(false); // We close the camera modal
    this.updateTags();  // We update the tags list

    let tm = TagManager.getInstance();

    await tm.verifyScannedTag(event["data"],
      async () => {
        await this.updateInformations();
      },
      (message) => {
        this.setState({ errorMessage: message });
        this.setShowErrorModal(true);
      });
  }

  /**
   * Callback function called to add a tag and displays errors through the error modal if needed
   */
  async createNewTag() {
    this.setShowAddTagModal(false);
    let tm = TagManager.getInstance();

    await tm.postNewTag(this.state.newTagCoordinates,
      async () => {
        await this.updateInformations();
      },
      (message) => {
        this.setState({ errorMessage: message });
        this.setShowErrorModal(true);
      });

  }

  /**
   * A function to update every information the component might need at once.
   */
  async updateInformations() {
    this.updateCurrentLocation();
    this.updateTags();
    this.updateMarkers();
    this.forceUpdate();
  }


  /**
   * Updates the tags stored in the component's state
   */
  async updateTags() {
    let tagList = await TagManager.getTags();
    this.setState({
      tagList: tagList
    });

  }

  /**
   * Updates the markers displayed on the map
   */
  async updateMarkers() {
    let tagList = await TagManager.getTags();

    let newMarkersCoords = tagList.map((tag) => {
      return tag.coordinates;
    });

    this.setState({
      markersCoords: newMarkersCoords
    });
  }

  /**
   * Returns a list of marker elements for every tag present in the device's storage
   * @returns The list of markers for each tags in local storage
   */
  renderMarkers(): JSX.Element[] {
    let markers = this.state.markersCoords.map((coordinates, i) =>
      <Marker
        key={i}
        coordinate={{ latitude: coordinates.latitude, longitude: coordinates.longitude }}
        pinColor={this.state.tagList[i].isFound ? "blue" : "red"}
        onPress={() => { this.props.navigation.navigate('TagDetailsView', { tag: this.state.tagList[i] }); }}
      />
    );

    return markers;
  }

  /**
   * Updates the current in the component's staet from the one in storage
   */
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

    // We set the initial location of the user in the state to be displayed on the map.
    let currentLocation = await ConfigManager.getCurrentLocation();
    this.setState({
      initialCoordinates: {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude
      }
    })

    // We do the first update once the component is mounted
    const tm = TagManager.getInstance();
    await tm.updateTagsFromServer(
      (message) => {
        this.setState({ errorMessage: message });
        this.setShowErrorModal(true);
      });
    await this.updateInformations();

    // Sets the interval at which to update the component's information
    setInterval(async () => {
      console.log("Auto update");

      await tm.updateTagsFromServer((message) => { });
      await this.updateInformations();

    }, 10000);

  }

  /**
   * Renders the component
   * @returns The JSX to display
   */
  render() {

    return (
      <View style={{
        flex: 1,
        backgroundColor: themeColors.dark
      }}>

        <View style={{
          flex: 0.6,
          overflow: 'hidden',
          borderRadius: 15,
        }}>


          <MapView style={styles.map}
            showsCompass={false}
            showsUserLocation={true}
            showsMyLocationButton={false}
            showsBuildings={true}
            toolbarEnabled={false}
            customMapStyle={customMapLightStyle}
            provider={PROVIDER_GOOGLE}
            userLocationPriority={'high'}
            userLocationUpdateInterval={5000}
            userLocationFastestInterval={5000}
            children={this.renderMarkers()}
            onLongPress={async (e) => {
              let coordinates = e.nativeEvent.coordinate;
              this.setState({ newTagCoordinates: coordinates });
              this.setShowAddTagModal(true);
            }
            }
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
          />

          <Heading size={"xl"} paddingLeft={1.5} borderRadius={5} fontWeight={900} style={{ position: "absolute", top: 45, left: 20 }} color={themeColors.dark}>
            GEOTAG
            <Icon name="map-marker" color={themeColors.dark} size={28}></Icon>
          </Heading>

        </View>

        <View style={styles.navView}>

          {/* Info button */}
          <View style={{ marginBottom: 25 }}>
            <Icon.Button
              iconStyle={styles.scanButtonStyle}
              style={styles.scanButton}
              name="map-marker-question"
              color={themeColors.white}
              size={35}
              onPress={(e) => this.setShowAddInfoModal(true)}>
            </Icon.Button>
          </View>

          {/* Scan button */}
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
        <AddTagModal coordinates={this.state.newTagCoordinates} visible={this.state.showAddTagModal} onClose={() => this.setShowAddTagModal(false)} onAddTag={async () => await this.createNewTag()} />
        <AddInfoModal visible={this.state.showAddInfoModal} onClose={() => this.setShowAddInfoModal(false)} />
      </View>);
  }
}