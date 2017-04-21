/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {view} from 'react-native';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Login from 'react-native-simple-login';

export default class ArrkConfBook extends Component {

  render() {
    return (
      <Login />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('ArrkConfBook', () => ArrkConfBook);
