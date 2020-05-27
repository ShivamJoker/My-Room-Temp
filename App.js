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
const zeroconf = new Zeroconf();

// all the images and icons here

const sunny = require('./src/images/sunny.jpg');
const cloudy = require('./src/images/cloudy.jpg');
const night = require('./src/images/night.jpg');

const cloudIcon = require('./src/images/icons/cloud.png');
const moonIcon = require('./src/images/icons/moon.png');
const sunnyIcon = require('./src/images/icons/sunny.png');

const App = () => {
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

        //will also send local push when we get new data
        PushNotification.localNotification({
          ignoreInForeground: false,
          title: `Current Room Temp 🌡 ${data.temperature}℃`,
          message: `Temperatue ${data.temperature}℃ Humidity ${data.humidity}%`, // (required)
          playSound: false,
          number: 3,
        });
      });
  }, [espURL]);

  useEffect(() => {
    console.log('refresh changed');

    zeroconf.scan((type = 'http'), (protocol = 'tcp'), (domain = 'local.'));

    zeroconf.on('start', () => console.log('The scan has started.'));

    zeroconf.on('resolved', e => {
      console.log(e);
      if (e.name === 'esptemp') {
        //this will give us the ip of the local device
        const URL = `http://${e.addresses[0]}:${e.port}`;
        espURL.current = URL;
        fetchTemp();
      }
    });

    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function(token) {
        console.log('TOKEN:', token);
      },

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

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" />
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
    // textShadowColor: 'black',
    // textShadowOffset: {width: 0, height: 0},
    // textShadowRadius: 1,
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

export default App;
