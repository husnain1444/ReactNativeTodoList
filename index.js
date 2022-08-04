/**
 * @format
 */

import {AppRegistry} from 'react-native';
import LogIn from './screens/LogIn';
import {name as appName} from './app.json';
import PushNotification from "react-native-push-notification";
import App from './App';
import * as RootNavigation from './screens/LogIn.js';


PushNotification.configure({
    // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    console.log("NOTIFICATION:", notification);

    console.log(notification.data)
    if(notification.channelId == "Todo-PushNotifications" && notification.data.isOpenable == undefined ) {
      // if(notification.foreground)
      setTimeout(() => {
        RootNavigation.navigate("MainScreen")
      }, 2000)
    }
    // process the notification

    // (required) Called when a remote is received or opened, or local notification is opened
    // notification.finish(PushNotificationIOS.FetchResult.NoData);
  },
  requestPermissions: Platform.OS === 'ios'
})

AppRegistry.registerComponent(appName, () => LogIn);
