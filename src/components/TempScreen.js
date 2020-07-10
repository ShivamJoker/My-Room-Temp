import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Animated,
  Dimensions,
  Text,
  RefreshControl,
  StatusBar,
  Easing,
} from 'react-native';

// import {Icon} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';

import LinearGradient from 'react-native-linear-gradient';
import Zeroconf from 'react-native-zeroconf';
import PushNotification from 'react-native-push-notification';
import BackgroundFetch from 'react-native-background-fetch';
import {getIP, setIP} from '../utils/storage.js';
import {tempIcon} from '../utils/time.js';
import {getGradient} from '../utils/tempScreen.js';

//get width
const {width, height} = Dimensions.get('window');

const zeroconf = new Zeroconf();

// all the images and icons here

import HomeImg from '../../assets/images/home background.svg';

const TempScreen = () => {
  // dummy temp data
  const [tempResponse, setTempResponse] = useState({
    temperature: 100,
    humidity: 69,
  });

  const [refreshing, setRefreshing] = useState(false);

  const anim = useRef(new Animated.Value(0));

  const spin = useRef(
    anim.current.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    }),
  );

  const spinAnimStart = useCallback(() => {
    Animated.loop(
      // increase size
      Animated.timing(anim.current, {
        toValue: 1,
        useNativeDriver: true,
        easing: Easing.linear,
        duration: 5000,
      }),
    ).start();
  });

  const fetchTemp = useCallback((URL) => {
    setRefreshing(true); //set the refreshing to true

    fetch(URL)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setTempResponse(data);
        //we will set the refresing false after the data is fetched
        setRefreshing(false);
      });
  });

  //find the esp using zeroconf
  const findEspAndFetchData = useCallback(() => {
    zeroconf.scan((type = 'http'), (protocol = 'tcp'), (domain = 'local.'));

    zeroconf.on('start', () =>
      console.log('The scan has started.\n Finding esptemp'),
    );

    zeroconf.on('resolved', e => {
      console.log(e);
      if (e.name === 'esptemp') {
        //this will give us the ip of the local device
        const URL = `http://${e.addresses[0]}:${e.port}`;

        fetchTemp(URL);
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

    // Optional: Query the authorization status.
    BackgroundFetch.status(status => {
      switch (status) {
        case BackgroundFetch.STATUS_RESTRICTED:
          console.log('BackgroundFetch restricted');
          break;
        case BackgroundFetch.STATUS_DENIED:
          console.log('BackgroundFetch denied');
          break;
        case BackgroundFetch.STATUS_AVAILABLE:
          console.log('BackgroundFetch is enabled');
          break;
      }
    });
  };

  useEffect(() => {
    //start the animation

    // spinAnimStart();

    findEspAndFetchData();

    // makes the sequence loop

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
      //stop the animation
      // spinAnim.stop();
    };
  }, []);

  //component goes here
  return (
    <>
      <StatusBar
        backgroundColor="rgba(0, 0, 0, .2)"
        translucent
        barStyle="light-content"
      />
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
          <LinearGradient colors={getGradient()} style={styles.bgGradient} />
          <HomeImg width={width + 2} height={width - 10} style={styles.bgImg} />
          <View style={styles.innerContainer}>
            <Animated.View style={{transform: [{rotate: spin.current}]}}>
              <Icon name={tempIcon()} size={100} color="#fff" />
            </Animated.View>

            <>
              <Text style={styles.tempTxt}>
                {Math.round(tempResponse.temperature)}°
              </Text>
              <Text style={styles.humidityTxt}>
                Humidity {Math.round(tempResponse.humidity)}%
              </Text>
            </>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'orange',
  },
  innerContainer: {
    height: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    alignItems: 'center',
    // justifyContent: 'center',
    height: '100%',
    paddingTop: 50,
  },
  tempTxt: {
    marginTop: 20,
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
    position: 'absolute',
    bottom: 0,
  },
  bgGradient: {
    height: height,
    width: width,
    zIndex: -1,
    position: 'absolute',
  },
  icon: {
    width: 100,
    height: 100,
    // marginTop: 50,
    // marginBottom: 20,
  },
});

export default TempScreen;
