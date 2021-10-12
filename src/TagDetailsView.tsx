import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { Button, Text, TextBase, View } from "react-native";
import MapView, { Animated } from "react-native-maps";
import { RootStackParamList } from "./RootStackParams";
import { styles } from "./styles";
import {Box, Heading, SectionList, ZStack} from 'native-base'
import { RNCamera } from "react-native-camera";

type TagDetailsViewProps = NativeStackScreenProps<RootStackParamList, 'TagDetailsView'>;

export interface TagDetailsViewState { };


export default class TagDetailsView
    extends React.Component<TagDetailsViewProps, TagDetailsViewState>
{
    constructor(props: TagDetailsViewProps | Readonly<TagDetailsViewProps>) {
        super(props);
    }


    render() {
        return (
            <View style={styles.container}>
                <View style={{flex:1}}>
                    <MapView style={styles.map}
                        showsCompass={false}
                        rotateEnabled={false}
                        showsUserLocation={true}
                        showsMyLocationButton={false}
                        
                        followsUserLocation={true}
                        
                        showsBuildings={true}
                        camera={{
                            altitude:0,
                            center:{latitude:47.26126126126126, longitude:7.009079597967446},
                            heading:0, // Camera rotation
                            pitch:90, // Camera inclination
                            zoom:15 // Camera zoom
                        }}
                    >
                    </MapView>
                </View>
                <View style={{flex:2.5, padding:0}}>

                    <Heading>
                        kkoin
                    </Heading>
                </View>
            </View>
        );
    }

}