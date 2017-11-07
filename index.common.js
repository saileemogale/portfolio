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
  FlatList
} from 'react-native';
import {AzureInstance, AzureLoginView} from 'react-native-azure-ad-2'
import axios from 'axios';
import moment from 'moment';

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
	
export default class ArrkConfBook extends Component {	

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
		 
		}

		this._fetchCalenderDetails = this._fetchCalenderDetails.bind(this);		
		
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
		  this._fetchCalenderId(access_token, user);
		  this.setState({
			displayType : 'after_login',
			info : user.displayName
		  })		  
		})	
	}
	
	_fetchCalenderId(access_token, user){
		axios.get(`https://graph.microsoft.com/v1.0/Users/${user.mail}/Calendars`, 
		{headers: {
                'accept': 'application/json',                
                'content-type': 'application/x-www-form-urlencoded',
				'Authorization': `Bearer ${access_token}`}
		}
		)
		.then(response =>  {
			//console.log("in response of fetch calender_id call123456");
			//console.log(response);			
			let calender_id = response.data.value[0].id;	
			//console.log(calender_id);
			this._fetchCalenderDetails(access_token, user, calender_id);			
		})
		.catch(e => {				
			console.log(e);
		});			
	}
	
	_fetchCalenderDetails(access_token, user, calender_id){
		//console.log("in fetch calender details");
		var today = moment(new Date()).format('YYYY-MM-DD');
		var tomorrow = moment(moment()).add(1, 'days').format('YYYY-MM-DD');
		axios.get(`https://graph.microsoft.com/v1.0/Users/${user.mail}/Calendars/${calender_id}/calendarview?startdatetime=${today}&enddatetime=${tomorrow}`, 
		{headers: {
                'accept': 'application/json',                
                'content-type': 'application/x-www-form-urlencoded',
				'Authorization': `Bearer ${access_token}`}
		}
		)
		.then(response => {
			//console.log("in response of calenders call");		
			//console.log(response.data.value[0].start);
			//console.log(response.data.value[0].end);
			//console.log(response.data.value);
			this.setState({
				calender_array : response.data.value
			})
		  	
		})
		.catch(e => {
			console.log("Error");			
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
			  <Text style={{color : 'white'}}>Login</Text>
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
			  <Text key="text">You're logged in as {this.state.info} </Text>,
			  <View style={styles.listContainer} key="meeting-info">				
				 {
				   this.state.calender_array.map((item, index) => (					
					  <TouchableOpacity						 
						 style = {styles.container} key="meeting-info-text"
						 onPress = {() => alert(item.start.dateTime)}>
						 <Text style={styles.text} key="start-time">							
							Meeting Start time: {moment(item.start.dateTime).format('MMMM Do YYYY, h:mm:ss a')}
						 </Text>
						 <Text style={styles.text} key="end-time">
							Meeting End time: {moment(item.end.dateTime).format('MMMM Do YYYY, h:mm:ss a')}
						 </Text>
						 <Text style={styles.text} key="subject">							
							Subject: {item.subject}
						 </Text>
						 <Text style={styles.text} key="body">							
							Body Preview: {item.bodyPreview}
						 </Text>						 
						 {
							item.attendees.map((attendee, idx) => {
							<Text style={styles.text} key={attendee.emailAddress.address}>							
								Email: {attendee.emailAddress.address}
							</Text>
							})
						 }
						
					  </TouchableOpacity>
				   ))
				}
			  </View>,
			  <TouchableOpacity key="button" style={styles.button}
				onPress={(this._logout.bind(this))}>
				<Text style={{color : 'white'}}>Logout</Text>
			  </TouchableOpacity>]
		  break
		}
  }
	
	
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,    
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
  button : {
    margin : 24,
    backgroundColor : '#1a6ed1',
    padding : 12
  },
  listContainer: {
    flex: 1,
    marginTop: 20,
  },
  text: {    
    textAlign: 'left',
  },
});

AppRegistry.registerComponent('ArrkConfBook', () => ArrkConfBook);
