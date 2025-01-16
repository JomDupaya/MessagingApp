//Status.js
import  Constants  from "expo-constants";
import NetInfo from '@react-native-community/netinfo';
import { StatusBar, StyleSheet, Text, View, Platform, Animated } from "react-native"; 
import React from "react";

export default class Status extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: 'null',
      backgroundColor: new Animated.Value(0), 
    };
  }

  componentDidMount() {
    NetInfo.fetch().then(state => {
      this.setState({ info: state.type });
      this.animateBackground(state.type);
    });

    this.subscription = NetInfo.addEventListener(state => {
      this.setState({ info: state.type });
      this.animateBackground(state.type); 
    });
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription();
    }
  }

  animateBackground = (networkType) => {
    const toValue = networkType === "none" ? 1 : 0; 

    Animated.timing(this.state.backgroundColor, {
      toValue,
      duration: 500, 
      useNativeDriver: false,
    }).start(); 
  };

  render() {
    const { info, backgroundColor } = this.state;
    const isConnected = info !== "none"; 

    const interpolatedBackgroundColor = backgroundColor.interpolate({
      inputRange: [0, 1],
      outputRange: ["white", "red"], 
    });

    const statusBar = (
      <StatusBar
        backgroundColor={isConnected ? "white" : "red"}
        barStyle={isConnected ? "dark-content" : "light-content"}
        animated={false}
      />
    );

    const messageContainer = (
      <View style={styles.messageContainer} pointerEvents={"none"}>
        {statusBar}
        {!isConnected && ( 
          <View style={styles.bubble}>
            <Text style={styles.text}>No network connection</Text>
          </View>
        )}
      </View>
    );

    return (
      <Animated.View style={[styles.status, { backgroundColor: interpolatedBackgroundColor }]}>
        {messageContainer}
      </Animated.View>
    );
  }
}

const statusHeight = Platform.OS === "ios" ? Constants.statusBarHeight : 0;
const styles = StyleSheet.create({
  status: {
    zIndex: 1,
    height: statusHeight,
  },
  messageContainer: {
    position: 'absolute',
    zIndex: 1,
    top: statusHeight + 20, 
    right: 0,
    left: 0,
    height: 80,
    alignItems: 'center', 
  },
  bubble: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'red',
  },
  text: {
    color: 'white',
  },
});
