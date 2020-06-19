import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, Button, StyleSheet, Dimensions} from 'react-native';
import {NavigationContainer, StackActions} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import TempScreen from './components/TempScreen';
import ChartScreen from './components/ChartScreen';
import PurchaseScreen from './components/PurchaseScreen';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SettingsScreen from './components/SettingsScreen';

const {width} = Dimensions.get('window');



const RootStack = createStackNavigator();

const Tab = createBottomTabNavigator();

const MainTabScreen = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        style: {
          backgroundColor: 'rgba(255,255,255,.88)',
          position: 'absolute',
          borderTopWidth: 0,
          elevation: 0,
        }
      }}
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Charts':
              iconName = 'chart-line';
              break;
            case 'Settings':
              iconName = 'settings';
              break;
          }

          // You can return any component that you like here!
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}>
      <Tab.Screen name="Home" component={TempScreen} />
      <Tab.Screen name="Charts" component={ChartScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};


const App = () => {

  return (
    <NavigationContainer>
      <RootStack.Navigator mode="modal" headerMode="none">
        <RootStack.Screen name="Main" component={MainTabScreen} />
        <RootStack.Screen name="PurchasePage" component={PurchaseScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
const styles = StyleSheet.create({
  page: {
    width: width,
  },
});
export default App;
