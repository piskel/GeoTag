import React from 'react';
import { Center, Heading, Modal } from "native-base";



///////////////////////////////////////////////////////////////
// Error Modal ////////////////////////////////////////////////
///////////////////////////////////////////////////////////////


export type ErrorModalProps =
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
                        <Heading fontWeight={800} textAlign={"center"}>
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