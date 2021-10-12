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
      ...StyleSheet.absoluteFillObject
    },
    scrollview: {
      flex: 1
    },
    scanButtonView:{
      position:'absolute',
      bottom:10,
      right:10,
      margin:0,
      padding:0
    },
    scanButton:
    {
      margin:0,
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