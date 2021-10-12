import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { View } from "react-native";
import { RootStackParamList } from "./RootStackParams";


type TagDetailsViewProps = NativeStackScreenProps<RootStackParamList, 'TagDetailsView'>;

export interface TagDetailsViewState {};


export default class TagDetailsView
  extends React.Component<TagDetailsViewProps, TagDetailsViewState>
{
    constructor(props: TagDetailsViewProps | Readonly<TagDetailsViewProps>) {
        super(props);
    }
    
    
  render() {
      return(
        <View>
        </View>
      );
  }

}