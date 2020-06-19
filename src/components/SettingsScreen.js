import React, {useState} from 'react';
import {StyleSheet, Text, Switch, View, SafeAreaView} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {Input, Icon, Slider, Divider, Button} from 'react-native-elements';
import AndroidOpenSettings from 'react-native-android-open-settings';

import {minToHr} from '../utils/time';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const [fetchInterval, setFetchInterval] = useState(60);

  const toggleNotificationSwitch = () => {
    setIsNotificationEnabled(previousState => !previousState);
  };

  return (
    <SafeAreaView>
      <View style={styles.mainContainer}>
        <View style={styles.topContainer}>
          <Input
            label={
              <View style={styles.flexRow}>
                <Text>Request URL </Text>
                <Icon name="info" size={20} color="teal" />
              </View>
            }
            placeholder="http://192.168.11.11/weather"
            leftIcon={{type: 'MaterialIcons', name: 'link'}}
            dataDetectorTypes="link"
          />
          <Button title="Scan for EspTemp" type="outline" />
        </View>

        <Text>Room Temp Pro Features</Text>
        <Divider />
        <View style={styles.spacedRow}>
          <Text style={styles.infoText}>Notification</Text>
          <Switch
            thumbColor={isNotificationEnabled ? 'teal' : '#f4f3f4'}
            onValueChange={toggleNotificationSwitch}
            value={isNotificationEnabled}
          />
        </View>
        <View style={{alignItems: 'stretch', justifyContent: 'center'}}>
          <View style={styles.spacedRow}>
            <Text style={styles.infoText}>Fetch Data in</Text>
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
