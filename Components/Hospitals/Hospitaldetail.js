import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {collection, onSnapshot, query, where} from 'firebase/firestore';
import {db} from '../../Firebase';

const Hospitaldetail = ({navigation, route}) => {
  const {phone, name, email} = route.params;
  const [GetData, setGetData] = useState([]);
  const [GetData1, setGetData1] = useState([]);

  useEffect(() => {
    const coll = collection(db, 'Profile');
    const q = query(
      coll,
      where('phone', '==', phone),
      where('email', '==', email),
      where('fullname', '==', name),
      where('role', '==', 'subadmin'),
    );

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
  }, []);

  useEffect(() => {
    const coll = collection(db, 'Profile');
    const q = query(
      coll,
      where('ownemail', '==', email),
      where('role', '==', 'doctor'),
    );

    const unSubscribe = onSnapshot(q, snapshot => {
      setGetData1(
        snapshot.docs.map(doc => ({
          selecteduser: doc.data(),
        })),
      );
    });
    return () => {
      unSubscribe();
    };

    // })
  }, []);

  return (
    <View style={tw`flex-1 items-center`}>
      {GetData.map(data => (
        <>
          <View style={tw`w-full `}>
            <Image
              source={{uri: data.selecteduser.profilephoto}}
              style={tw`w-full h-60`}
              resizeMode="cover"
            />
          </View>
          <ScrollView>
            <View style={tw`w-90 h-40 mt-5 bg-white`}>
              <Text style={[tw`font-bold text-xl ml-3 `, {color: '#00B1E7'}]}>
                {data.selecteduser.fullname.toUpperCase()}DETAIL
              </Text>
              <View
                style={tw`flex-row w-80 ml-3 h-10 items-center justify-between `}>
                <Image
                  source={require('../../Images/buildings.png')}
                  style={tw`h-5 w-5`}
                />

                <Text numberOfLines={1} style={tw`w-70 font-normal`}>
                  {data.selecteduser.cityl.toUpperCase()}
                </Text>
              </View>

              <View
                style={tw`flex-row ml-3 w-80 h-10 items-center justify-between `}>
                <Image
                  source={require('../../Images/smartphone.png')}
                  style={tw`h-5 w-5`}
                />
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(`tel:${data.selecteduser.phone}`)
                  }>
                  <Text
                    numberOfLines={1}
                    style={tw`w-70 font-normal underline`}>
                    {data.selecteduser.phone}
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={tw`flex-row ml-3 w-80 h-10 items-center justify-between `}>
                <Image
                  source={require('../../Images/location-pin.png')}
                  style={tw`h-5 w-5`}
                />

                <Text numberOfLines={2} style={tw`w-70 font-normal`}>
                  {data.selecteduser.address}
                </Text>
              </View>
            </View>

            <View style={tw`h-30  self-center  w-90 bg-white mt-5 `}>
              <Text
                style={[tw`text-center font-bold text-lg`, {color: '#00B1E7'}]}>
                Hospital Open Days
              </Text>
              <View
                style={tw` items-center h-10  w-70 self-center justify-between flex-row `}>
                <View
                  style={[
                    tw`h-7 w-15 rounded-3xl  border border-blue-300 items-center justify-center`,
                    {
                      backgroundColor:
                        data.selecteduser.monday === true
                          ? '#00B1E7'
                          : 'lightgray',
                    },
                  ]}>
                  <Text style={tw`text-xs text-black`}>Monday</Text>
                </View>
                <View
                  style={[
                    tw`h-7 w-15 rounded-3xl items-center border border-blue-300 justify-center`,
                    {
                      backgroundColor:
                        data.selecteduser.tuesday === true
                          ? '#00B1E7'
                          : 'lightgray',
                    },
                  ]}>
                  <Text style={tw`text-xs text-black`}>Tuesday</Text>
                </View>
                <View
                  style={[
                    tw`h-7 w-20 rounded-3xl items-center border border-blue-300 justify-center`,
                    {
                      backgroundColor:
                        data.selecteduser.wednesday === true
                          ? '#00B1E7'
                          : 'lightgray',
                    },
                  ]}>
                  <Text style={tw`text-xs text-black`}>Wednesday</Text>
                </View>

                <View
                  style={[
                    tw`h-7 w-15 rounded-3xl  border border-blue-300 items-center justify-center`,
                    {
                      backgroundColor:
                        data.selecteduser.thursday === true
                          ? '#00B1E7'
                          : 'lightgray',
                    },
                  ]}>
                  <Text style={tw`text-xs text-black`}>Thursday</Text>
                </View>
              </View>

              <View
                style={tw` items-center h-10  w-50 self-center justify-between flex-row `}>
                <View
                  style={[
                    tw`h-7 w-15 rounded-3xl items-center border border-blue-300 justify-center`,
                    {
                      backgroundColor:
                        data.selecteduser.friday === true
                          ? '#00B1E7'
                          : 'lightgray',
                    },
                  ]}>
                  <Text style={tw`text-xs text-black`}>Friday</Text>
                </View>
                <View
                  style={[
                    tw`h-7 w-15 rounded-3xl items-center border border-blue-300 justify-center`,
                    {
                      backgroundColor:
                        data.selecteduser.saturday === true
                          ? '#00B1E7'
                          : 'lightgray',
                    },
                  ]}>
                  <Text style={tw`text-xs text-black`}>Saturday</Text>
                </View>
                <View
                  style={[
                    tw`h-7 w-15 rounded-3xl  border border-blue-300 items-center justify-center`,
                    {
                      backgroundColor:
                        data.selecteduser.sunday === true
                          ? '#00B1E7'
                          : 'lightgray',
                    },
                  ]}>
                  <Text style={tw`text-xs text-black`}>Sunday</Text>
                </View>
              </View>
            </View>

            <View style={tw`h-70 w-90 justify-center bg-white mt-5 rounded-md`}>
              <View
                style={tw` h-7 w-80  self-center flex-row justify-between items-center`}>
                <Text style={[tw`text-base font-bold`, {color: '#00B1E7'}]}>
                  TOP DOCTORS
                </Text>
              </View>
              <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal={true}>
                {GetData1.length ? (
                  GetData1.map((data, index) => (
                    <View>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('Showappoinments', {
                            phone: data.selecteduser.phone,
                            slots: data.selecteduser.slots,
                            usercontrol: true,
                            usercontrol1: false,
                            idd: data.selecteduser.userid,
                          });
                        }}>
                        <View
                          key={index}
                          style={tw`border ml-3 mr-3 border-gray-300 h-50 w-45 self-center items-center justify-center mt-5 rounded-md`}>
                          <Image
                            style={tw`border h-25 w-25 rounded-full`}
                            source={{uri: data.selecteduser.profilephoto}}
                          />
                          <Text style={tw`text-base font-bold`}>
                            {data.selecteduser.fullname}
                          </Text>
                          <Text style={tw`text-base font-light`}>
                            {data.selecteduser.doctortypelabel}
                          </Text>
                          <Text style={tw`text-base font-light`}>
                            {data.selecteduser.doctortimefromlabel} To{' '}
                            {data.selecteduser.doctortimetolabel}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  ))
                ) : (
                  <View
                    style={tw`self-center justify-center items-center w-90`}>
                    <Text style={tw`text-center text-lg font-bold`}>
                      NO DOCTORS RIGHT NOW
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>
          </ScrollView>
        </>
      ))}
    </View>
  );
};

export default Hospitaldetail;
