/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  ScrollView
} from 'react-native';
import {AzureInstance, AzureLoginView} from 'react-native-azure-ad-2'
import axios from 'axios';
import moment from 'moment'
import { List, ListItem } from "react-native-elements"

import {ReactNativeAD, ADLoginView} from 'react-native-azure-ad'
const CLIENT_ID = 'f8afa059-b330-458c-8d59-dd799e24e128'
const AUTH_URL = 'https://login.microsoftonline.com/common/oauth2/authorize'
const ADContext = new ReactNativeAD({
      client_id : CLIENT_ID,
      authority_host : AUTH_URL,
      client_secret : 'MFCyjDtniB8Xzb8Swg3ga8n',
      resources : [
        'https://graph.microsoft.com',
      ]
    })
	
export default class Auth extends Component {	

    constructor(props){
		super(props)
		
		this.state = {
		  // this property will store user credential after logged in.
		  info : null,
		  // logout if this is true
		  shouldLogout : false,
		  // for display different views
		  displayType : 'before_login',	
		  calender_array : [],
          all_rooms: ["Apollo", "Aryabhatta", "Atlantis", "Chanllenger", "Chandrayan", "Endeavour", "Columbia", "Discovery", "Pioneer", "Voyager"]
		 
		}

        this._fetchCalenderId = this._fetchCalenderId.bind(this)
		this._fetchCalenderDetails = this._fetchCalenderDetails.bind(this)
        this._fetchAllRooms = this._fetchAllRooms.bind(this)
		
	}
	
	
	_onURLChange(e) {
    // listen to webview URL change, if the URL matches login URL redirect user
    // to start page.
    let isLoginPage = e.url === `${AUTH_URL}?response_type=code&client_id=${CLIENT_ID}`
    if(isLoginPage && this.state.shouldLogout) {
		  //console.log('logged out')
		  this.setState({
			displayType : 'before_login',
			shouldLogout : false
		  })
		}
	}

	_showADLogin() {
		this.setState({
		  displayType : 'login'
		})
	}

	_logout() {
		this.setState({
		  displayType : 'login',
		  shouldLogout : true
		})
	}
	
	
	_onLoginSuccess(cred) {
		//console.log('user credential', cred)
		let access_token = ADContext.getAccessToken('https://graph.microsoft.com')
		fetch('https://graph.microsoft.com/beta/me', {
		  method : 'GET',
		  headers : {
			Authorization : `bearer ${access_token}`
		  }
		})
		.then(res => res.json())
		.then(user => {
		  //console.log("user logged in");
		  //console.log(user.mail);
          //this._fetchAllRooms(access_token, user)
		  this._fetchCalenderId(access_token, user)
          //this._fetchAllRooms(access_token, user)
		  this.setState({
			displayType : 'after_login',
			info : user.displayName
		  })		  
		})	
	}
	
	_fetchCalenderId(access_token, user){
		axios.get("https://graph.microsoft.com/beta/me/calendars", 
		{headers: {
                'accept': 'application/json',                
                'content-type': 'application/x-www-form-urlencoded',
				'Authorization': `Bearer ${access_token}`}
		}
		)
		.then(response =>  {
            console.log("in response of calendars")
			//console.log("in response of fetch calender_id call123456");
			let calender_id = response.data.value[0].id;	
			console.log(calender_id);
			this._fetchCalenderDetails(access_token, user, calender_id)
            
		})
		.catch(e => {		
            console.log("in catch of fetch calendar id")
			console.log(e);
		});			
	}
	
	_fetchCalenderDetails(access_token, user, calender_id){
		//console.log("in fetch calender details");  
		var today = moment(new Date()).format('YYYY-MM-DD');
		var tomorrow = moment(moment()).add(1, 'days').format('YYYY-MM-DD');
		axios.get("https://graph.microsoft.com/beta/users/972ebbe9-be8d-45b4-8009-f6935135559d/calendar/calendarView?startDateTime=2017-12-18&endDateTime=2017-12-19", 
		{headers: {
                'accept': 'application/json',                
                'content-type': 'application/json',
				'Authorization': `Bearer ${access_token}`}
		}
		)
		.then(response => {
			//console.log("in response of calenders call");		
			//console.log(response.data.value[0].start);
			//console.log(response.data.value[0].end);
            console.log("In success of calendar details")
			console.log(response.data.value);
			this.setState({
				calender_array : response.data.value
			})
		  	
		})
		.catch(e => {
			console.log("In catch of fetch calendar details");			
			console.log(e);
		});	
      
      
	}
  
    _fetchAllRooms(access_token, user){
        console.log("in fetch all rooms")
        console.log(access_token)
		//console.log("in fetch calender details");  
		axios.get("https://graph.microsoft.com/beta/users/sailee.mogale@arrkgroup.com/findrooms",
		{headers: {
                'Content-Type': 'application/json',                
				'Authorization': `Bearer ${access_token}`}
		}
		)
		.then(response => {
			//console.log("in response of calenders call");		
			//console.log(response.data.value[0].start);
			//console.log(response.data.value[0].end);
			//console.log(response.data.value);
            console.log(response.data.value)
			this.setState({
				all_rooms : response.data.value
			})
		  	
		})
		.catch(e => {
			console.log("In catch of fetch all rooms");			
			console.log(e);
		});	
      
      
	}

    render() {
        return (
		<View style={styles.container}>
			{this._renderContent.bind(this)()}
		</View>           
        );
    }
	
	
	_renderContent() {
		switch(this.state.displayType) {
		  case 'before_login' :
			return <TouchableOpacity style={styles.button}
			  onPress={(this._showADLogin.bind(this))}>
              <Image source={require('../assets/hang-on-backdrop.png')} style={styles.backgroundImage} />
			</TouchableOpacity>
		  case 'login' :
			// In fact we care if it successfully redirect to the URI, because
			// we alread have the access_token after successfully logged in.
			// set `hideAfterLogin` to `true` so that it won't display an error page.
			return [			  
			  <ADLoginView
				key="webview"
				hideAfterLogin={true}
				style={{flex :1}}
				needLogout={this.state.shouldLogout}
				context={ADContext}
				onURLChange={this._onURLChange.bind(this)}
				onSuccess={this._onLoginSuccess.bind(this)}/>			
			]
		  case 'after_login' :
			return [
              <View style={styles.listContainer} key="meeting-info">
                <Text style={styles.baseText}>
                      Bookings
                </Text>
                <ScrollView horizontal>
                  {
                  this.state.all_rooms.map((room, index) => (
                    <View style={{ width: 150, height: 25, backgroundColor: '#c9a449' }}><Text>{room}</Text></View>
                  ))
                }
                </ScrollView>
                {
                  this.state.calender_array.map((item, index) => (
                    <ListItem
                        key={index}
                        title={item.organizer.emailAddress.name}
                        subtitle={`${moment(item.start.dateTime).utcOffset(+660).format('Do MMM, h:mm a')} - ${moment(item.end.dateTime).utcOffset(+660).format('h:mm a')}`}
                        style={styles.listContainer}
                      />
                  ))
                }
                
                
              </View>
			  ]
		  break
		}
  }
	
	
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,    
    alignItems: 'center',
    backgroundColor: '#ffffff',
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
  button : {
    margin : 24,
    backgroundColor : '#1a6ed1',
    padding : 12
  },
  listContainer: {
    width: 300,
    marginTop: 20
  },
  text: {    
    textAlign: 'left',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
  },
  contentContainer: {
    paddingVertical: 20,
    backgroundColor: '#8B008B'
  },
  baseText: {
    paddingVertical: 10,
    fontSize: 18,
    fontWeight: 'bold'
  }
});