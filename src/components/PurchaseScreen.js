import React, {useEffect} from 'react';
import {View, Text, Platform, Button, Alert} from 'react-native';

import RNIap, {
  purchaseErrorListener,
  purchaseUpdatedListener,
  finishTransaction,
} from 'react-native-iap';
import iapUtils from 'react-native-iap';

//items of products
const itemSkus = Platform.select({
  android: ['com.myroomtemp.premium'],
});

let purchaseUpdate, purchaseError;

const PurchaseScreen = () => {
  getItems = async () => {
    try {
      const result = await RNIap.initConnection();
      console.log('connection initialised', result);
      const products = await RNIap.getProducts(itemSkus);
      console.log('Products', products[0].title);

      const restore = await RNIap.getAvailablePurchases();
      console.log("your item was",restore);

      purchaseUpdate = purchaseUpdatedListener(async purchase => {
        const receipt = purchase.transactionReceipt;
        if (receipt) {
          try {
            const ackResult = await finishTransaction(purchase);
          } catch (ackErr) {
            console.warn('ackErr', ackErr);
          }

          Alert.alert(
            'Purchase complete',
            'Thanks for purchasing, Now you can enjoy the premium benefits ',
          );
        }
      });

      purchaseError = purchaseErrorListener(error => {
        console.log('purchaseErrorListener', error);
        Alert.alert('purchase error', JSON.stringify(error));
      });
      //   const consumed = await RNIap.consumeAllItemsAndroid();
      //   console.log('consumed all items?', consumed);
    } catch (err) {
      console.warn(err.code, err.message);
    }
  };

  useEffect(() => {
    getItems();

    //remove the listerners on component unmount
    return () => {
      if (purchaseUpdate) {
        purchaseUpdate.remove();
        purchaseUpdate = null;
      }
      if (purchaseError) {
        purchaseError.remove();
        purchaseError = null;
      }
      RNIap.endConnection();
    };
  }, []);

  const buyPremium = async () => {
    try {
      await RNIap.requestPurchase('com.myroomtemp.premium');
      console.log('Purchase success');
    } catch (err) {
      console.warn(err.code, err.message);
    }
  };

  return (
    <View style={{position: "absolute", bottom: 40, width: "100%", height: 100}}>
      <Button title="Go Premium" onPress={() => buyPremium()} />
    </View>
  );
};

export default PurchaseScreen;
