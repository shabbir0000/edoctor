import {View, Text, Image, TouchableOpacity} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import tw from 'twrnc';
import Ionicon from 'react-native-vector-icons/FontAwesome5';
import {getAuth} from 'firebase/auth';
import {app, db} from '../../Firebase';
import {collection, onSnapshot, query, where} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {Dropdown} from 'react-native-element-dropdown';
import { AppContext } from '../../AppContext';
// import Highfy from "../../Images/Highfy.svg";

const Menuchatbar = ({navigation}) => {
  const auth = getAuth(app);
  const [GetData, setGetData] = useState([]);
  const [role, setrole] = useState('');
  const [value3, setValue3] = useState(null);
  const [label3, setlabel3] = useState(null);
  const [isFocus3, setIsFocus3] = useState(false);
  const [GetData3, setGetData3] = useState([]);
  const {setcity} =
  useContext(AppContext);

  useEffect(() => {
    const coll = collection(db, 'Cities');

    const unSubscribe = onSnapshot(coll, snapshot => {
      setGetData3(
        snapshot.docs.map(doc => ({
          label: doc.data().company.toUpperCase(), // Set company name as label
          value: doc.data().userid, // Set user ID as value
        })),
      );
    });

    return () => {
      unSubscribe();
    };
  }, []);


  useEffect(() => {
    AsyncStorage.getItem('role').then(role => {
      setrole(role);
      AsyncStorage.getItem('email').then(email => {
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
      });
    });
  }, []);

  return (
    <View
      style={[
        tw`top-5 flex w-80  self-center justify-between flex-row `,
        {backgroundColor: '#FFFFFF'},
      ]}>
      <View style={tw`w-65 flex flex-row `}>
        <Text numberOfLines={1} style={tw`text-lg  font-medium text-gray-600`}>
          Welcome {GetData[0]?.selecteduser.fullname}{' '}
        </Text>
        {/* <Highfy width={20}  height={20}/> */}
      </View>

      <View style={tw` w-15 flex-row justify-end items-end flex `}>
        {role === 'user' ? (
          <>
           <Dropdown
              style={[
                tw`h-8 w-30 `,
               
              ]}
              placeholderStyle={tw`ml-3 text-gray-400 text-xs `}
              selectedTextStyle={tw`ml-3 text-gray-400  `}
              containerStyle={tw`h-80 w-80   mt-7  rounded-md`}
              data={GetData3}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={'Change City'}
              mode="modal"
              value={value3}
              search // This enables the search option
              searchPlaceholder="Search Doctor City" // Placeholder for the search input
              onFocus={() => setIsFocus3(true)}
              onBlur={() => setIsFocus3(false)}
              onChange={item => {
                console.log('time', item.label);
                setlabel3(item.label);
                setValue3(item.value);
                setcity(item.label.toLowerCase())
                setIsFocus3(false);
                AsyncStorage.setItem("city",item.label.toLowerCase())
              }}
            />
          </>
        ) : (
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
                navigation.navigate('Profile');
                console.log('press');
              }}
            />
            {/* <Chat width={30} height={30}/> */}
          </TouchableOpacity>
        )}
      </View>
      <Toast />
    </View>
  );
};

export default Menuchatbar;
