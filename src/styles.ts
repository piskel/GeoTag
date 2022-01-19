import { extendTheme } from "native-base";
import { StyleSheet, useColorScheme } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";



// const isDarkMode = useColorScheme() === 'dark';

// const backgroundStyle = {
//   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
// };

export const theme = extendTheme({   
  
  // fontConfig: {
  //   Montserrat: {
  //     medium: {
  //       fontFamily: "Montserrat-Medium",
  //     },
  //     light: {
  //       fontFamily: "Montserrat-Light",
  //     },
  //     black: {
  //       fontFamily: "Montserrat-Black",
  //     }
  //   }
  // },


  // fonts: {
  //   heading: 'Montserrat'
  // }
});

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    ...StyleSheet.absoluteFillObject,

  },

  navView: {
    // flex: 1,
    position: "absolute",
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    // left: 0,
    right: 0,
    // height: "50%",

    bottom: "40%",

    borderColor: "red",
    borderWidth: 1,

  },

  staggerButton: {
    padding: 2,
  },

  buttonListView: {
    flex: 1,

    position: "absolute",
    marginLeft: 10,
    marginRight: 10,
    right: 0,
    left: 0,
    bottom: 0,
    height: "40%",


    borderColor: "red",
    borderWidth: 1,
  },


  scanButtonView: {
    alignSelf: 'flex-start',
  },
  scanButton:
  {
    // margin:0,
    padding: 2,
    backgroundColor: "white",
  },
  scanButtonStyle:
  {
    backgroundColor: "white",
    marginRight: 0,
  },
  camera:
  {
    flex: 1,
    width: '100%'
  }
});


export const customMapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#181818"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1b1b1b"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#2c2c2c"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8a8a8a"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#373737"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3c3c3c"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#4e4e4e"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#000000"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3d3d3d"
      }
    ]
  }
]

