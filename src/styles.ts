import { StyleSheet, useColorScheme } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";



// const isDarkMode = useColorScheme() === 'dark';

// const backgroundStyle = {
//   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
// };

export const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    map: {
      ...StyleSheet.absoluteFillObject,
  
    },

    navView:{
      // flex: 1,
      position: "absolute",
      marginLeft:10,
      marginRight:10,
      marginBottom:10,
      // left: 0,
      right: 0,
      // height: "50%",

      bottom:"40%",
      
      borderColor:"red",
      borderWidth:1,

    },

    staggerButton:{
      padding:2,
    },

    buttonListView: {
      flex: 1,
      
      position: "absolute",
      marginLeft: 10,
      marginRight: 10,
      right:0,
      left:0,
      bottom: 0,
      height: "40%",

      
      borderColor:"red",
      borderWidth:1,
    },


    scanButtonView:{
      // position:'absolute',
      // alignSelf: 'flex-end',
      alignSelf: 'flex-start',
      // flex: 1,


      // bottom:10,
      // right:10,
    
      // margin:0,
      // padding:0
    },
    scanButton:
    {
      // margin:0,
      padding:2,
    },
    scanButtonStyle:
    {
      marginRight:0,
    },
    camera:
    {
        flex: 1,
        width: '100%'
    }
  });