import React, {Component} from 'react';
import {AppRegistry, Navigator, Text, TouchableOpacity, Image, StyleSheet, View} from 'react-native';
import Login from 'react-native-simple-login'
import CalendarListItem from './CalendarListItem'

export default class CalendarList extends Component {
  
  constructor(props){
    super(props)
    this.state = {
      titleText: "Bird's Nest",
      bodyText: 'This is not really a bird nest.'
    }
  }

    render() {
        return (
          <CalendarListItem />
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      width: 320
    },
    baseText: {
      fontFamily: 'Cochin',
    },
    titleText: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    navBar: {
        backgroundColor: '#FAFAFF',
        height: 60,
    },
    backButton: {
        marginTop: 8,
        marginLeft: 12,
        height: 24,
        width: 24
    },
    title: {
        padding: 8,
        fontSize: 16,
        fontWeight: 'bold'
    }
});

AppRegistry.registerComponent('CalendarList', () => CalendarList);