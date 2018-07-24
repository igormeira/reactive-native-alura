/** @format */

import { Navigation } from 'react-native-navigation';
import Login from './src/screens/Login';
import Feed from './src/screens/Feed';
import {name as appName} from './app.json';
import { AsyncStorage } from 'react-native';

Navigation.registerComponent('Login', () => Login);
Navigation.registerComponent('Feed', () => Feed);

AsyncStorage.getItem('token')
  .then(token => {
    if(token) {
      return {
        screen: 'Feed',
        title: 'Feed'
      };
    }
    return {
      screen: 'Login',
      title: 'Login'
    }
  })
  .then(screen => {
    Navigation.startSingleScreenApp({screen : screen});
  });
