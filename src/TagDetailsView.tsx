import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { RootStackParamList } from "./RootStackParams";
import { styles } from "./styles";
import { Heading } from 'native-base'


type TagDetailsViewProps = NativeStackScreenProps<RootStackParamList, 'TagDetailsView'>;

// Color marker not found : "red"
// Color marker found : "gold"

export default function TagDetailsView({ route, navigation }: TagDetailsViewProps) {

    let tag = route.params.tag;
    return (
        <View style={styles.container}>
            <View style={{ flex: 1 }}>
                <MapView style={styles.map}
                    showsCompass={false}
                    rotateEnabled={false}
                    showsUserLocation={true}
                    showsMyLocationButton={false}

                    followsUserLocation={true}

                    showsBuildings={true}
                    camera={{
                        altitude: 0,
                        center: { latitude: tag.coordinate.latitude, longitude: tag.coordinate.longitude },
                        heading: 0, // Camera rotation
                        pitch: 90, // Camera inclination
                        zoom: 15 // Camera zoom
                    }}
                >
                    <Marker coordinate={{ latitude: tag.coordinate.latitude, longitude: tag.coordinate.longitude }} pinColor={"gold"}/>
                </MapView>
            </View>

            <View style={{ flex: 2.5, padding: 0 }}>
                <Heading size="xl">
                    Tag Informations
                </Heading>
            </View>
        </View>
    );
}
