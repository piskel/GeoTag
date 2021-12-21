import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { RootStackParamList } from "./RootStackParams";
import { styles } from "./styles";
import { Center, Divider, Flex, Heading, List, SectionList, Text, VStack } from 'native-base'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';



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
                    <Marker coordinate={{ latitude: tag.coordinate.latitude, longitude: tag.coordinate.longitude }} pinColor={tag.isFound ? "gold" : "red"}/>
                </MapView>
            </View>

            <View style={{ flex: 1.5}}>
                <VStack margin={10} space={3}>
                    <Heading size="xl" textAlign={"center"} mb={2}>
                        Tag Informations
                    </Heading>

                    <Flex direction="row" alignItems={'center'}>
                        <Center margin={2}>
                        <Icon
                            name="globe-model"
                            color="#000"
                            size={25}
                        ></Icon>
                        </Center>
                        <Divider thickness="2.5" bg="#000" mr="2" orientation="vertical"/>
                        
                        <VStack>
                            <Text>{tag.coordinate.latitude}</Text>
                            <Text>{tag.coordinate.longitude}</Text>
                        </VStack>
                    </Flex>

                    <Flex direction="row" alignItems={'center'}>
                        <Center margin={2}>
                        <Icon
                            name="map-marker-check-outline"
                            color="#000"
                            size={25}
                        ></Icon>
                        </Center>
                        <Divider thickness="2.5" bg="#000" mr="2" orientation="vertical"/>
                        <Text>{tag.isFound ? "Found" : "Not found"}</Text>

                    </Flex>

                    <Flex direction="row" alignItems={'center'}>
                        <Center margin={2}>
                        <Icon
                            name="calendar-check"
                            color="#000"
                            size={25}
                        ></Icon>
                        </Center>
                        <Divider thickness="2.5" bg="#000" mr="2" orientation="vertical"/>
                        
                        {/*TODO Fix*/}
                        <Text>{(new Date(tag.findDate as number)).toUTCString()}</Text>
                    </Flex>
                    
                    <Flex direction="row" alignItems={'center'}>
                        <Center margin={2}>
                        <Icon
                            name="calendar-plus"
                            color="#000"
                            size={25}
                        ></Icon>
                        </Center>
                        <Divider thickness="2.5" bg="#000" mr="2" orientation="vertical"/>
                        <Text>{(new Date(tag.creationDate)).toUTCString()}</Text>
                    </Flex>


                </VStack>
            </View>
        </View>
    );
}
