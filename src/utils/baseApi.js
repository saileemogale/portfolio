import axios from 'axios';
import ES6Promise from 'es6-promise';

ES6Promise.polyfill();

export default function getAxios() {
    axios.defaults.baseURL = window.location.origin
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    axios.defaults.headers.post['Content-Type'] = 'application/json';
    axios.defaults.headers.get['Content-Type'] = 'application/json';
    return axios;
}
