// TODO: Move exploration view code rom App.tsx to here.

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Alert, Button, ScrollView, StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { RootStackParamList } from './RootStackParams';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './styles';
import { Center, Modal } from 'native-base';
import { Text } from 'react-native-svg';
import { alignContent, height, justifyItems } from 'styled-system';
import { RNCamera } from 'react-native-camera';
import { thisExpression } from '@babel/types';
import { background } from 'native-base/lib/typescript/theme/styled-system';


type ExplorationViewProps = NativeStackScreenProps<RootStackParamList, 'ExplorationView'>;

export interface ExplorationViewState {
  markerList: any[],
  showModal: boolean
};

export default class ExplorationView
  extends React.Component<ExplorationViewProps, ExplorationViewState>
{
  constructor(props: ExplorationViewProps | Readonly<ExplorationViewProps>) {
    super(props);
    // this.setState({markerList:[]})

    this.state = {
      markerList: [],
      showModal: false
    }

    this.updateMarkers = this.updateMarkers.bind(this);
    this.setShowModal = this.setShowModal.bind(this);
  }

  setShowModal(showModal: boolean) {
    this.setState({ showModal: showModal });
  }

  updateMarkers() {
    this.setState({ markerList: [] });

    let tmpMarkerList = [];

    for (let i = 0; i < 100; i++) {
      tmpMarkerList.push(<Marker key={i} coordinate={{ latitude: i % 180 - 90, longitude: i % 180 }} />);
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
            <Icon.Button iconStyle={styles.scanButtonStyle} style={styles.scanButton} name="qrcode" size={50}
              // onPress={(e) => this.props.navigation.navigate('ScanView')}
              onPress={(e) => this.setShowModal(true)}
            ></Icon.Button>

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
        <Center>
          <Modal style={{}} isOpen={this.state.showModal} onClose={() => this.setShowModal(false)} size="lg">
            <Modal.Content style={{}}>
              <Modal.CloseButton />
              <Modal.Header style={{}}>Scan a tag</Modal.Header>
              <Modal.Body style={{ alignItems:"center"}}>
                <RNCamera

                  ratio={'4:4'}
                  style={{ height: 280, width:"110%"}}
                  onBarCodeRead={(e) => this.setShowModal(false)}
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