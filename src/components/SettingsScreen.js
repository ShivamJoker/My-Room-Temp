import React, {useState} from 'react';
import {StyleSheet,  Switch, View, SafeAreaView} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {Input, Icon, Slider, Text,Divider, Button} from 'react-native-elements';
import AndroidOpenSettings from 'react-native-android-open-settings';

import {minToHr} from '../utils/time';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const [fetchInterval, setFetchInterval] = useState(60);
  const [isPro, setIsPro] = useState(true);

  const toggleNotificationSwitch = () => {
    setIsNotificationEnabled(previousState => !previousState);
  };

  return (
    <SafeAreaView>
      <View style={styles.mainContainer}>
        <Text>App Config</Text>
        <Divider />
        <View style={styles.topContainer}>
          <Input
            placeholder="Flespi Auth Token"
            leftIcon={{type: 'MaterialIcons', name: 'device-hub'}}
            dataDetectorTypes="link"
          />
        </View>

        <Text>Room Temp Pro Features</Text>
        <Divider />
        <View style={styles.spacedRow}>
          <View>
            <Text style={styles.infoText}>Background fetch</Text>
            <Text>Get charts and notification</Text>
          </View>
          <Switch
            thumbColor={isNotificationEnabled ? 'teal' : '#f4f3f4'}
            onValueChange={toggleNotificationSwitch}
            value={isNotificationEnabled}
            disabled={!isPro}
          />
        </View>
        <View style={styles.spacedRow}>
          <Text style={styles.infoText}>Notification</Text>
          <Switch
            thumbColor={isNotificationEnabled ? 'teal' : '#f4f3f4'}
            onValueChange={toggleNotificationSwitch}
            value={isNotificationEnabled}
            disabled={!isPro}
          />
        </View>
        <View style={{alignItems: 'stretch', justifyContent: 'center'}}>
          <View style={styles.spacedRow}>
            <Text style={styles.infoText}>Interval</Text>
            <Text style={styles.infoText}>
              {minToHr(fetchInterval)} {fetchInterval >= 60 ? 'Hr' : 'Min'}
            </Text>
          </View>

          <Slider
            value={fetchInterval}
            onValueChange={value => setFetchInterval(value)}
            minimumValue={30}
            maximumValue={360}
            step={30}
            animationType="spring"
            thumbTintColor="teal"
            disabled={!isPro}
          />
        </View>
        <Button title="Send Feedback" type="outline" />

        <Button
          icon={<Icon name="star" size={18} color="white" />}
          iconRight={true}
          title="Get EspTemp Pro "
          onPress={() => navigation.navigate('PurchasePage')}
          containerStyle={{marginTop: 50}}
          type="outline"
          raised
        />

        {/* {AndroidOpenSettings.appDetailsSettings()} */}
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  mainContainer: {
    margin: 20,
  },
  topContainer: {marginBottom: 20},
  infoText: {
    fontSize: 18,
  },
  flexRow: {
    flexDirection: 'row',
  },
  spacedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    marginTop: 10,
  },
});
