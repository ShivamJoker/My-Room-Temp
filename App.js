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
const zeroconf = new Zeroconf();

const sunny = require('./src/images/sunny.jpg');
const cloudy = require('./src/images/cloudy.jpg');
const night = require('./src/images/night.jpg');

const {imgWidth, imgHeight} = Image.resolveAssetSource(sunny);

const cloudIcon = require('./src/images/icons/cloud.png');
const moonIcon = require('./src/images/icons/moon.png');
const sunnyIcon = require('./src/images/icons/sunny.png');

const App = () => {
  const [tempResponse, setTempResponse] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const espURL = useRef(null);

  const fetchTemp = useCallback(() => {
    setRefreshing(true); //we will set the refresing true till we fetch the data
    fetch(espURL.current)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setTempResponse(data);
        setRefreshing(false);
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
          {/* <ImageBackground source={cloudy} style={styles.bgImg}> */}
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
          ) : (
            <ActivityIndicator size="large" color="#0000ff" />
          )}
          {/* </ImageBackground> */}
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
    height: "100%",
    aspectRatio: 1125/2436,
    resizeMode: 'cover',
    opacity: .8, 
  },
  icon: {
    width: 100,
    height: 100,
    marginTop: 70,
    marginBottom: 20,
  },
});

export default App;
