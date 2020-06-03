import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, StyleSheet, Dimensions} from 'react-native';
import {NavigationContainer, StackActions} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import TempScreen from './components/TempScreen';
import ChartScreen from './components/ChartScreen';
import PurchaseScreen from './components/PurchaseScreen';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const {width} = Dimensions.get('window');

const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();

const App = () => {
  // useEffect(() => {
  //   console.log("index",pageIndex);
  // }, [pageIndex]);

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        tabBarOptions={{style: {
          backgroundColor: "#ecf0f1"
        }}}
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
        <Stack.Screen name="Home" component={TempScreen} />
        <Stack.Screen name="Charts" component={ChartScreen} />
        <Stack.Screen name="Settings" component={ChartScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
const styles = StyleSheet.create({
  page: {
    width: width,
  },
});
export default App;
