import React, {
  Component,
} from 'react';
import Login from 'react-native-simple-login'
import { Text } from 'react-native';
import CalendarList from './CalendarList'

export default class Auth extends Component {
  
  constructor(props){
    super(props)
    this.handleLogin = this.handleLogin.bind(this)
  }
  
  handleLogin(event){
    this.props.navigator.push({name: 'calendar-list', title: 'Calendars' })
  }
  
  render() {
    return(
      <Login onLogin={this.handleLogin} />
    )
    
  }
}