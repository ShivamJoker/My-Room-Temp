import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Dimensions,
  Text,
  RefreshControl,
  StatusBar,
  ActivityIndicator,
  ImageBackground,
  Image,
} from 'react-native';

import Zeroconf from 'react-native-zeroconf';
import PushNotification from 'react-native-push-notification';
import BackgroundFetch from 'react-native-background-fetch';
import {getIP, setIP} from '../utils/storage.js';

const zeroconf = new Zeroconf();

// all the images and icons here

const sunny = require('../../assets/images/sunny.jpg');
const cloudy = require('../../assets/images/cloudy.jpg');
const night = require('../../assets/images/night.jpg');

const cloudIcon = require('../../assets/images/icons/cloud.png');
const moonIcon = require('../../assets/images/icons/moon.png');
const sunnyIcon = require('../../assets/images/icons/sunny.png');

const TempScreen = () => {
  const [tempResponse, setTempResponse] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const espURL = useRef(null);

  const fetchTemp = useCallback(() => {
    setRefreshing(true);
    fetch(espURL.current)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setTempResponse(data);
        //we will set the refresing false after the data is fetched
        setRefreshing(false);
      });
  }, [espURL]);

  //find the esp using zeroconf
  const findEsp = useCallback(() => {
    zeroconf.scan((type = 'http'), (protocol = 'tcp'), (domain = 'local.'));

    zeroconf.on('start', () =>
      console.log('The scan has started.\n Finding esptemp'),
    );

    zeroconf.on('resolved', e => {
      console.log(e);
      if (e.name === 'esptemp') {
        //this will give us the ip of the local device
        const URL = `http://${e.addresses[0]}:${e.port}`;
        setIP(URL);
        espURL.current = URL;
        fetchTemp();
      }
    });
  });

  const init = async () => {
    BackgroundFetch.configure(
      {
        minimumFetchInterval: 15, // <-- minutes (15 is minimum allowed)
        // Android options
        forceAlarmManager: false, // <-- Set true to bypass JobScheduler.
        stopOnTerminate: false,
        startOnBoot: true,
        periodic: true,
        enableHeadless: true,
      },
      async taskId => {
        console.log('[js] Received background-fetch event: ', taskId);
        // Required: Signal completion of your task to native code
        // If you fail to do this, the OS can terminate your app
        // or assign battery-blame for consuming too much background-time
        BackgroundFetch.finish(taskId);
      },
      error => {
        console.log('[js] RNBackgroundFetch failed to start');
      },
    );
  };

  useEffect(() => {
    getIP().then(e => {
      console.log(e);
      espURL.current = e;

      console.log(espURL.current);

      if (!espURL.current) {
        findEsp();
      } else {
        console.log('fetching temp');
        fetchTemp();
      }
    });

    init();

    PushNotification.configure({
      onNotification: function(notification) {
        console.log('NOTIFICATION:', notification);
      },

      popInitialNotification: true,
      requestPermissions: false,
    });

    return () => {
      zeroconf.removeAllListeners();
    };
  }, []);

  //component goes here
  return (
    <>
      <StatusBar translucent backgroundColor="rgba(0, 0, 0, .2)" barStyle="light-content"/>
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={fetchTemp}
              progressViewOffset={20}
            />
          }>
          <Image source={sunny} style={styles.bgImg} />

          <Image style={styles.icon} source={sunnyIcon} />
          {tempResponse ? (
            <>
              <Text style={styles.tempTxt}>
                {Math.round(tempResponse.temperature)}°
              </Text>
              <Text style={styles.humidityTxt}>
                Humidity {Math.round(tempResponse.humidity)}%
              </Text>
            </>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  scrollView: {
    alignItems: 'center',
    // justifyContent: 'center',
    height: '100%',
  },
  tempTxt: {
    fontSize: 100,
    fontFamily: 'Rubik-Light',
    fontWeight: '300',
    color: '#fff',
    transform: [{translateX: 10}],
  },

  humidityTxt: {
    fontSize: 35,
    fontFamily: 'Rubik-Regular',
    fontWeight: '400',
    color: '#fff',
    transform: [{translateY: -6}],
    // backgroundColor: 'rgba(0,0,0,.3)',
    width: '100%',
    textAlign: 'center',
  },

  bgImg: {
    flex: 1,
    position: 'absolute',
    top: 0,
    alignItems: 'center',
    width: '100%',
    height: '100%',
    aspectRatio: 1125 / 2436,
    resizeMode: 'cover',
    opacity: 0.8,
  },
  icon: {
    width: 100,
    height: 100,
    marginTop: 70,
    marginBottom: 20,
  },
});

export default TempScreen;
