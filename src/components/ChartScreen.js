import React, {useState, useEffect} from 'react';
import {View, Text, Dimensions, Modal, Button} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import PurchaseScreen from './PurchaseScreen';
import { SafeAreaView } from 'react-native-safe-area-context';

const {width, height} = Dimensions.get('window');

const ChartScreen = () => {

  return (
    <>
    <SafeAreaView>
      <LineChart
        data={{
          labels: [
            '1',
            '3',
            '5',
            '7',
            '9',
            '11',
            '13',
            '15',
            '17',
            '19',
            '20',
            '22',
          ],
          datasets: [
            {
              data: [
                33,35,50,46,48,32,35,25,21,19
              ],
            },
          ],
        }}
        width={width + 1} // from react-native
        height={width}
        yAxisSuffix="℃"
        segments={5}
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          decimalPlaces: 1, // optional, defaults to 2dp

          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,

          propsForDots: {
            r: '5',
            strokeWidth: '2',
            stroke: '#ffa726',
          },
        }}
        // bezier
        style={{
          //   marginVertical: 8,
          width: '100%',
        }}
      />
      
        {/* <PurchaseScreen/> */}
      
        </SafeAreaView>
    </>
  );
};

export default ChartScreen;
