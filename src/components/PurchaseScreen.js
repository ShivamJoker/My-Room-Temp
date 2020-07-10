import React, {useEffect} from 'react';
import {
  View,
  Text,
  Platform,
  SafeAreaView,
  Button,
  Alert,
  StyleSheet,
} from 'react-native';

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
      console.log('your item was', restore);

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
        Alert.alert('purchase error', JSON.stringify(error.message));
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
    <SafeAreaView style={styles.container}>
      <Button title="Go Premium" onPress={() => buyPremium()} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    // width: "80%",
    height: '50%',
    // maxHeight: 500,
    // backgroundColor: 'pink'
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PurchaseScreen;
