//MessagingList.js
import React from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Alert, Animated, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps'; // Import MapView and Marker

export default class MessageList extends React.Component {
  state = {
    currentLocation: null,  // Store current location
  };

  componentDidMount() {
    this.requestLocationPermission();
  }

  requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location.',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.getCurrentLocation();
      } else {
        alert('Location permission denied');
      }
    } else {
      this.getCurrentLocation();  
    }
  };

  getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          currentLocation: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        });
      },
      (error) => console.error('Error getting location', error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  handlePress = (item) => {
    if (item.type === 'text') {
      Alert.alert(
        "Delete Message",
        "Are you sure you want to delete this message?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => this.props.onDeleteMessage(item.id),
          },
        ],
        { cancelable: true }
      );
    } else {
      this.props.onPressMessage(item);  
    }
  };
  
  handleLongPress = (item) => {
    if (item.type === 'image') {
      Alert.alert(
        "Delete Image",
        "Are you sure you want to delete this image?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => this.props.onDeleteMessage(item.id),
          },
        ],
        { cancelable: true }
      );
    }
  };

  renderItem = ({ item }) => {
    const fadeAnim = new Animated.Value(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    return (
      <TouchableOpacity 
        onPress={() => this.handlePress(item)} 
        onLongPress={() => this.handleLongPress(item)}  
      >
        <Animated.View style={[styles.messageRow, { opacity: fadeAnim }]}>
          <View style={styles.messageBubble}>
            {item.type === 'text' && <Text style={styles.messageText}>{item.text}</Text>}
            {item.type === 'image' && (
              <Image source={{ uri: item.uri }} style={styles.imageMessage} />
            )}
            {item.type === 'location' && item.coordinate && item.coordinate.latitude && item.coordinate.longitude ? (
              <View style={styles.mapContainer}>
                {/* Add MapView to display a map image */}
                <MapView
                  style={styles.mapView}
                  region={{
                    latitude: item.coordinate.latitude,
                    longitude: item.coordinate.longitude,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                  }}
                >
                  <Marker coordinate={item.coordinate} />
                </MapView>
                <Text style={styles.messageText}>
                  Location: {item.coordinate.latitude.toFixed(2)}, {item.coordinate.longitude.toFixed(2)}
                </Text>
              </View>
            ) : null}
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  render() {
    const { messages } = this.props;

    return (
      <FlatList
        data={messages}
        renderItem={this.renderItem}
        keyExtractor={(item) => item.id.toString()}
        inverted
        contentContainerStyle={styles.listContainer}
      />
    );
  }
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: 5,
  },
  messageBubble: {
    backgroundColor: '#007BFF',
    borderRadius: 15,
    padding: 10,
    marginLeft: 60,
  },
  messageText: {
    color: 'white',
  },
  imageMessage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  mapContainer: {
    width: 250,
    height: 200,
    marginTop: 10,
  },
  mapView: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});
