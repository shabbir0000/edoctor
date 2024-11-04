import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Linking,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import LottieView from 'lottie-react-native';
import tw from 'twrnc';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showToast} from '../../Screens/Universal/Input';
import {useFocusEffect} from '@react-navigation/native';
import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import {db} from '../../Firebase';
import {AppContext} from '../../AppContext';

const Cbids = ({navigation}) => {
  const [userflag, setuserflag] = useState(false);
  const [loading, setloading] = useState(false);
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  const [name, setname] = useState('');
  const [GetData, setGetData] = useState([]);
  const [GetData1, setGetData1] = useState([]);
  const [GetData2, setGetData2] = useState([]);
  const [GetData3, setGetData3] = useState([]);
  const {cityy} = useContext(AppContext);

  const datee = new Date();
  const showdate =
    datee.getFullYear() + '/' + (datee.getMonth() + 1) + '/' + datee.getDate();

  useEffect(() => {
    AsyncStorage.getItem('role').then(role => {
      setuserflag(role);
    });
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('city').then(city => {
      const topdoc = async city => {
        const coll = collection(db, 'Profile');
        const q = query(
          coll,
          where('cityl', '==', city),
          where('role', '==', 'doctor'),
          limit(4),
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
      };
      topdoc(cityy);
    });
  }, [cityy]);

  useEffect(() => {
    AsyncStorage.getItem('email').then(email => {
      AsyncStorage.getItem('role').then(role => {
        const coll = collection(db, 'Appointment');
        const q = query(coll, where('bookdate', '==', showdate));
        // const q1 = query(coll, where('bookdate', '==', showdate));

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
      });
    });
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('email').then(email => {
      AsyncStorage.getItem('city').then(city => {
        AsyncStorage.getItem('role').then(role => {
          if (role === 'receptionist') {
            const fetchData = async city => {
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
                      where('cityl', '==', city),
                      where('role', '==', 'doctor'),
                      // where('doctortypelabel', '==', cat),
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

            fetchData(city);
          } else {
            const coll = collection(db, 'Profile');
            const q = query(
              coll,
              where('cityl', '==', city),
              where('role', '==', 'doctor'),
              where('ownemail', '==', email),
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
          }
        });
      });
    });
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('email').then(email => {
      AsyncStorage.getItem('city').then(city => {
        const tophospitals = async city => {
          const coll = collection(db, 'Profile');
          const q = query(
            coll,
            where('cityl', '==', city),
            where('role', '==', 'subadmin'),
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
        };
        tophospitals(cityy);
      });
    });
  }, [cityy]);

  return (
    <>
      {loading ? (
        <ActivityIndicator
          style={{
            flex: 1,
            alignItems: 'center',
            alignSelf: 'center',
            justifyContent: 'center',
          }}
          size={'large'}
        />
      ) : userflag === 'user' ? (
        <>
          <View
            style={tw` h-7 w-80 mt-5 self-center flex-row justify-between items-center`}>
            <Text style={tw`text-base font-bold`}>Top Doctors</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Yourplan', {
                  catt: '',
                });
              }}>
              <Text style={tw`text-base text-green-500 font-semibold`}>
                See All
              </Text>
            </TouchableOpacity>
          </View>

          <View style={tw`h-60 w-90 justify-center rounded-md`}>
            <ScrollView
              showsHorizontalScrollIndicator={false}
              horizontal={true}>
              {GetData.map((data, index) => (
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
              ))}
            </ScrollView>
          </View>

          <View
            style={tw` h-7 w-80  self-center flex-row justify-between items-center`}>
            <Text style={tw`text-base font-bold`}>Near Hospital</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Hospitals');
              }}>
              <Text style={tw`text-base text-green-500 font-semibold`}>
                See All
              </Text>
            </TouchableOpacity>
          </View>

          <View style={tw`h-70 w-90  justify-center rounded-md`}>
            <ScrollView
              showsHorizontalScrollIndicator={false}
              horizontal={true}>
              {GetData3.map((data, index) => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Hospitaldetail', {
                      phone: data.selecteduser.phone,
                      name: data.selecteduser.fullname,
                      email: data.selecteduser.email,
                    });
                  }}>
                  <View
                    key={index}
                    style={tw`border ml-3 mr-3 border-gray-300 h-60 w-70 self-center items-start justify-start mt-5 rounded-md`}>
                    <Image
                      style={tw`border h-40 w-69 self-center `}
                      source={{uri: data.selecteduser.profilephoto}}
                    />
                    <Text style={tw`text-base ml-3 font-bold`}>
                      {data.selecteduser.fullname.toUpperCase()}
                    </Text>
                    <Text style={tw`text-base ml-3 font-light`}>
                      {data.selecteduser.cityl.toUpperCase()}
                    </Text>
                    <Text style={tw`text-base ml-3 font-light`}>
                      {data.selecteduser.phone}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View
            style={tw` flex-row items-center justify-around border-black h-15 w-85 self-center rounded-md  mb-5`}>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(
                  'https://www.facebook.com/share/m7EVAAkPpTRA3oin/',
                );
              }}>
              <View style={tw`h-12 w-12 rounded-full `}>
                <Image
                  style={tw`h-12 w-12 rounded-full`}
                  source={{
                    uri: 'https://image.similarpng.com/very-thumbnail/2020/04/Popular-Logo-facebook-icon-png.png',
                  }}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                Linking.openURL(
                  'https://www.tiktok.com/@edoctor.pk?_t=8qva7vILKRL&_r=1',
                );
              }}>
              <View style={tw`h-12 w-12 `}>
                <Image
                  style={tw`h-12 w-12 rounded-full`}
                  source={{
                    uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTENULhSShQ0xJs4pnke7F-o27Ozd0iyUA6tw&s',
                  }}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                Linking.openURL(
                  'https://www.instagram.com/edoctorpk/profilecard/?igsh=Z3FjaDFnOTJobDFj',
                );
              }}>
              <View style={tw`h-12 w-12 `}>
                <Image
                  style={tw`h-12 w-12 rounded-full`}
                  source={{
                    uri: 'https://png.pngtree.com/png-clipart/20190613/original/pngtree-instagram-icon-logo-png-image_3560506.jpg',
                  }}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                Linking.openURL(
                  'https://youtube.com/@edoctorcom?si=QvbxJyEm2bqwXRbl',
                );
              }}>
              <View style={tw`h-12 w-12 `}>
                <Image
                  style={tw`h-12 w-12 rounded-full`}
                  source={{
                    uri: 'https://png.pngtree.com/element_our/sm/20180506/sm_5aeee59357bbb.png',
                  }}
                />
              </View>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={tw` w-80 self-center mt-10 h-190`}>
          <View
            style={tw`mt-10 h-70 w-80 border-black items-center self-center `}>
            <LottieView
              style={tw`self-center  w-60 h-60`}
              source={require('../../Images/Animation - 1722075556252.json')}
              autoPlay
              loop={true}
              speed={0.5}
            />
          </View>

          <View
            style={tw` items-center justify-around w-80 h-30 self-center flex-row `}>
            <View
              style={[
                tw`shadow-xl w-30 h-30 items-center justify-center self-center`,
                {backgroundColor: '#00B1E7'},
              ]}>
              <Text style={tw`text-white text-lg font-bold`}>
                Today Appointment
              </Text>

              <Text style={tw`text-lg text-white`}>{GetData1.length} </Text>
            </View>

            <View
              style={[
                tw`shadow-xl bg-blue-500 w-30 h-30  items-center justify-center self-center`,
                {backgroundColor: '#00B1E7'},
              ]}>
              <Text style={tw`text-white text-lg font-bold`}>
                Total {'\n'}Doctors
              </Text>
              <Text style={tw`text-lg text-white`}>{GetData2.length}</Text>
            </View>

            {/* <View
                style={[tw`shadow-xl w-25 h-20 items-center justify-center self-center`, { borderTopRightRadius: 30 ,backgroundColor:'#199A8E'}]}>
                <Text style={tw`text-white`}>Today Orders</Text>
                <Text style={tw`text-lg`}>{GetData1.length}</Text>
              </View> */}
          </View>
        </View>
      )}
    </>
  );
};

export default Cbids;
