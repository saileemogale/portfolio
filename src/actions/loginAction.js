import getAxios from '../utils/baseApi';

export function signInUser(email, password) {
  var axios = getAxios()
  var jsonData = JSON.stringify({username: email, password: password})
  return dispatch => {	
    axios.post('https://graph.microsoft.com/v1.0/Users/AIN.Voyager@arrkgroup.com/Calendars', jsonData)
    .then(function (response) {
      console.log(response)
    })
    .catch(function (error) {
      console.log(response)
    });
  }
}
