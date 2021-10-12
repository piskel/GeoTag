// TODO: Move exploration view code rom App.tsx to here.

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, View } from "react-native";
import { RNCamera } from 'react-native-camera';
import { RootStackParamList } from './RootStackParams';
import { styles } from './styles';



type ScanViewProps = NativeStackScreenProps<RootStackParamList, 'ScanView'>;

export interface ScanViewState { };

export default class ScanView
    extends React.Component<ScanViewProps, ScanViewState>
{


    render() {
        return (
            <View style={styles.container}>


                <RNCamera
                    style={styles.camera}
                    onBarCodeRead={(e) => this.props.navigation.navigate('ExplorationView')}
                    captureAudio={false}
                >

                </RNCamera>
            </View>);
    }
}