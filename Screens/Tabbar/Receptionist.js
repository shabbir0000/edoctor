import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import tw from 'twrnc';
import {showToast} from '../Universal/Input';
import Toast from 'react-native-toast-message';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Screensheader from '../Universal/Screensheader';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import {db} from '../../Firebase';
import Share from 'react-native-share';
// import LinearGradient from 'react-native-linear-gradient'

const Receptionist = ({navigation}) => {
  // const { catt } = route.params;

  const [name, setname] = useState('');
  const [device, setdevice] = useState([]);
  const [session, setsession] = useState('');
  const [price, setprice] = useState('');
  const [cat, setcat] = useState('');

  const [userflag, setuserflag] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('role').then(role => {
      setuserflag(role);
    });
  }, []);

  const [GetData, setGetData] = useState([]);
  const [GetData1, setGetData1] = useState([]);

  useEffect(() => {
    getalldata();
  }, []);

  const [allSlots, setAllSlots] = useState([]);

  const getdatabycat = async cat => {
    AsyncStorage.getItem('email').then(email => {
      AsyncStorage.getItem('city').then(city => {
        const coll = collection(db, 'Profile');
        const q = query(
          coll,
          where('city', '==', city),
          where('role', '==', 'doctor'),
          where('doctortypelabel', '==', cat),
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
      });
    });
  };

  const getalldata = async () => {
    AsyncStorage.getItem('city').then(city => {
      AsyncStorage.getItem('email').then(email => {
        const coll = collection(db, 'Profile');
        // const q = query(coll, where('doctortypelabel', '==', cat));
        const q = query(
          coll,
          where('cityl', '==', city),
          where('ownemail', '==', email),
          where('role', '==', 'receptionist'),
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
      });
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

  return (
    <>
      <View style={tw` bg-white flex-1`}>
        <Screensheader
          name={'SELECT RECEPTIONIST'}
          left={8}
          onPress={() => navigation.goBack()}
        />

        <View style={tw`w-85 h-12   justify-center  self-center  items-center`}>
          {/* <ScrollView horizontal showsHorizontalScrollIndicator={false}> */}
          {/* card 1 */}

          <>
            <TouchableOpacity
              // key={index}
              onPress={() => {
                // setloading(true)
                // getallvideo(token)
                // getalldata();
                // setcat('All Doc');
                navigation.navigate('Addrecep', {
                  doctorname: '',
                  doctortype: '',
                  doctorphone: '',
                  doctoremail: '',
                  doctorpassword: '',
                  doctorcity: '',
                  mondayy: false,
                  tuesdayy: false,
                  wednesdayy: false,
                  thursdayy: false,
                  fridayy: false,
                  saturdayy: false,
                  sundayy: false,
                  docid: '',
                  doctortimefrom: '',
                  doctortimeto: '',
                  labell: '',
                  labell1: '',
                  labell2: '',
                  profile:
                    'https://firebasestorage.googleapis.com/v0/b/supplysync-3e4b1.appspot.com/o/allfiles%2Fimages.jpg?alt=media&token=0aa9155e-5ebd-4b22-8f77-c9d70d280507',
                  profilestatus: '',
                });
              }}>
              <View
                style={[
                  tw` h-10 w-30 ml-5  flex-row items-center justify-evenly rounded-3xl`,
                ]}>
                <Image
                  style={tw`h-10 w-10`}
                  resizeMode="cover"
                  source={require('../../Images/plusr.png')}
                />
              </View>
            </TouchableOpacity>
          </>

          {/* </ScrollView> */}
        </View>

        <ScrollView
          style={tw`flex-1 mb-5 self-center `}
          showsVerticalScrollIndicator={false}>
          {GetData.map((data, index) => (
            <>
              <TouchableOpacity key={index} disabled={true}>
                <View
                  style={[
                    tw`border flex-row justify-around items-center w-80 h-45 rounded-md self-center mt-5`,
                    {borderColor: '#00B1E7'},
                  ]}>
                  <View style={tw`h-40  w-30`}>
                    <Image
                      style={tw`h-40 w-35`}
                      resizeMode="cover"
                      source={{uri: data.selecteduser.profilephoto}}
                    />
                  </View>
                  <View style={tw`h-40 justify-center w-35 `}>
                    <Text numberOfLines={1} style={tw`font-bold w-40 text-xl`}>
                      {data.selecteduser.fullname.toUpperCase()}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={tw`font-light mt-1 w-40 text-gray-400 text-sm`}>
                      {data.selecteduser.role.toUpperCase()}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={tw`font-light mt-1 w-40  text-base`}>
                      {data.selecteduser.profilestatus.toUpperCase()}
                    </Text>
                    <View
                      style={tw` items-center h-10 w-35 justify-between flex-row mt-2`}>
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
                          navigation.navigate('Addrecep', {
                            doctorname: data.selecteduser.fullname,
                            doctortype: data.selecteduser.doctortype,
                            doctorphone: data.selecteduser.phone,
                            doctoremail: data.selecteduser.email,
                            doctorpassword: data.selecteduser.password,
                            doctorcity: data.selecteduser.city,
                            mondayy: data.selecteduser.monday,
                            tuesdayy: data.selecteduser.tuesday,
                            wednesdayy: data.selecteduser.wednesday,
                            thursdayy: data.selecteduser.thursday,
                            fridayy: data.selecteduser.friday,
                            saturdayy: data.selecteduser.saturday,
                            sundayy: data.selecteduser.sunday,
                            docid: data.selecteduser.userid,
                            doctortimefrom: data.selecteduser.doctortimefrom,
                            doctortimeto: data.selecteduser.doctortimeto,
                            profile: data.selecteduser.profilephoto,
                            labell: data.selecteduser.doctortimefromlabel,
                            labell1: data.selecteduser.doctortimetolabel,
                            labell2: data.selecteduser.doctortypelabel,
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
                                onPress: () => console.log('Cancel Pressed'),
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

                    {/* <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('Showappoinments', {
                          phone: data.selecteduser.phone,
                          slots: data.selecteduser.slots,
                          usercontrol: true,
                        });
                      }}>
                      <Text
                        numberOfLines={1}
                        style={tw`font-light mt-1 w-40 text-black underline text-base`}>
                        Book Appointment
                      </Text>
                    </TouchableOpacity> */}
                  </View>
                </View>
              </TouchableOpacity>
            </>
          ))}
        </ScrollView>
      </View>
    </>
  );
};

export default Receptionist;
