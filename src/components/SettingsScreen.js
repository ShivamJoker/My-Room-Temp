import React, {useState} from 'react';
import {StyleSheet, Text, Switch, View, Button} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {Input, Icon, Slider} from 'react-native-elements';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const [fetchInterval, setFetchInterval] = useState(30);

  const toggleNotificationSwitch = () => {
    setIsNotificationEnabled(previousState => !previousState);
  };

  return (
    <SafeAreaView>
      <View style={styles.mainContainer}>
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
        <View style={styles.flexRow}>
          <Text style={styles.infoText}>Notification</Text>
          <Switch
            thumbColor={isNotificationEnabled ? 'teal' : '#f4f3f4'}
            onValueChange={toggleNotificationSwitch}
            value={isNotificationEnabled}
          />
        </View>
        <View style={{alignItems: 'stretch', justifyContent: 'center'}}>
          <Slider
            value={fetchInterval}
            onValueChange={value => setFetchInterval(value)}
            minimumValue={30}
            maximumValue={360}
            step={30}
            animationType="spring"
            thumbTintColor="teal"
          />
          <Text style={styles.infoText}>Fetch Every: {fetchInterval} Min</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  mainContainer: {
    margin: 20,
  },
  infoText: {
    fontSize: 18,
  },
  flexRow: {
    flexDirection: 'row',
  },
});
