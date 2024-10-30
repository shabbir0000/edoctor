import {
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import tw from 'twrnc';
import LinearGradient from 'react-native-linear-gradient';
import {useIsFocused} from '@react-navigation/native';
import {getAuth} from 'firebase/auth';
import {collection, limit, onSnapshot, query, where} from 'firebase/firestore';
import {app, db} from '../../Firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';

const Categories = ({navigation}) => {
  const [GetData, setGetdata] = useState([]);
  const [GetData1, setGetdata1] = useState([]);
  const [GetData2, setGetData2] = useState([]);
  const [GetData3, setGetData3] = useState([]);
  const [GetData4, setGetData4] = useState([]);
  const [userflag, setuserflag] = useState('');
  const [catl, setcatl] = useState('');
  const date = new Date().toDateString();

  useEffect(() => {
    AsyncStorage.getItem('email').then(email => {
      const coll = collection(db, 'Orders');
      const q = query(
        coll,
        where('email', '==', email),
        where('ordertype', '==', 'food'),
      );

      const unSubscribe = onSnapshot(q, snapshot => {
        setGetData2(
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

  useEffect(() => {
    AsyncStorage.getItem('email').then(email => {
      AsyncStorage.getItem('city').then(city => {
        const coll = collection(db, 'Orders');
        const q = query(
          coll,
          where('customeremail', '==', email),
          where('ordertype', '==', 'grocery'),
        );

        const unSubscribe = onSnapshot(q, snapshot => {
          setGetData3(
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

  useEffect(() => {
    AsyncStorage.getItem('email').then(email => {
      const coll = collection(db, 'Orders');
      const q = query(coll, where('customeremail', '==', email));

      const unSubscribe = onSnapshot(q, snapshot => {
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

  useEffect(() => {
    AsyncStorage.getItem('email').then(email => {
      const coll = collection(db, 'Orders');
      const q = query(
        coll,
        where('customeremail', '==', email),
        where('ordertype', '==', 'medical'),
      );

      const unSubscribe = onSnapshot(q, snapshot => {
        setGetData4(
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

  // const auth = getAuth(app);

  useEffect(() => {
    AsyncStorage.getItem('email').then(email => {
      const coll = collection(db, 'Orders');
      const q = query(
        coll,
        where('customeremail', '==', email),
        where('ordertype', '==', 'techworker'),
      );

      const unSubscribe = onSnapshot(q, snapshot => {
        setGetdata1(
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
    <View style={tw`flex-1   items-center  bg-white `}>
      <View style={tw`flex-1 bg-white justify-around`}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Companysymptoms', {
              cat: 'food',
            });
          }}>
          <View
            style={tw` flex  border border-blue-500 flex-row items-center justify-around self-center h-40 w-80 rounded-xl`}>
            {/* // balance dev */}

            <View>
              <Text style={tw`text-xl font-medium text-gray-400 `}>
                {'Manage Your'}
              </Text>
              <Text style={tw`text-xl font-medium text-gray-400  `}>
                {`Total symptoms \n List`}
              </Text>
            </View>

            {/* graph  */}
            <View
              style={tw` h-20 w-40 left-5 justify-center self-center items-center rounded-md`}>
              <Image
                resizeMode="contain"
                style={tw`h-19 w-39 rounded-lg `}
                source={require('../../Images/classification.png')}
              />
            </View>
          </View>
        </TouchableOpacity>

        <View style={tw`flex-row  w-80 h-50 items-center justify-between`}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Companycities', {
                cat: 'food',
              });
            }}>
            <View
              style={tw` flex  border border-blue-500 flex-col items-center justify-around self-center h-50 w-38 rounded-xl`}>
              <View
                style={tw` h-20 w-40 justify-start self-start items-start left-5 rounded-md`}>
                <Image
                  resizeMode="contain"
                  style={tw`h-19 w-19 rounded-lg `}
                  source={require('../../Images/cityscape.png')}
                />
              </View>

              {/* // balance dev */}
              <View style={tw` w-30`}>
                <Text style={tw`text-xl font-medium text-gray-400 `}>
                  {'Manage Your Total'}
                </Text>
                <Text style={tw`text-base font-medium text-gray-400  `}>
                  {'Cities List'}
                </Text>
              </View>

              {/* graph  */}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Companydoctors', {
                cat: 'grocery',
              });
            }}>
            <View
              style={tw` flex  border border-blue-500 flex-col items-center justify-around self-center h-50 w-38 rounded-xl`}>
              <View
                style={tw` h-20 w-40 justify-start self-start items-start left-5 rounded-md`}>
                <Image
                  resizeMode="contain"
                  style={tw`h-19 w-19 rounded-lg `}
                  source={require('../../Images/doctorsp.png')}
                />
              </View>

              {/* // balance dev */}
              <View style={tw` w-30`}>
                <Text style={tw`text-xl font-medium text-gray-400 `}>
                  {'Manage Your Total'}
                </Text>
                <Text style={tw`text-base font-medium text-gray-400  `}>
                  {'specialist List'}
                </Text>
              </View>

              {/* graph  */}
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Companypromotion', {
              cat: 'food',
            });
          }}>
          <View
            style={tw` flex  border border-blue-500 flex-row items-center justify-around self-center h-40 w-80 rounded-xl`}>
            {/* // balance dev */}

            <View>
              <Text style={tw`text-xl font-medium text-gray-400 `}>
                {'Manage Your'}
              </Text>
              <Text style={tw`text-xl font-medium text-gray-400  `}>
                {`All Promotion \n List`}
              </Text>
            </View>

            {/* graph  */}
            <View
              style={tw` h-20 w-40 left-5 justify-center self-center items-center rounded-md`}>
              <Image
                resizeMode="contain"
                style={tw`h-19 w-39 rounded-lg `}
                source={require('../../Images/promotion.png')}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Categories;
