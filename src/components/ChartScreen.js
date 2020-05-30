import React from 'react';
import {View, Text, Dimensions} from 'react-native';
import {LineChart} from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const ChartScreen = () => {
  return (

      <LineChart
        data={{
          labels: ['1', '3', '5', '7', '9', '11','13','15','17','19', '20', '22'],
          datasets: [
            {
              data: [
                Math.random() * 50,
                Math.random() * 50,
                Math.random() * 50,
                Math.random() * 50,
                Math.random() * 50,
                Math.random() * 50,
                Math.random() * 50,
                Math.random() * 50,
                Math.random() * 50,
                Math.random() * 50,
                Math.random() * 50,
                Math.random() * 50,
              ],
            },
          ],
        }}
        width={Dimensions.get('window').width + 1} // from react-native
        height={Dimensions.get('window').width}
        
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
            width: "100%"
        }}
      />

  );
};

export default ChartScreen;
