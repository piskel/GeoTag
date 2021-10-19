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

    let coordinate = route.params.tag.coordinate;
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
                        center: { latitude: coordinate.latitude, longitude: coordinate.longitude },
                        heading: 0, // Camera rotation
                        pitch: 90, // Camera inclination
                        zoom: 15 // Camera zoom
                    }}
                >
                    <Marker coordinate={{ latitude: coordinate.latitude, longitude: coordinate.longitude }} pinColor={"gold"}/>
                </MapView>
            </View>

            <View style={{ flex: 2.5, padding: 0 }}>
                <Heading>
                    kkoin
                </Heading>
            </View>
        </View>
    );
}
