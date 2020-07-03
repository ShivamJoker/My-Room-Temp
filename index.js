/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

import BackgroundFetch from 'react-native-background-fetch';
import PushNotification from 'react-native-push-notification';
import {getIP, addTempData} from './src/utils/storage.js';


//our background fetch 
let MyHeadlessTask = async event => {
  // Get task id from event {}:
  let taskId = event.taskId;

  console.log('[BackgroundFetch HeadlessTask] start: ');

  const res = await fetch(await getIP());
  // destructure object
  const {temperature, humidity} = await res.json();
  console.log(temperature, humidity);

  //add it to database
  await addTempData(temperature, humidity);

  //will also send local push when we get new data
  PushNotification.localNotification({
    ignoreInForeground: false,
    title: `Current Room Temp 🌡 ${temperature}℃`,
    message: `Temperatue ${temperature}℃ Humidity ${humidity}%`, // (required)
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
