import React from 'react';
import { Button, Center, Heading, Modal, Text } from "native-base";
import { BarCodeReadEvent, RNCamera } from 'react-native-camera';
import { themeColors } from './styles';
import QRCode from 'react-native-qrcode-svg';
import { CoordinatesStruct } from './typedef';




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

type AddTagModalProps =
{
    coordinates: CoordinatesStruct,
    visible: boolean,
    onClose: () => void,
    onAddTag: () => void
}


export const AddTagModal = ({coordinates, visible, onClose, onAddTag}: AddTagModalProps) => {
    
    let appLogo = require("./assets/images/ic_launcher_round.png");
    let textCoordinates = `[${coordinates.latitude}, ${coordinates.longitude}]`;
    
    return (
        <Center>
            <Modal style={{}} isOpen={visible} onClose={onClose} size="lg">
                <Modal.Content style={{}}>
                    <Modal.CloseButton />

                    <Modal.Header>
                        <Heading fontWeight={800} textAlign={"center"} color={themeColors.dark}>
                            Creating a tag
                        </Heading>
                    </Modal.Header>
                    <Modal.Body style={{ alignItems: "center" }}>
                        <QRCode
                        value={textCoordinates}
                        logo={appLogo}
                        logoSize={60}
                        logoMargin={5}
                        logoBackgroundColor="white"
                        logoBorderRadius={100}
                        size={200}
                        getRef={(ref: any) => {
                            // @ts-ignore
                            console.log(ref.toDataURL((data)=>{console.log(data)}));
                        }}
                        />
                        <Text>
                            Do you want to add a tag?
                        </Text>
                        <Text>
                            The tag will be set to your current location.
                        </Text>
                        <Button style={{backgroundColor:themeColors.dark}} onPress={() => onAddTag()}>
                            Yes, create the tag
                        </Button>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </Center>);
};


