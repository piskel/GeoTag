// TODO: Move exploration view code rom App.tsx to here.

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, View } from "react-native";
import { RNCamera } from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RootStackParamList } from './RootStackParams';


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
    qrCamera:
    {
        ...StyleSheet.absoluteFillObject,
        flex: 1
    }
});


type ScanViewProps = NativeStackScreenProps<RootStackParamList, 'ScanView'>;

// export interface ScanViewProps {
// };

export interface ScanViewState { };

export default class ScanView
    extends React.Component<ScanViewProps, ScanViewState>
{


    render() {
        return (
            <View style={styles.container}>


                <RNCamera
                    style={{
                    flex: 1,
                    width: '100%',
                    }}
                    onBarCodeRead={(e) => this.props.navigation.navigate('ExplorationView')}
                    captureAudio={false}
                >

                </RNCamera>
            </View>);
    }
}