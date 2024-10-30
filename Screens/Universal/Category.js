import {
  View,
  Text,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import tw from 'twrnc';
import {Dropdown} from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import {db} from '../../Firebase';
import Screensheader from '../Universal/Screensheader';
import Share from 'react-native-share';
import { useFocusEffect } from '@react-navigation/native';

const Category = ({navigation}) => {
  const [userflag, setuserflag] = useState('');
  const [GetData, setGetData] = useState([]);
  const [GetData1, setGetData1] = useState([]);
  const [loading1, setloading1] = useState(false);
  const [loading2, setloading2] = useState(false);
  const datee = new Date();
  const showdate =
    datee.getFullYear() + '/' + (datee.getMonth() + 1) + '/' + datee.getDate();
  const [cat, setcat] = useState('Today Active');
  const [catid, setcatid] = useState('Today Active');

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem('role').then(role => {
        console.log("role btao ",role);
        
        setuserflag(role);
        if (role === 'admin' || role === 'user') {
          getsubadmin();
        } else {
          setGetData1([]);
          getemergency();
        }
      });
    }, [])
  );

  const shareUserCredentials = (name, email, password, role) => {
    const message = `Hello ${name},\nyour email is\n${email}\nand your password is\n${password}.\nand your Role is\n${role}`;

    const options = {
      title: 'Share User Credentials',
      message: message,
    };

    Share.open(options)
      .then(res => console.log(res))
      .catch(err => {
        if (err) console.log(err);
      });
  };

  const getsubadmin = async () => {
    AsyncStorage.getItem('city').then(city => {
      AsyncStorage.getItem('role').then(role => {
        console.log('user kya ha cat', role);

        const coll = collection(db, 'Profile');
        const q = query(coll, where('role', '==', 'subadmin'));
        const q1 = query(coll, where('role', '==', 'subadmin'),where('cityl', '==',city));

        const unSubscribe = onSnapshot(role === "admin" ? q : q1 , snapshot => {
          setGetData(
            snapshot.docs.map(doc => ({
              selecteduser: doc.data(),
            })),
          );
        });
      });
      return () => {
        unSubscribe();
      };
    });
  };

  const getemergency = async () => {
    AsyncStorage.getItem('email').then(email => {
      AsyncStorage.getItem('role').then(role => {
        console.log('user kya ha cat', userflag);

        const coll = collection(db, 'Emergency');
        const q = query(
          coll,
          where('doctoremail', '==', email),
          where('todaydate', '==', showdate),
          where('status', '==', 'pending'),
        );

        const unSubscribe = onSnapshot(q, snapshot => {
          setGetData1(
            snapshot.docs.map(doc => ({
              selecteduser: doc.data(),
            })),
          );
        });
      });
      return () => {
        unSubscribe();
      };
    });
  };

  const getacceptemergency = async () => {
    AsyncStorage.getItem('email').then(email => {
      AsyncStorage.getItem('role').then(role => {
        console.log('user kya ha cat', userflag);

        const coll = collection(db, 'Emergency');
        const q = query(
          coll,
          where('doctoremail', '==', email),
          where('todaydate', '==', showdate),
          where('status', '==', 'accept'),
        );

        const unSubscribe = onSnapshot(q, snapshot => {
          setGetData1(
            snapshot.docs.map(doc => ({
              selecteduser: doc.data(),
            })),
          );
        });
      });
      return () => {
        unSubscribe();
      };
    });
  };

  const getrejectemergency = async () => {
    AsyncStorage.getItem('email').then(email => {
      AsyncStorage.getItem('role').then(role => {
        console.log('user kya ha cat', userflag);

        const coll = collection(db, 'Emergency');
        const q = query(
          coll,
          where('doctoremail', '==', email),
          where('todaydate', '==', showdate),
          where('status', '==', 'reject'),
        );

        const unSubscribe = onSnapshot(q, snapshot => {
          setGetData1(
            snapshot.docs.map(doc => ({
              selecteduser: doc.data(),
            })),
          );
        });
      });
      return () => {
        unSubscribe();
      };
    });
  };

  const updateemergencydoc = async (status, docid) => {
    // const slots =  calculateSessionSlots(label,label1,45)
    setloading1(true);
    updateDoc(doc(db, 'Emergency', docid), {
      status: status,
    })
      .then(() => {
        console.log('done');
        getemergency();
        Alert.alert('Confirm', `Alert Has Been Send TO ${status} Mode`, [
          {text: 'OK'},
        ]);

        setloading1(false);
      })
      .catch(error => {
        setloading1(false);
        Alert.alert('this :', error.message);
      });
  };

  const updateemergencydoc1 = async (status, docid) => {
    // const slots =  calculateSessionSlots(label,label1,45)
    setloading2(true);
    updateDoc(doc(db, 'Emergency', docid), {
      status: status,
    })
      .then(() => {
        console.log('done');
        getemergency();
        Alert.alert('Confirm', `Alert Has Been Send TO ${status} Mode`, [
          {text: 'OK'},
        ]);
        setloading2(false);
      })
      .catch(error => {
        setloading2(false);
        Alert.alert('this :', error.message);
      });
  };

  const updatedoc = async (docid, status) => {
    // const slots =  calculateSessionSlots(label,label1,45)
    updateDoc(doc(db, 'Profile', docid), {
      profilestatus: status,
    })
      .then(() => {
        console.log('done');
        // setloading(false);
        Alert.alert('Congratulation', `User Has Been Send TO ${status} Mode`, [
          {text: 'OK'},
        ]);
      })
      .catch(error => {
        // setloading(false);
        Alert.alert('this :', error.message);
      });
  };

  const vrImages = [
    {
      url: 'https://vection-cms-prod.s3.eu-central-1.amazonaws.com/Adobe_Stock_506941973_cc825880a8.jpeg',
      text: 'Today Active',
    },
    {
      url: 'https://images.inc.com/uploaded_files/image/1920x1080/getty_921019710_413686.jpg',
      text: 'Today Accept',
    },
    {
      url: 'https://images.inc.com/uploaded_files/image/1920x1080/getty_921019710_413686.jpg',
      text: 'Today Reject',
    },
  ];

  return (
    <View style={[tw`flex-1 bg-white `]}>
      {userflag === 'admin' ? (
        <>
          <View style={tw`flex-1`}>
            <Screensheader
              name={'MANAGE HOSPITALS'}
              left={10}
              onPress={() => navigation.goBack()}
            />
            {userflag === 'admin' && (
              <View
                style={tw`w-70 h-12   flex-row  self-center justify-${
                  userflag === 'admin' ? 'center' : 'between'
                }  items-center`}>
                {/* <ScrollView horizontal showsHorizontalScrollIndicator={false}> */}
                {/* card 1 */}

                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Addupdatesubadmin', {
                      doctorname: '',
                      doctorphone: '',
                      doctorcity: '',
                      doctorcityl:'',
                      doctoraddress: '',
                      doctoremail: '',
                      doctorpassword: '',
                      mondayy: false,
                      tuesdayy: false,
                      wednesdayy: false,
                      thursdayy: false,
                      fridayy: false,
                      saturdayy: false,
                      sundayy: false,
                      docid: '',
                      profile:
                        'https://firebasestorage.googleapis.com/v0/b/supplysync-3e4b1.appspot.com/o/allfiles%2Fimages.jpg?alt=media&token=0aa9155e-5ebd-4b22-8f77-c9d70d280507',
                      profilestatus: '',
                    });
                  }}>
                  <Image
                    source={require('../../Images/plusr.png')}
                    style={tw`w-8 h-8`}
                  />
                </TouchableOpacity>

                {/* </ScrollView> */}
              </View>
            )}

            <ScrollView style={tw`mb-5`} showsVerticalScrollIndicator={false}>
              {GetData.map((data, index) => (
                <>
                  <TouchableOpacity
                  // key={index}
                  >
                    <View
                      style={[
                        tw`border flex-col justify-between   w-80 h-80  self-center mt-5`,
                        {borderColor: '#00B1E7'},
                      ]}>
                      <View style={tw`h-40 items-center self-center w-80`}>
                        <Image
                          style={tw`h-40 w-79 `}
                          resizeMode="cover"
                          // source={{ uri: data.selecteduser.profile }}
                          source={{uri: data.selecteduser.profilephoto}}
                        />
                      </View>
                      <View style={tw`h-40 justify-center w-35 `}>
                        <Text
                          numberOfLines={1}
                          style={tw`font-bold ml-2 w-75 text-xl`}>
                          {data.selecteduser.fullname.toUpperCase()}
                        </Text>
                        <Text
                          numberOfLines={1}
                          style={tw`font-light ml-2 mt-1 w-40 text-gray-400 text-sm`}>
                          {data.selecteduser.cityl.toUpperCase()}
                        </Text>
                        <Text
                          numberOfLines={1}
                          style={tw`font-light ml-2 mt-1 w-40  text-base`}>
                          {data.selecteduser.profilestatus.toUpperCase()}
                        </Text>

                        <View
                          style={tw` items-center h-10 w-80 justify-around flex-row mt-2`}>
                          <TouchableOpacity
                            onPress={() =>
                              Linking.openURL(
                                `whatsapp://send?text=Hello\nI Have Query&phone=${data.selecteduser.phone}`,
                              )
                            }>
                            <Image
                              style={tw`h-6 w-6`}
                              resizeMode="cover"
                              source={require('../../Images/whatsapp.png')}
                            />
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => {
                              navigation.navigate('Addupdatesubadmin', {
                                doctorname: data.selecteduser.fullname,
                                doctorcity: data.selecteduser.city,
                                doctorcityl :  data.selecteduser.cityl,
                                doctoraddress: data.selecteduser.address,
                                doctorphone: data.selecteduser.phone,
                                doctoremail: data.selecteduser.email,
                                doctorpassword: data.selecteduser.password,
                                mondayy: data.selecteduser.monday,
                                tuesdayy: data.selecteduser.tuesday,
                                wednesdayy: data.selecteduser.wednesday,
                                thursdayy: data.selecteduser.thursday,
                                fridayy: data.selecteduser.friday,
                                saturdayy: data.selecteduser.saturday,
                                sundayy: data.selecteduser.sunday,
                                docid: data.selecteduser.userid,
                                profile: data.selecteduser.profilephoto,
                                profilestatus: data.selecteduser.profilestatus,
                              });
                            }}>
                            <Image
                              style={tw`h-6 w-6`}
                              resizeMode="cover"
                              source={require('../../Images/edit.png')}
                            />
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => {
                              Alert.alert(
                                'Alert',
                                `You Want TO Send This On ${
                                  data.selecteduser.profilestatus === 'pending'
                                    ? 'active'
                                    : 'pending'
                                } Mode?`,
                                [
                                  {
                                    text: 'No',
                                    onPress: () =>
                                      console.log('Cancel Pressed'),
                                    style: 'cancel',
                                  },
                                  {
                                    text: 'YES',
                                    onPress: () =>
                                      updatedoc(
                                        data.selecteduser.userid,
                                        data.selecteduser.profilestatus ===
                                          'pending'
                                          ? 'active'
                                          : 'pending',
                                      ),
                                  },
                                ],
                              );
                            }}>
                            <Image
                              style={tw`h-6 w-6`}
                              resizeMode="cover"
                              source={require('../../Images/status-quo.png')}
                            />
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => {
                              shareUserCredentials(
                                data.selecteduser.fullname,
                                data.selecteduser.email,
                                data.selecteduser.password,
                                data.selecteduser.role,
                              );
                            }}>
                            <Image
                              style={tw`h-6 w-6`}
                              resizeMode="cover"
                              source={require('../../Images/send.png')}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </>
              ))}
            </ScrollView>
          </View>
        </>
      ) : userflag === 'doctor' ? (
        <>
          <View style={tw`flex-1`}>
            <Screensheader
              name={'Active Emergency'}
              left={10}
              onPress={() => navigation.goBack()}
            />

            <View style={tw`w-85 h-12   flex-row  self-center  items-center`}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {/* card 1 */}

                <>
                  {vrImages?.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        // setloading(true)
                        // getcatvideo(item.id)

                        if (item.text === 'Today Active') {
                          setcat(item.text);
                          getemergency();
                        } else if (item.text === 'Today Accept') {
                          setcat(item.text);
                          getacceptemergency();
                        } else if (item.text === 'Today Reject') {
                          setcat(item.text);
                          getrejectemergency();
                        }
                      }}>
                      <View
                        style={[
                          tw`bg-${
                            cat === item.text ? 'blue-400' : 'white'
                          } h-10 w-30 ml-5 border flex-row items-center justify-evenly rounded-3xl`,
                          {borderRadius: 50, borderColor: '#00B1E7'},
                        ]}>
                        {/* <Image style={tw`h-5 w-5 rounded-full`} source={{ uri: item.url }} /> */}
                        <Text
                          numberOfLines={1}
                          style={tw`text-center text-${
                            cat === item.text ? 'white' : 'black'
                          } w-25`}>
                          {item.text}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </>
              </ScrollView>
            </View>
            <ScrollView style={tw`mb-5`} showsVerticalScrollIndicator={false}>
              {GetData1.map((data, index) => (
                <>
                  <TouchableOpacity
                  // key={index}
                  >
                    <View
                      style={[
                        tw`border flex-col justify-around   w-80 h-${
                          data.selecteduser.status === 'pending' ? '70' : '40'
                        }  self-center mt-5`,
                        {borderColor: 'red'},
                      ]}>
                      <View style={tw`h-40  justify-evenly w-35 `}>
                        <Text
                          numberOfLines={1}
                          style={tw`font-bold ml-2 w-75 underline text-red-500 text-2xl`}>
                          EMERGENCY
                        </Text>

                        <View
                          style={tw`flex-row ml-5 items-center justify-between w-70`}>
                          <Image
                            source={require('../../Images/user.png')}
                            style={tw`w-5 h-5`}
                          />
                          <Text
                            numberOfLines={1}
                            style={tw`font-light ml-2 w-75 text-xl`}>
                            {data.selecteduser.username.toUpperCase()}
                          </Text>
                        </View>

                        <View
                          style={tw`flex-row ml-5 items-center justify-between w-70`}>
                          <Image
                            source={require('../../Images/smartphone.png')}
                            style={tw`w-5 h-5`}
                          />
                          <Text
                            numberOfLines={1}
                            style={tw`font-light ml-2 w-75 text-sm`}>
                            {data.selecteduser.phone}
                          </Text>
                        </View>

                        <View
                          style={tw`flex-row ml-5 items-center justify-between w-70`}>
                          <Image
                            source={require('../../Images/location-pin.png')}
                            style={tw`w-5 h-5`}
                          />
                          <Text
                            numberOfLines={1}
                            style={tw`font-light ml-2 mt-1 w-75  text-sm`}>
                            {data.selecteduser.city.toUpperCase()}
                          </Text>
                        </View>

                        <View
                          style={tw`flex-row ml-5 items-center justify-between w-70`}>
                          <Image
                            source={require('../../Images/updates.png')}
                            style={tw`w-5 h-5`}
                          />
                          <Text
                            numberOfLines={1}
                            style={tw`font-light ml-2 mt-1 w-75  text-base`}>
                            {data.selecteduser.status.toUpperCase()}
                          </Text>
                        </View>
                      </View>
                      {data.selecteduser.status === 'pending' ? (
                        <>
                          {loading1 && data.selecteduser.userid === setcatid ? (
                            <ActivityIndicator
                              size="large"
                              style={tw`mt-5`}
                              color="#00B1E7"
                            />
                          ) : (
                            <TouchableOpacity
                              onPress={() => {
                                setcatid(data.selecteduser.userid);
                                updateemergencydoc(
                                  'accept',
                                  data.selecteduser.userid,
                                );
                              }}>
                              <View
                                style={tw`self-center rounded-md bg-green-500 w-70 items-center justify-center h-10  `}>
                                <Text style={tw`text-white font-bold`}>
                                  {'ACCEPT'}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          )}

                          {loading2 && data.selecteduser.userid === setcatid ? (
                            <ActivityIndicator
                              size="large"
                              style={tw`mt-5`}
                              color="#00B1E7"
                            />
                          ) : (
                            <TouchableOpacity
                              onPress={() => {
                                setcatid(data.selecteduser.userid);
                                updateemergencydoc1(
                                  'reject',
                                  data.selecteduser.userid,
                                );
                              }}>
                              <View
                                style={tw`self-center rounded-md bg-red-500 w-70 items-center justify-center h-10  `}>
                                <Text style={tw`text-white font-bold`}>
                                  {'REJECT'}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          )}
                        </>
                      ) : (
                        <></>
                      )}
                    </View>
                  </TouchableOpacity>
                </>
              ))}
            </ScrollView>
          </View>
        </>
      ) : (
        <></>
      )}
    </View>
  );
};

export default Category;
