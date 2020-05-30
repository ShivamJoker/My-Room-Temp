/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

import BackgroundFetch from 'react-native-background-fetch';
import PushNotification from 'react-native-push-notification';
import {getIP} from './src/storage.js';

let MyHeadlessTask = async event => {
  // Get task id from event {}:
  let taskId = event.taskId;

  console.log('[BackgroundFetch HeadlessTask] start: ');

  const res = await fetch(await getIP());
  const data = await res.json();
  console.log(data);

  //will also send local push when we get new data
  PushNotification.localNotification({
    ignoreInForeground: false,
    title: `Current Room Temp 🌡 ${data.temperature}℃`,
    message: `Temperatue ${data.temperature}℃ Humidity ${data.humidity}%`, // (required)
    playSound: false,
    number: 3,
  });

  // Required:  Signal to native code that your task is complete.
  // If you don't do this, your app could be terminated and/or assigned
  // battery-blame for consuming too much time in background.
  BackgroundFetch.finish(taskId);
};

// Register your BackgroundFetch HeadlessTask
BackgroundFetch.registerHeadlessTask(MyHeadlessTask);

AppRegistry.registerComponent(appName, () => App);
