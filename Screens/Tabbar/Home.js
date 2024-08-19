import {View, Text, ScrollView, BackHandler, Alert} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import Menuchatbar from '../../Components/Home/Menuchatbar';
import Showbalance from '../../Components/Home/Showbalance';
import tw from 'twrnc';
import {useFocusEffect} from '@react-navigation/native';
import Cbids from '../../Components/Home/Cbids';

const Home = ({navigation,route}) => {

  useFocusEffect(
    React.useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackButtonPress,
      );

      return () => backHandler.remove();
    }, []),
  );

  const handleBackButtonPress = () => {
    Alert.alert(
      'Exit App',
      'Are you sure you want to exit?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            BackHandler.exitApp();
          },
        },
      ],
      {cancelable: false},
    );
    return true; // Prevent default back button behavior
  };

  return (
    <>
      <View style={[tw`flex flex-1`, {backgroundColor: '#FFFFFF'}]}>
        <Menuchatbar navigation={navigation} />
        <Showbalance   />


         <Cbids navigation={navigation} />
      </View>
    </>
  );
};

export default Home;
