import React, { Component } from 'react';
import { AppRegistry, Text, StyleSheet, View } from 'react-native';

export default class CalendarListItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
                titleText: "Bird's Nest",
                bodyText: 'This is not really a bird nest. Adding long text to see if it truncates after 3 lines and displays the truncation sign properly.'
              };
    }

    render() {
        return (
              <View>
                <Text style={styles.titleText} onPress={this.onPressTitle}>
                  {this.state.titleText}
                </Text>
                <Text numberOfLines={3} ellipsizeMode ={'tail'} style={styles.baseText}>
                  {this.state.bodyText}
                </Text>
              </View>
            );
    }
}

const styles = StyleSheet.create({
    baseText: {
      fontFamily: 'Cochin',
    },
    titleText: {
      fontSize: 20,
      fontWeight: 'bold',
    },
});

// App registration and rendering
AppRegistry.registerComponent('CalendarListItem', () => CalendarListItem);