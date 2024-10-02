import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import tw from 'twrnc';
import Screensheader from '../../Screens/Universal/Screensheader';
import {ScrollView} from 'react-native';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import {db} from '../../Firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppContext} from '../../AppContext';

const Viewaccounts = ({navigation ,route}) => {
  // const {vendoracc} = route.params
  const [isModalVisible, setModalVisible] = useState(false);
  const {vendoremail,setbankacc,setbanktitle,setbankname} = useContext(AppContext);
  const [email, setemail] = React.useState('');
  const [Getdata, setGetdata] = React.useState([]);
  const [userflag, setuserflag] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('role').then(role => {
      setuserflag(role);
    });
  }, []);

 

  useEffect(() => {
    console.log('chala');
    AsyncStorage.getItem('email').then(email => {
      console.log('chala email :', email);
      setemail(email);
      // const user = auth.currentUser;
      const coll = collection(db, 'Accounts');
      // const q = query(coll, where('email', '==', vendoracc));

      const unSubscribe = onSnapshot(coll, snapshot => {
        setGetdata(
          snapshot.docs.map(doc => ({
            selecteduser: doc.data(),
          })),
        );
      });

      return () => {
        unSubscribe();
      };
    });
  }, []);

  return (
    <View style={[tw`flex-1`, {backgroundColor: '#ffffff'}]}>
      <Screensheader
        name={'SELECT ACCOUNT'}
        left={10}
        onPress={() => {
          navigation.goBack();
        }}
      />

     
      <ScrollView>
        {Getdata.map((data, index) => (
          <TouchableOpacity 
          onPress={()=>{
             setbankacc(data.selecteduser.accountnum)
             setbankname(data.selecteduser.bankname)
             setbanktitle(data.selecteduser.accountname)
             navigation.goBack()

          }}
          >
            <View
              style={[
                tw` h-40 mb-5 rounded-2xl w-80 flex-row justify-${
                  userflag === 'user' ? 'center' : 'between'
                } self-center`,
                {backgroundColor: '#ffffff'},
              ]}>
              <View
                style={tw`border justify-center border-blue-500 h-40 w-65 rounded-2xl`}>
                <Text style={tw`ml-3 text-lg font-semibold`}>
                  Account Title:
                </Text>
                <Text numberOfLines={1} style={tw`ml-3 text-base font-light`}>
                  {data.selecteduser.accountname}
                </Text>

                <Text style={tw`ml-3 text-lg font-semibold`}>Bank Name:</Text>
                <Text numberOfLines={1} style={tw`ml-3 text-base font-light`}>
                  {data.selecteduser.bankname}
                </Text>

                <Text style={tw`ml-3 text-lg font-semibold`}>Account No:</Text>
                <Text numberOfLines={1} style={tw`ml-3 text-base font-light`}>
                  {data.selecteduser.accountnum}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default Viewaccounts;
