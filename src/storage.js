import AsyncStorage from '@react-native-community/async-storage';


export const setIP = async ip => {
  try {
    await AsyncStorage.setItem('@espip', ip);
  } catch (e) {
    console.log(e);
  }
};

export const getIP = async () => {
  try {
    const value = await AsyncStorage.getItem('@espip');
    if (value !== null) {
      return value;
    }
  } catch (e) {
    return null;
    console.log(e);
  }
};
