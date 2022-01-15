import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { RootStackParamList } from "./RootStackParams";
import { styles } from "./styles";
import { Center, Divider, Flex, Heading, List, SectionList, Text, VStack } from 'native-base'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Geocoder from "react-native-geocoding";
import { TagStruct } from "./typedef";



type TagDetailsViewProps = NativeStackScreenProps<RootStackParamList, 'TagDetailsView'>;

// Color marker not found : "red"
// Color marker found : "gold"




export interface TagDetailsViewState {

}

export default class TagDetailsView extends React.Component<TagDetailsViewProps, TagDetailsViewState> {

    constructor(props: TagDetailsViewProps) {
        super(props);
        this.state = {
        };
    }


    async componentDidMount() {

    }


    render() {
        let tag = this.props.route.params.tag;
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
                                <Heading size="sm">Coordinates</Heading>
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
                            
                            <VStack>
                                <Heading size="sm">Has Been Found?</Heading>
                                <Text>{tag.isFound ? "Yes" : "No"}</Text>
                            </VStack>
    
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
                            <VStack>
                                <Heading size="sm">Found Date</Heading>
                                <Text>{(new Date(tag.findDate as number)).toUTCString()}</Text>
                            </VStack>
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
                            
                            <VStack>
                                <Heading size="sm">Creation Date</Heading>
                                <Text>{(new Date(tag.creationDate)).toUTCString()}</Text>
                            </VStack>
                        </Flex>
    
    
                    </VStack>
                </View>
            </View>
        );
    }

}
