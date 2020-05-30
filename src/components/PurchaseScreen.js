import React, {useEffect} from 'react';
import {View, Text, Platform, Button} from 'react-native';
import * as RNIap from 'react-native-iap';

const itemSkus = Platform.select({
  android: ['com.myroomtemp.premium'],
});

const PurchaseScreen = () => {
  getItems = async () => {
    try {
      const result = await RNIap.initConnection();
      console.log('result', result);

      const products = await RNIap.getProducts(itemSkus);
      console.log('Products', products);
    } catch (err) {
      console.warn(err.code, err.message);
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  const buyPremium = async () => {
    try {
      RNIap.requestPurchase('com.myroomtemp.premium');
    } catch (err) {
      console.warn(err.code, err.message);
    }
  };

  return (
    <View>
      <Button title="Buy me" onPress={() => buyPremium()} />
    </View>
  );
};

export default PurchaseScreen;
