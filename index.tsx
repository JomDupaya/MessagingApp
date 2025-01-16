// index.tsx
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Modal, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import Status from './components/Status';
import MessageList from './components/MessageList';
import Toolbar from './components/Toolbar';
import { createTextMessage, createImageMessage, createLocationMessage } from './components/MessageUtils';

interface AppState {
  messages: { id: number; type: string; text?: string; uri?: string; latitude?: number; longitude?: number }[];
  isFocused: boolean;
  fullImageUri: string | null;
}

export default class App extends React.Component<{}, AppState> {
  state: AppState = {
    messages: [],
    isFocused: false,
    fullImageUri: null,
  };

  handleSendMessage = (text: string) => {
    if (text.trim()) {
      const newMessage = createTextMessage(text);
      this.setState((prevState) => ({
        messages: [newMessage, ...prevState.messages],
      }));
    }
  };

  handleDeleteMessage = (id: number) => {
    this.setState((prevState) => ({
      messages: prevState.messages.filter((message) => message.id !== id),
    }));
  };

  handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled) {
      const newMessage = createImageMessage(result.assets[0].uri);
      this.setState((prevState) => ({
        messages: [newMessage, ...prevState.messages],
      }));
    }
  };

  handleFocusChange = (isFocused: boolean) => {
    this.setState({ isFocused });
  };

  handlePressMessage = (item: { id: number; uri?: string }) => {
    if (item.uri) {
      this.setState({ fullImageUri: item.uri, isFocused: false });
    } else {
      this.handleDeleteMessage(item.id);
    }
  };

  closeImagePreview = () => {
    this.setState({ fullImageUri: null });
  };

  handlePressToolbarLocation = async () => {
    const { messages } = this.state;
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }
    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
  
    this.setState({
      messages: [
        createLocationMessage({
          latitude,
          longitude,
        }),
        ...messages,
      ],
    });
  };

  render() {
    const { messages, isFocused, fullImageUri } = this.state;

    return (
      <View style={styles.container}>
        <Status online={true} />
        <View style={styles.content}>
          <MessageList
            messages={messages}
            onPressMessage={this.handlePressMessage}
            onDeleteMessage={this.handleDeleteMessage}
          />
        </View>
        <Toolbar
          isFocused={isFocused}
          onChangeFocus={this.handleFocusChange}
          onSubmit={this.handleSendMessage}
          onPressCamera={this.handleImagePick}
          onPressLocation={this.handlePressToolbarLocation} 
        />
        <StatusBar style="auto" />

        {fullImageUri && (
          <Modal
            transparent={true}
            visible={!!fullImageUri}
            onRequestClose={this.closeImagePreview}
          >
            <TouchableOpacity style={styles.modalContainer} onPress={this.closeImagePreview}>
              <Image source={{ uri: fullImageUri }} style={styles.fullImage} resizeMode="contain" />
            </TouchableOpacity>
          </Modal>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
});
