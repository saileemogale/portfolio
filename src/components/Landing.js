import React, {Component} from 'react';
import {Navigator, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import CalendarList from './CalendarList';
import Auth from './Auth';

export default class Landing extends Component {

    renderScene(route, navigator) {
      console.log(route.name)
        switch (route.name) {
            case 'auth':
                return <Auth navigator={navigator} />
            case 'calendar-list':
                return <CalendarList navigator={navigator} />
        }
    }

    render() {
        return (
            <Navigator
                initialRoute={{name: 'auth', title: 'auth'}}
                renderScene={this.renderScene}
                navigationBar={
                    <Navigator.NavigationBar
                        routeMapper={{
                            LeftButton: (route, navigator, index, navState) => {
                                if (route.name === 'auth') {
                                    return null;
                                } else {
                                    return null;
                                }
                            },
                            RightButton: (route, navigator, index, navState) => {
                                return null;
                            },
                            Title: (route, navigator, index, navState) => {
                                return (<Text style={styles.title}>{route.title}</Text>);
                            },
                        }}
                        style={styles.navBar}
                    />
                }
            />
        )
    }
}

const styles = StyleSheet.create({
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