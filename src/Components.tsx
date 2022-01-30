import React from 'react';
import { Button, Center, Heading, Modal, Text } from "native-base";
import { BarCodeReadEvent, RNCamera } from 'react-native-camera';
import { themeColors } from './styles';
import QRCode from 'react-native-qrcode-svg';
import { CoordinatesStruct } from './typedef';
import RNFS from 'react-native-fs';
import CameraRoll from '@react-native-community/cameraroll';
import { Pressable, ToastAndroid, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';



///////////////////////////////////////////////////////////////
// Error Modal ////////////////////////////////////////////////
///////////////////////////////////////////////////////////////


type ErrorModalProps =
    {
        visible: boolean,
        message: string,
        onClose: () => void
    }


export const ErrorModal = ({ visible, message, onClose }: ErrorModalProps) => {
    return (
        <Center>
            <Modal style={{}} isOpen={visible} onClose={() => onClose()} size="lg">
                <Modal.Content style={{}}>
                    <Modal.CloseButton />

                    <Modal.Header>
                        <Heading fontWeight={800} textAlign={"center"} color={themeColors.dark}>
                            Something doesn't look right...
                        </Heading>
                    </Modal.Header>
                    <Modal.Body style={{ alignItems: "center" }}>
                        {message}
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </Center>);
};



///////////////////////////////////////////////////////////////
// Camera Modal ///////////////////////////////////////////////
///////////////////////////////////////////////////////////////

type CameraModalProps =
    {
        visible: boolean,
        onClose: () => void,
        onBarCodeRead: (event: BarCodeReadEvent) => void
    }

export const CameraModal = ({ visible, onClose, onBarCodeRead }: CameraModalProps) => {
    return (
        <Center>
            <Modal style={{}} isOpen={visible} onClose={onClose} size="lg">
                <Modal.Content style={{}}>
                    <Modal.CloseButton />

                    <Modal.Header>
                        <Heading fontWeight={800} textAlign={"center"} color={themeColors.dark}>
                            Scan a tag
                        </Heading>
                    </Modal.Header>
                    <Modal.Body style={{ alignItems: "center" }}>
                        <RNCamera
                            ratio={'4:4'}
                            style={{ height: 280, width: "110%" }}
                            onBarCodeRead={onBarCodeRead}
                            captureAudio={false}
                        >
                        </RNCamera>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </Center>);
}

///////////////////////////////////////////////////////////////
// Add Tag Modal //////////////////////////////////////////////
///////////////////////////////////////////////////////////////


let saveToCameraRoll = async (ref: any) => {
    // console.log(ref)
    if (ref) {
        // @ts-ignore
        ref.toDataURL(async (dataUrl: any) => {
            console.log(dataUrl);

            await RNFS.writeFile(`${RNFS.CachesDirectoryPath}/GeoTag.png`, dataUrl, 'base64').then(
                (success: any) => {
                    console.log("Success");
                    // @ts-ignore
                    CameraRoll.save(`${RNFS.CachesDirectoryPath}/GeoTag.png`, 'photo').then(
                        (result: any) => {
                            console.log(`Saved QR Code to : ${RNFS.CachesDirectoryPath}/GeoTag.png`);
                            ToastAndroid.show(`Saved QR Code to Camera Roll`, ToastAndroid.SHORT);
                        },
                        (error: any) => {
                            console.log("Error")
                        });
                },
                (error: any) => {
                    console.log("Error");

                })

        });
    }

}



export const AppLogo = require("./assets/images/ic_launcher_round.png");

type AddTagModalProps =
    {
        coordinates: CoordinatesStruct,
        visible: boolean,
        onClose: () => void,
        onAddTag: () => void
    }

export const AddTagModal = ({ coordinates, visible, onClose, onAddTag }: AddTagModalProps) => {

    // let appLogo = require("./assets/images/ic_launcher_round.png");
    let textCoordinates = `[${coordinates.latitude}, ${coordinates.longitude}]`;

    let qrRef: any = null;





    let qr = new QRCode({
        value: textCoordinates,
        logo: AppLogo,
        logoSize: 50,
        logoMargin: 5,
        logoBackgroundColor: 'white',
        logoBorderRadius: 100,
        size: 230,
        quietZone: 10,

        getRef: (ref: any) => {
            qrRef = ref;
        }
    });



    return (
        <Center>
            <Modal style={{}} isOpen={visible} onClose={onClose} size="lg">
                <Modal.Content style={{alignItems: "center"}}>
                    <Modal.CloseButton />

                    <Modal.Header>
                        <Heading fontWeight={800} textAlign={"center"} color={themeColors.dark}>
                            Creating a tag
                        </Heading>
                    </Modal.Header>
                    <Modal.Body>
                        <View style={{ alignItems: "center", width: 250}}>
                            <Pressable style={{}} onPress={async () => {
                                // @ts-ignore   
                                saveToCameraRoll(qrRef);
                                onClose();
                            }}>
                                {qr}
                            </Pressable>
                            <Text style={{marginBottom: 0, marginTop:10, textAlign:"center"}}>
                            This is the QR code for your new GeoTag !
                            </Text>
                            <Text style={{marginBottom: 0, marginTop:10, textAlign:"center"}}>
                            You can save it to the camera roll by pressing the button below.
                            </Text>
                            <Text style={{marginBottom: 10, marginTop:10, textAlign:"center"}}>
                            Place this tag in real life at the location you have selected and then scan it to validate it!
                            </Text>
                            <Button style={{ backgroundColor: themeColors.dark }} onPress={async () => {
                                // @ts-ignore   
                                saveToCameraRoll(qrRef);
                                onClose();
                            }}>
                                Save to Camera Roll
                                
                                <Center>
                                <Icon
                                    name="download"
                                    color={themeColors.white}
                                    size={25}
                                ></Icon>
                                </Center>
                            </Button>
                        </View>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </Center>);
};
