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

const Yourplan = ({navigation, route}) => {
  const {catt} = route.params;

  const [name, setname] = useState('');
  const [device, setdevice] = useState([]);
  const [session, setsession] = useState('');
  const [price, setprice] = useState('');
  const [cat, setcat] = useState(catt);

  const [userflag, setuserflag] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('role').then(role => {
      setuserflag(role);
    });
  }, []);

  const [GetData, setGetData] = useState([]);
  const [GetData1, setGetData1] = useState([]);
  const [GetData2, setGetData2] = useState([]);

  useEffect(() => {
    console.log('check catt', catt);

    catt
      ? (getdatabycat(catt), setcat(catt))
      : (setcat(catt),
        AsyncStorage.getItem('email').then(email => {
          AsyncStorage.getItem('role').then(role => {
            AsyncStorage.getItem('city').then(city => {
              if (role === 'receptionist') {
                const fetchData = async () => {
                  const coll = collection(db, 'Profile');
                  // const q = query(coll, where('role', '==', label1), where('email', '==', email));
                  const q = query(coll, where('email', '==', email));
                  try {
                    const querySnapshot = await getDocs(q);

                    if (querySnapshot.size > 0) {
                      console.log('size : ', querySnapshot.size);
                      querySnapshot.forEach(async docs => {
                        const hospitalemail = docs.get('ownemail');
                        const coll = collection(db, 'Profile');
                        const q = query(
                          coll,
                          where('ownemail', '==', hospitalemail),
                          where('city', '==', city),
                          where('role', '==', 'doctor'),
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
                          setcat('');
                        };
                      });
                    } else {
                      setloading(false);
                      showToast(
                        'error',
                        'Error',
                        'Please Select Valid Role',
                        true,
                        3000,
                      );
                    }
                  } catch (error) {
                    setloading(false);
                    console.error('Error fetching data: ', error);
                  }
                };

                fetchData();
              } else {
                const coll = collection(db, 'Profile');
                const q = query(
                  coll,
                  where('ownemail', '==', email),
                  where('city', '==', city),
                  where('role', '==', 'doctor'),
                );
                const q1 = query(
                  coll,
                  where('city', '==', city),
                  where('role', '==', 'doctor'),
                );

                const unSubscribe = onSnapshot(
                  role === 'user' ? q1 : q,
                  snapshot => {
                    setGetData(
                      snapshot.docs.map(doc => ({
                        selecteduser: doc.data(),
                      })),
                    );
                  },
                );
                return () => {
                  unSubscribe();
                  setcat('');
                };
              }
            });
          });
        }));
  }, [route.params]);

  const [allSlots, setAllSlots] = useState([]);

  const getdatabycat = async cat => {
    AsyncStorage.getItem('email').then(email => {
      AsyncStorage.getItem('role').then(role => {
        AsyncStorage.getItem('city').then(city => {
          if (role === 'receptionist') {
            const fetchData = async () => {
              const coll = collection(db, 'Profile');
              // const q = query(coll, where('role', '==', label1), where('email', '==', email));
              const q = query(coll, where('email', '==', email));
              try {
                const querySnapshot = await getDocs(q);

                if (querySnapshot.size > 0) {
                  console.log('size : ', querySnapshot.size);
                  querySnapshot.forEach(async docs => {
                    const hospitalemail = docs.get('ownemail');
                    const coll = collection(db, 'Profile');
                    const q = query(
                      coll,
                      where('ownemail', '==', hospitalemail),
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
                      setcat('');
                    };
                  });
                } else {
                  setloading(false);
                  showToast(
                    'error',
                    'Error',
                    'Please Select Valid Role',
                    true,
                    3000,
                  );
                }
              } catch (error) {
                setloading(false);
                console.error('Error fetching data: ', error);
              }
            };

            fetchData();
          } else {
            const coll = collection(db, 'Profile');
            const q = query(
              coll,
              where('city', '==', city),
              where('role', '==', 'doctor'),
              where('doctortypelabel', '==', cat),
            );
            const q1 = query(
              coll,
              where('ownemail', '==', email),
              where('city', '==', city),
              where('role', '==', 'doctor'),
              where('doctortypelabel', '==', cat),
            );

            const unSubscribe = onSnapshot(
              role === 'user' ? q : q1,
              snapshot => {
                setGetData(
                  snapshot.docs.map(doc => ({
                    selecteduser: doc.data(),
                  })),
                );
              },
            );
            return () => {
              unSubscribe();
            };
          }
        });
      });
    });
  };

  const getalldata = async () => {
    AsyncStorage.getItem('city').then(city => {
      AsyncStorage.getItem('role').then(role => {
        AsyncStorage.getItem('email').then(email => {
          if (role === 'receptionist') {
            const fetchData = async () => {
              const coll = collection(db, 'Profile');
              // const q = query(coll, where('role', '==', label1), where('email', '==', email));
              const q = query(coll, where('email', '==', email));
              try {
                const querySnapshot = await getDocs(q);

                if (querySnapshot.size > 0) {
                  console.log('size : ', querySnapshot.size);
                  querySnapshot.forEach(async docs => {
                    const hospitalemail = docs.get('ownemail');
                    const coll = collection(db, 'Profile');
                    const q = query(
                      coll,
                      where('ownemail', '==', hospitalemail),
                      where('city', '==', city),
                      where('role', '==', 'doctor'),
                      // where('doctortypelabel', '==', cat),
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
                      setcat('');
                    };
                  });
                } else {
                  setloading(false);
                  showToast(
                    'error',
                    'Error',
                    'Please Select Valid Role',
                    true,
                    3000,
                  );
                }
              } catch (error) {
                setloading(false);
                console.error('Error fetching data: ', error);
              }
            };

            fetchData();
          } else {
            const coll = collection(db, 'Profile');
            // const q = query(coll, where('doctortypelabel', '==', cat));
            const q = query(
              coll,
              where('city', '==', city),
              where('role', '==', 'doctor'),
            );

            const q1 = query(
              coll,
              where('ownemail', '==', email),
              where('city', '==', city),
              where('role', '==', 'doctor'),
              // where('doctortypelabel', '==', cat),
            );

            const unSubscribe = onSnapshot(
              role === 'user' ? q : q1,
              snapshot => {
                setGetData(
                  snapshot.docs.map(doc => ({
                    selecteduser: doc.data(),
                  })),
                );
              },
            );
            return () => {
              unSubscribe();
            };
          }
        });
      });
    });
  };

  const vrImages = [
    {label: 'Cardiologist'},
    {label: 'Dermatologist'},
    {label: 'Neurologist'},
    {label: 'Orthopedic'},
    {label: 'Pediatrician'},
    {label: 'Psychiatrist'},
    {label: 'Radiologist'},
    {label: 'Urologist'},
    {label: 'Gynecologist'},
    {label: 'Ophthalmologist'},
    {label: 'Anesthesiologist'},
    {label: 'Oncologist'},
    {label: 'Pathologist'},
    {label: 'Rheumatologist'},
    {label: 'General Practitioner'},
  ];

  useEffect(() => {
    const coll = collection(db, 'Doctorssp');

    const unSubscribe = onSnapshot(coll, snapshot => {
      setGetData2(
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
      {userflag === 'user' ? (
        <View style={tw` bg-white flex-1`}>
          <Screensheader
            name={'SEARCH DOCTOR'}
            left={15}
            onPress={() => navigation.goBack()}
          />

          <View style={tw`w-85 h-12   flex-row  self-center  items-center`}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {/* card 1 */}

              <>
                <TouchableOpacity
                  // key={index}
                  onPress={() => {
                    // setloading(true)
                    // getallvideo(token)
                    getalldata();
                    setcat('All Doc');
                  }}>
                  <View
                    style={[
                      tw`bg-${
                        cat === 'All Doc' ? 'blue-400' : 'white'
                      } h-10 w-30 ml-5 border flex-row items-center justify-evenly rounded-3xl`,
                      {borderRadius: 50, borderColor: '#00B1E7'},
                    ]}>
                    <Text
                      numberOfLines={1}
                      style={tw`text-center text-${
                        cat === 'All Doc' ? 'white' : 'black'
                      } w-20`}>
                      {'All Doc'}
                    </Text>
                  </View>
                </TouchableOpacity>

                {GetData2?.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      // setloading(true)
                      // getcatvideo(item.id)
                      getdatabycat(item.label);
                      setcat(item.label);
                    }}>
                    <View
                      style={[
                        tw`bg-${
                          cat === item.label ? 'blue-400' : 'white'
                        } h-10 w-30 ml-5 border flex-row items-center justify-evenly rounded-3xl`,
                        {borderRadius: 50, borderColor: '#00B1E7'},
                      ]}>
                      {/* <Image style={tw`h-5 w-5 rounded-full`} source={{ uri: item.url }} /> */}
                      <Text
                        numberOfLines={1}
                        style={tw`text-center text-${
                          cat === item.label ? 'white' : 'black'
                        } w-20`}>
                        {item.label}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </>
            </ScrollView>
          </View>

          <ScrollView
            style={tw`flex-1 mb-5 self-center `}
            showsVerticalScrollIndicator={false}>
            {GetData.map((data, index) => (
              <>
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    navigation.navigate('Showappoinments', {
                      phone: data.selecteduser.phone,
                      slots: data.selecteduser.slots,
                      usercontrol: true,
                      // filledapp: allSlots
                    });
                  }}>
                  <View
                    style={[
                      tw`border flex-col justify-around items-center w-80 h-50 rounded-md self-center mt-5`,
                      {borderColor: '#00B1E7'},
                    ]}>
                    <View
                      style={tw`h-30  items-center flex-row justify-between w-75`}>
                      <Image
                        style={tw`h-25 w-25 rounded-full`}
                        resizeMode="cover"
                        source={{uri: data.selecteduser.profilephoto}}
                      />
                      <View>
                        <Text
                          numberOfLines={1}
                          style={tw`font-bold w-40 text-xl`}>
                          {data.selecteduser.fullname}
                        </Text>
                        <Text
                          numberOfLines={1}
                          style={tw`font-light mt-1 w-40 text-gray-400 text-sm`}>
                          {data.selecteduser.doctortypelabel}
                        </Text>
                        <Text
                          numberOfLines={1}
                          style={tw`font-light mt-1 w-40  text-sm`}>
                          {data.selecteduser.doctortimefromlabel} To{' '}
                          {data.selecteduser.doctortimetolabel}
                        </Text>
                      </View>
                    </View>
                    <View style={tw`h-20  w-70 `}>
                      <View
                        style={tw` items-center h-10  w-70 self-center justify-between flex-row `}>
                        <View
                          style={[
                            tw`h-7 w-15 rounded-3xl  border border-blue-300 items-center justify-center`,
                            {
                              backgroundColor:
                                data.selecteduser.monday === true
                                  ? '#00B1E7'
                                  : 'white',
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
                                  : 'white',
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
                                  : 'white',
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
                                  : 'white',
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
                                  : 'white',
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
                                  : 'white',
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
                                  : 'white',
                            },
                          ]}>
                          <Text style={tw`text-xs text-black`}>Sunday</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </>
            ))}
          </ScrollView>
        </View>
      ) : (
        <View style={tw` bg-white flex-1`}>
          <Screensheader
            name={'SELECT DOCTOR'}
            left={15}
            onPress={() => navigation.goBack()}
          />

          <View style={tw`w-85 h-12   flex-row  self-center  items-center`}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {/* card 1 */}

              <>
                <TouchableOpacity
                  // key={index}
                  onPress={() => {
                    // setloading(true)
                    // getallvideo(token)
                    getalldata();
                    setcat('All Doc');
                  }}>
                  <View
                    style={[
                      tw`bg-${
                        cat === 'All Doc' ? 'blue-400' : 'white'
                      } h-10 w-30 ml-5 border flex-row items-center justify-evenly rounded-3xl`,
                      {borderRadius: 50, borderColor: '#00B1E7'},
                    ]}>
                    <Text
                      numberOfLines={1}
                      style={tw`text-center text-${
                        cat === 'All Doc' ? 'white' : 'black'
                      } w-20`}>
                      {'All Doc'}
                    </Text>
                  </View>
                </TouchableOpacity>

                {GetData2?.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      // setloading(true)
                      // getcatvideo(item.id)
                      getdatabycat(item.label);
                      setcat(item.label);
                    }}>
                    <View
                      style={[
                        tw`bg-${
                          cat === item.label ? 'blue-400' : 'white'
                        } h-10 w-30 ml-5 border flex-row items-center justify-evenly rounded-3xl`,
                        {borderRadius: 50, borderColor: '#00B1E7'},
                      ]}>
                      {/* <Image style={tw`h-5 w-5 rounded-full`} source={{ uri: item.url }} /> */}
                      <Text
                        numberOfLines={1}
                        style={tw`text-center text-${
                          cat === item.label ? 'white' : 'black'
                        } w-20`}>
                        {item.label}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </>
            </ScrollView>
          </View>

          <ScrollView
            style={tw`flex-1 mb-5 self-center `}
            showsVerticalScrollIndicator={false}>
            {GetData.map((data, index) => (
              <>
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    navigation.navigate('Showappoinments', {
                      phone: data.selecteduser.phone,
                      slots: data.selecteduser.slots,
                      usercontrol: false,
                    });
                  }}>
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
                      <Text
                        numberOfLines={1}
                        style={tw`font-bold w-40 text-xl`}>
                        {data.selecteduser.fullname.toUpperCase()}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={tw`font-light mt-1 w-40 text-gray-400 text-sm`}>
                        {data.selecteduser.doctortypelabel}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={tw`font-light mt-1 w-40  text-base`}>
                        {data.selecteduser.profilestatus.toUpperCase()}
                      </Text>

                      {userflag === 'receptionist' ? (
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

                
                     </View>
                      ) : (
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
                              navigation.navigate('Sessions', {
                                doctorname: data.selecteduser.fullname,
                                doctortype: data.selecteduser.doctortype,
                                doctorphone: data.selecteduser.phone,
                                doctoremail: data.selecteduser.email,
                                doctorpassword: data.selecteduser.password,
                                doctorcity: data.selecteduser.city,
                                doctorfee :  data.selecteduser.doctorfee,
                                doctorexp :  data.selecteduser.doctorexp,
                                mondayy: data.selecteduser.monday,
                                tuesdayy: data.selecteduser.tuesday,
                                wednesdayy: data.selecteduser.wednesday,
                                thursdayy: data.selecteduser.thursday,
                                fridayy: data.selecteduser.friday,
                                saturdayy: data.selecteduser.saturday,
                                sundayy: data.selecteduser.sunday,
                                docid: data.selecteduser.userid,
                                doctortimefrom:
                                data.selecteduser.doctortimefrom,
                                doctortimeto: data.selecteduser.doctortimeto,
                                profile: data.selecteduser.profilephoto,
                                labell: data.selecteduser.doctortimefromlabel,
                                labell1: data.selecteduser.doctortimetolabel,
                                labell2: data.selecteduser.doctortypelabel,
                                // labell3: data.selecteduser.cityl,
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
                      )}

                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('Showappoinments', {
                            phone: data.selecteduser.phone,
                            slots: data.selecteduser.slots,
                            usercontrol: true,
                            idd : data.selecteduser.userid
                          });
                        }}>
                        <Text
                          numberOfLines={1}
                          style={tw`font-light mt-1 w-40 text-black underline text-base`}>
                          Book Appointment
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              </>
            ))}
          </ScrollView>
        </View>
      )}
    </>
  );
};

export default Yourplan;
