import { View, Text, ScrollView, BackHandler, Alert, Image } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import Menuchatbar from '../../Components/Home/Menuchatbar';
import Showbalance from '../../Components/Home/Showbalance';
import tw from 'twrnc';
import { useFocusEffect } from '@react-navigation/native';
import Cbids from '../../Components/Home/Cbids';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../Firebase';

const Home = ({ navigation, route }) => {
  const [userflag, setuserflag] = useState("");
  const [GetData, setGetData] = useState([]);


  useEffect(() => {
    AsyncStorage.getItem("role").then((role) => {

      setuserflag(role)

    })
  }, [])

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
      { cancelable: false },
    );
    return true; // Prevent default back button behavior
  };



  useEffect(() => {

    AsyncStorage.getItem("email").then((email) => {
      const coll = collection(db, 'Profile');
      const q = query(coll, where('role', '==', "subadmin"));

      const unSubscribe = onSnapshot(q, snapshot => {
        setGetData(
          snapshot.docs.map(doc => ({
            selecteduser: doc.data(),
          })),
        );
      });
      return () => {
        unSubscribe();
      };
    })
  }, []);

  return (
    <>
      {
        userflag === "admin" ?
          <>
            <View style={tw`flex-1 items-center bg-white justify-around`}>
              <Menuchatbar navigation={navigation} />
              <LinearGradient colors={['#00B1E7', '#00B1E7']} style={tw` flex flex-row items-center justify-around self-center h-30 w-85 rounded-xl`} >


                {/* // balance dev */}
                <View style={tw`w-50 left-3`} >
                  <Text
                    numberOfLines={2}
                    style={tw`text-xl font-bold  text-gray-100`}>
                    {`Find Your Desire`}

                  </Text>
                  <Text
                    numberOfLines={4}
                    style={tw`text-xl font-bold  text-gray-100`}>
                    {`Health Solution \nIn E-Doctor`}
                  </Text>
                </View>


                {/* graph  */}
                <View style={tw` h-30 w-30  justify-center self-center items-center `}>
                  <Image
                    style={tw`h-29 w-30 rounded-2xl `}
                    resizeMode='contain'
                    source={require("../../Images/help.png")}
                  />
                </View>


              </LinearGradient>

              <View style={tw` h-40 w-50 border-black items-center self-center `}>

                <LottieView
                  style={tw`self-center  w-50 h-40`}
                  source={require('../../Images/Animation - 1724165264031.json')}
                  autoPlay
                  loop={true}
                  speed={0.9}
                />
              </View>

              <LinearGradient colors={['#00B1E7', '#00B1E7']} style={tw` flex flex-row items-center justify-around self-center h-35 w-85 rounded-xl`} >


                {/* // balance dev */}
                <View style={tw`w-50 left-3`} >
                  <Text
                    numberOfLines={2}
                    style={tw`text-xl font-bold  text-gray-100`}>
                    {`You Have Total Hospitals`}

                  </Text>
                  <Text
                    numberOfLines={4}
                    style={tw`text-3xl font-bold  text-gray-100`}>
                    {GetData.length}
                  </Text>
                </View>


                {/* graph  */}
                <View style={tw` h-30 w-30  justify-center self-center items-center `}>
                  <Image
                    style={tw`h-29 w-30 rounded-2xl `}
                    resizeMode='contain'
                    source={require("../../Images/hospital.png")}
                  />
                </View>


              </LinearGradient>

            </View>
          </>
          :
          userflag === "subadmin" || userflag === "user" ?
            <View style={[tw`flex-1`, { backgroundColor: '#FFFFFF' }]}>
              <ScrollView  showsVerticalScrollIndicator={false}>
                <Menuchatbar navigation={navigation} />
                <Showbalance />


                <Cbids navigation={navigation} />
              </ScrollView>
            </View>
            :
            userflag === "doctor" ?
              <></>
              :
              <></>
      }

    </>
  );
};

export default Home;
