import {View, Text, Image, TouchableOpacity} from 'react-native';
import React,{useEffect,useState} from 'react';
import tw from 'twrnc';
import Ionicon from 'react-native-vector-icons/FontAwesome5';
import { getAuth } from 'firebase/auth';
import { app, db } from '../../Firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
// import Highfy from "../../Images/Highfy.svg";

const Menuchatbar = ({navigation}) => {

  const auth = getAuth(app);
  const [GetData, setGetData] = useState([]);

  useEffect(() => {

    AsyncStorage.getItem("email").then((email) => {
      const coll = collection(db, 'Profile');
      const q = query(coll, where('email', '==', email));

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
    <View style={[tw`top-5 flex w-80  self-center justify-between flex-row `, {backgroundColor: '#FFFFFF'}]}>
      <View style={tw`w-65 flex flex-row `}>
        <Text numberOfLines={1} style={tw`text-lg  font-medium text-gray-600`}>Welcome {GetData[0]?.selecteduser.fullname} </Text>
        {/* <Highfy width={20}  height={20}/> */}
      </View>

      <View style={tw` w-15 flex-row justify-end items-end flex `}>
      

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Inbox');
          }}>
          <Ionicon
            name="user"
            size={20}
            style={tw`left-0`}
            onPress={() => {
              // share()
              navigation.navigate("Profile")
              console.log('press');
            }}
          />
          {/* <Chat width={30} height={30}/> */}
        </TouchableOpacity>
      </View>
      <Toast/>
    </View>
  );
};

export default Menuchatbar;
