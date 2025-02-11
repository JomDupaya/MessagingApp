//Toolbar.js
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';

const ToolbarButton = ({ title, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Text style={styles.button}>{title}</Text>
  </TouchableOpacity>
);

ToolbarButton.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default class Toolbar extends React.Component {
    state = {
      text: "",
    };
  
    setInputRef = (ref) => {
      this.input = ref;
    };
  
    componentDidUpdate(prevProps) {
      if (prevProps.isFocused !== this.props.isFocused) {
        if (this.props.isFocused) {
          this.input.focus();
        } else {
          this.input.blur();
        }
      }
    }
  
    handleChangeText = (text) => {
      this.setState({ text });
    };
  
    handleSubmitEditing = () => {
      const { onSubmit } = this.props;
      const { text } = this.state;
      if (!text) return;
      onSubmit(text);
      this.setState({ text: "" });
    };
  
    handleFocus = () => {
      const { onChangeFocus } = this.props;
      onChangeFocus(true);
    };
  
    handleBlur = () => {
      const { onChangeFocus } = this.props;
      onChangeFocus(false);
    };
  
    render() {
      const { onPressCamera, onPressLocation } = this.props;
      const { text } = this.state;
      return (
        <View style={styles.toolbar}>
          <ToolbarButton title={"📷"} onPress={onPressCamera} />
          <ToolbarButton title={"📍"} onPress={onPressLocation} />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              underlineColorAndroid={"transparent"}
              placeholder={"Type something!"}
              blurOnSubmit={false}
              value={text}
              onChangeText={this.handleChangeText}
              onSubmitEditing={this.handleSubmitEditing}
              // Additional props!
              ref={this.setInputRef}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
            />
          </View>
        </View>
      );
    }
  }

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.5)',
  },
  button: {
    top: -2,
    marginRight: 12,
    fontSize: 24,  
    color: 'grey',
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: "rgba(0,0,0,0.02)",
  },
  input: {
    flex: 1,
    fontSize: 18,
  },
});
