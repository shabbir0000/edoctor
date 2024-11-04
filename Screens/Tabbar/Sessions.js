import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState, useCallback, useContext} from 'react';
import tw from 'twrnc';
import {Error, Input1, showToast} from '../../Screens/Universal/Input';
import {Formik} from 'formik';
import {Dropdown} from 'react-native-element-dropdown';
import * as Yup from 'yup';
import Screensheader from '../../Screens/Universal//Screensheader';
import storage from '@react-native-firebase/storage';
import {ref1, app, db, auth} from '../../Firebase';
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

import FilePicker from 'react-native-document-picker';
import uuid from 'react-native-uuid';
import {createUserWithEmailAndPassword, getAuth} from 'firebase/auth';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {Buttonnormal} from '../../Screens/Universal/Buttons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import CheckBox from '@react-native-community/checkbox';

const Sessions = ({navigation, route}) => {
  const {
    doctorname,
    doctortype,
    doctorphone,
    doctoremail,
    doctorpassword,
    doctorcity,
    doctorfee,
    doctorexp,
    mondayy,
    tuesdayy,
    wednesdayy,
    thursdayy,
    fridayy,
    saturdayy,
    sundayy,
    docid,
    doctortimefrom,
    doctortimeto,
    profile,
    labell,
    labell1,
    labell2,
    // labell3,
    profilestatus,
    doctoredu
  } = route.params;

  console.log('doc type :', doctortype);

  const [initialValues, setInitialValues] = useState({
    doctorname: '',
    doctorphone: '',
    doctoremail: '',
    doctorpassword: '',
    doctorcity: '',
    doctorfee: '',
    doctorexp: '',
    doctoredu : ''
  });

  const [loading, setloading] = useState(false);

  //for image
  const [imglink1, setimglink1] = useState(null);
  const [name1, setimgname1] = useState(null);
  const [type1, setimgtype1] = useState(null);
  const [filedata1, setfiledata1] = useState(profile);
  const [user, setuser] = useState(null);
  const [monday, setmonday] = useState(mondayy);
  const [tuesday, settuesday] = useState(tuesdayy);
  const [wednesday, setwednesday] = useState(wednesdayy);
  const [thursday, setthursday] = useState(thursdayy);
  const [friday, setfriday] = useState(fridayy);
  const [saturday, setsaturday] = useState(saturdayy);
  const [sunday, setsunday] = useState(sundayy);
  const [loading1, setloading1] = useState(true);
  const [userflag, setuserflag] = useState('');

  const [value, setValue] = useState(doctortimefrom);
  const [label, setlabel] = useState(labell);
  const [isFocus, setIsFocus] = useState(false);

  const [value1, setValue1] = useState(doctortimeto);
  const [label1, setlabel1] = useState(labell1);

  const [isFocus1, setIsFocus1] = useState(false);

  const [value2, setValue2] = useState(doctortype);
  const [label2, setlabel2] = useState(labell2);
  const [isFocus2, setIsFocus2] = useState(false);

  const [value3, setValue3] = useState(doctorcity);
  const [label3, setlabel3] = useState(null);
  const [isFocus3, setIsFocus3] = useState(false);

  const [GetData, setGetData] = useState([]);
  const [GetData1, setGetData1] = useState([]);
  const [GetData2, setGetData2] = useState([]);
  const [GetData3, setGetData3] = useState([]);

  const userid = uuid.v4();
  const datee = new Date();
  const showdate =
    datee.getFullYear() + '/' + (datee.getMonth() + 1) + '/' + datee.getDate();

  const [cat, setcat] = useState('Today');

  const data = [
    {label: '9:00 AM', value: '1'},
    {label: '10:00 AM', value: '2'},
    {label: '11:00 AM', value: '3'},
    {label: '12:00 PM', value: '4'},
    {label: '1:00 PM', value: '5'},
    {label: '2:00 PM', value: '6'},
    {label: '3:00 PM', value: '7'},
    {label: '4:00 PM', value: '8'},
    {label: '5:00 PM', value: '9'},
    {label: '6:00 PM', value: '10'},
    {label: '7:00 PM', value: '11'},
    {label: '8:00 PM', value: '12'},
    {label: '9:00 PM', value: '13'},
  ];

  const data1 = [
    {label: '9:00 AM', value: '1'},
    {label: '10:00 AM', value: '2'},
    {label: '11:00 AM', value: '3'},
    {label: '12:00 PM', value: '4'},
    {label: '1:00 PM', value: '5'},
    {label: '2:00 PM', value: '6'},
    {label: '3:00 PM', value: '7'},
    {label: '4:00 PM', value: '8'},
    {label: '5:00 PM', value: '9'},
    {label: '6:00 PM', value: '10'},
    {label: '7:00 PM', value: '11'},
    {label: '8:00 PM', value: '12'},
    {label: '9:00 PM', value: '13'},
  ];

  const data2 = [
    {label: 'Cardiologist', value: '1'},
    {label: 'Dermatologist', value: '2'},
    {label: 'Neurologist', value: '3'},
    {label: 'Orthopedic', value: '4'},
    {label: 'Pediatrician', value: '5'},
    {label: 'Psychiatrist', value: '6'},
    {label: 'Radiologist', value: '7'},
    {label: 'Urologist', value: '8'},
    {label: 'Gynecologist', value: '9'},
    {label: 'Ophthalmologist', value: '10'},
    {label: 'Anesthesiologist', value: '11'},
    {label: 'Oncologist', value: '12'},
    {label: 'Pathologist', value: '13'},
    {label: 'Rheumatologist', value: '14'},
    {label: 'General Practitioner', value: '15'},
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
    AsyncStorage.getItem('email').then(email => {
      const user = auth.currentUser;
      const coll = collection(db, 'Profile');
      const q = query(coll, where('email', '==', email));
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
  }, []);

  const Validation = Yup.object().shape({
    doctorname: Yup.string().required('Must be filled'),
  });

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem('email').then(email => {
        console.log('email :', email);
        setuser(email);
      });

      AsyncStorage.getItem('role').then(role => {
        setuserflag(role);
      });

      return () => {};
    }, []),
  );

  useEffect(() => {
    showtodayappointment();
  }, []);

  const showtodayappointment = async () => {
    console.log('date today', showdate);

    AsyncStorage.getItem('email').then(email => {
      const coll = collection(db, 'Appointment');
      const q = query(
        coll,
        where('email', '==', email),
        where('bookdate', '==', showdate),
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
  };

  const showemergency = async () => {
    console.log('date today', showdate);

    AsyncStorage.getItem('email').then(email => {
      const coll = collection(db, 'Emergency');
      const q = query(
        coll,
        where('email', '==', email),
        where('todaydate', '==', showdate),
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
  };

  const showallappointment = async () => {
    AsyncStorage.getItem('email').then(email => {
      const coll = collection(db, 'Appointment');
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
  };

  useEffect(() => {
    console.log('route.params:', route.params);

    setInitialValues({
      doctorname: doctorname,
      doctorphone: doctorphone,
      doctoremail: doctoremail,
      doctorpassword: doctorpassword,
      doctorcity: doctorcity,
      doctorfee: doctorfee,
      doctorexp: doctorexp,
      doctoredu : doctoredu
    });
    setmonday(mondayy);
    settuesday(tuesdayy);
    setwednesday(wednesdayy);
    setthursday(thursdayy);
    setfriday(fridayy);
    setsaturday(saturdayy);
    setsunday(sundayy);
    setValue(doctortimefrom);
    setValue1(doctortimeto);
    setValue2(doctortype);
    setloading1(false);
    setfiledata1(profile);
    setlabel(labell);
    setlabel1(labell1);
    setlabel2(labell2);

    return () => {
      setInitialValues({
        doctorname: '',
        doctorphone: '',
        doctoremail: '',
        doctorpassword: '',
        doctorcity: '',
        doctorfee: '',
        doctorexp: '',
        doctoredu : ''
      });
      setmonday(false);
      settuesday(false);
      setwednesday(false);
      setthursday(false);
      setfriday(false);
      setsaturday(false);
      setsunday(false);
      setValue('');
      setValue1('');
      setValue2('');
      setlabel('');
      setlabel1('');
      setlabel2('');
      // setfiledata1()
      setloading1(true);
    };
  }, [route.params]);

  const choosefileimg = async () => {
    try {
      const res = await FilePicker.pickSingle({
        presentationStyle: 'overFullScreen',
        copyTo: 'cachesDirectory',
        type: [FilePicker.types.images],
      });
      // if (res.size / 1000 / 1000 <= 5.0) {
      setfiledata1(res.uri);
      console.log(res.size / 1000 / 1000);
      console.log(res.uri);
      const path = res.fileCopyUri.replace('file://', '');
      setimglink1(path);
      setimgname1(res.name);
      setimgtype1(res.type);
    } catch (error) {
      if (FilePicker.isCancel(error)) {
        console.log('user cancel the pick file');
      } else {
        console.log('errror', error);
      }
    }
  };

  // const calculateSessionSlots = (startTime, endTime, sessionDuration) => {
  //   const convertTo24HourFormat = time => {
  //     const [timePart, modifier] = time.split(' ');
  //     let [hours, minutes] = timePart.split(':');

  //     if (hours === '12') {
  //       hours = '00';
  //     }

  //     if (modifier === 'PM' && hours !== '12') {
  //       hours = parseInt(hours, 10) + 12;
  //     }

  //     return `${String(hours).padStart(2, '0')}:${minutes}`;
  //   };

  //   const slots = [];
  //   let start = new Date(`1970-01-01T${convertTo24HourFormat(startTime)}:00`);
  //   let end = new Date(`1970-01-01T${convertTo24HourFormat(endTime)}:00`);
  //   const sessionInMs = sessionDuration * 60 * 1000;

  //   while (start.getTime() + sessionInMs <= end.getTime()) {
  //     const endSession = new Date(start.getTime() + sessionInMs);
  //     slots.push({
  //       start: start.toLocaleTimeString([], {
  //         hour: '2-digit',
  //         minute: '2-digit',
  //         hour12: true,
  //       }),
  //       end: endSession.toLocaleTimeString([], {
  //         hour: '2-digit',
  //         minute: '2-digit',
  //         hour12: true,
  //       }),
  //     });
  //     start = endSession;
  //   }

  //   return slots;
  // };



  const calculateSessionSlots = (startTime, endTime, sessionDuration) => {
    const convertTo24HourFormat = time => {
      const [timePart, modifier] = time.split(' ');
      let [hours, minutes] = timePart.split(':');
  
      if (hours === '12') {
        hours = '00';
      }
  
      if (modifier === 'PM' && hours !== '12') {
        hours = parseInt(hours, 10) + 12;
      }
  
      return `${String(hours).padStart(2, '0')}:${minutes}`;
    };
  
    const slots = [];
    let start = new Date(`1970-01-01T${convertTo24HourFormat(startTime)}:00`);
    let end = new Date(`1970-01-01T${convertTo24HourFormat(endTime)}:00`);
    const sessionInMs = sessionDuration * 60 * 1000;
    let token = 1; // Initialize token counter
  
    while (start.getTime() + sessionInMs <= end.getTime()) {
      const endSession = new Date(start.getTime() + sessionInMs);
      slots.push({
        token: token, // Add token number
        start: start.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
        end: endSession.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
      });
      start = endSession;
      token++; // Increment token counter
    }
  
    return slots;
  };
  
  const uploaddocfile = async (
    doctorname,
    doctorphone,
    doctoremail,
    doctorpassword,
    doctorcity,
    doctorfee,
    doctorexp,
    doctoredu
  ) => {
    console.log(
      'data :',
      doctorname,
      doctorphone,
      value,
      value1,
      value2,
      imglink1,
    );
    if (
      !doctorname ||
      !doctorphone ||
      !doctoremail ||
      !doctorpassword ||
      !doctoredu ||
      //   !doctorcity ||
      !value ||
      !value1 ||
      !value2 ||
      !imglink1
    ) {
      Alert.alert('Alert', 'Please Fill All The Detail');
    } else {
      setloading(true);
      const reference = storage().ref(`allfiles/${name1}`);
      await reference.putFile(imglink1);
      const url = await storage().ref(`allfiles/${name1}`).getDownloadURL();
      console.log('your file is locating :', url);
      adddoc(
        doctorname,
        doctorphone,
        doctoremail,
        doctorpassword,
        doctorcity,
        doctorfee,
        doctorexp,
        doctoredu,
        url,
      );
    }
  };

  const adddoc = async (
    doctorname,
    doctorphone,
    doctoremail,
    doctorpassword,
    doctorcity,
    doctorfee,
    doctorexp,
    doctoredu,
    url,
  ) => {
    if (
      !doctorname ||
      !doctorphone ||
      !doctoremail ||
      !doctorpassword ||
      //   !doctorcity ||
      !value ||
      !value1 ||
      !value2
    ) {
      showToast(
        'error',
        'Field Required',
        'Must Fill All The Field',
        true,
        1000,
      );
    } else {
      const slots = calculateSessionSlots(label, label1, 20);
      await createUserWithEmailAndPassword(auth, doctoremail, doctorpassword)
        .then(() => {
          setDoc(doc(db, 'Signup', userid), {
            fullname: doctorname,
            phone: doctorphone,
            email: doctoremail.toLowerCase().trim(),
            //   city: label3.toLowerCase(),
            //   cityl: value3,
            cityl: GetData1[0].selecteduser.cityl,
            doctorfee: doctorfee,
            doctorexp: doctorexp,
            hospitalname: GetData1[0].selecteduser.fullname,
            hospitalphone: GetData1[0].selecteduser.phone,
            hospitaladdress: GetData1[0].selecteduser.address,
            password: doctorpassword,
            doctoredu : doctoredu,
            ownemail: user,
            doctortype: value2,
            doctortypelabel: label2.toLowerCase(),
            monday: monday,
            tuesday: tuesday,
            wednesday: wednesday,
            thursday: thursday,
            friday: friday,
            saturday: saturday,
            sunday: sunday,
            days : [
              monday ? "1" : "0",
              tuesday ? "2" : "0",
              wednesday ? "3" : "0",
              thursday ? "4" : "0",
              friday ? "5" : "0",
              saturday ? "6" : "0",
              sunday ? "7" : "0",
            ],
            doctortimefrom: value,
            doctortimefromlabel: label,
            doctortimeto: value1,
            doctortimetolabel: label1,
            role: 'doctor',
            profilestatus: 'active',
            slots: slots,
            userid,
            timestamp: serverTimestamp(),
            profilephoto: url,
          })
            .then(() => {
              setDoc(doc(db, 'Profile', userid), {
                fullname: doctorname,
                phone: doctorphone,
                email: doctoremail.toLowerCase().trim(),
                //   city: label3.toLowerCase(),
                //   cityl: value3,
                cityl: GetData1[0].selecteduser.cityl,
                doctorfee: doctorfee,
                doctorexp: doctorexp,
                hospitalname: GetData1[0].selecteduser.fullname,
                hospitalphone: GetData1[0].selecteduser.phone,
                hospitaladdress: GetData1[0].selecteduser.address,
                password: doctorpassword,
                doctoredu : doctoredu,
                ownemail: user,
                doctortype: value2,
                doctortypelabel: label2.toLowerCase(),
                monday: monday,
                tuesday: tuesday,
                wednesday: wednesday,
                thursday: thursday,
                friday: friday,
                saturday: saturday,
                sunday: sunday,
                days : [
                  monday ? "1" : "0",
                  tuesday ? "2" : "0",
                  wednesday ? "3" : "0",
                  thursday ? "4" : "0",
                  friday ? "5" : "0",
                  saturday ? "6" : "0",
                  sunday ? "7" : "0",
                ],
                doctortimefrom: value,
                doctortimefromlabel: label,
                doctortimeto: value1,
                doctortimetolabel: label1,
                role: 'doctor',
                profilestatus: 'active',
                slots: slots,
                userid,
                timestamp: serverTimestamp(),
                profilephoto: url,
              }).then(() => {
                console.log('done');
                //  setfiledata1(null)

                setmonday(false);
                settuesday(false);
                setwednesday(false);
                setthursday(false);
                setfriday(false);
                setsaturday(false);
                setsunday(false);
                setValue('');
                setValue1('');
                setValue2('');
                setValue3('');

                setloading(false);
                Alert.alert('Congratulation', 'Doctor Has Been Register', [
                  {
                    text: 'OK',
                    onPress: () => navigation.navigate('Home'),
                  },
                ]);
              });
            })
            .catch(error => {
              setloading(false);
              Alert.alert('this :', error.message);
            });
        })
        .catch(error => {
          setloading(false);
          Alert.alert('Error :', error.message);
        });
    }
  };

  const updatedocfile = async (
    doctorname,
    doctorphone,
    doctoremail,
    doctorpassword,
    doctorcity,
    doctorfee,
    doctorexp,
    doctoredu
  ) => {
    if (filedata1.startsWith('file://') || filedata1.startsWith('content://')) {
      // showModal;
      setloading(true);
      const reference = storage().ref(`allfiles/${name1}`);
      await reference.putFile(imglink1);
      const url = await storage().ref(`allfiles/${name1}`).getDownloadURL();
      console.log('your file is locating :', url);
      updatedoc(
        doctorname,
        doctorphone,
        doctoremail,
        doctorpassword,
        doctorcity,
        doctorfee,
        doctorexp,
        doctoredu,
        url,
      );
    } else {
      try {
        setloading(true);
        updatedoc(
          doctorname,
          doctorphone,
          doctoremail,
          doctorpassword,
          doctorcity,
          doctorfee,
          doctorexp,
          doctoredu,
          filedata1,
        );
      } catch (error) {
        setloading(false);
        console.log('Error :', error);
      }
    }
  };

  const updatedoc = async (
    doctorname,
    doctorphone,
    doctoremail,
    doctorpassword,
    doctorcity,
    doctorfee,
    doctorexp,
    doctoredu,
    url,
  ) => {
    const slots = calculateSessionSlots(label, label1, 20);
    updateDoc(doc(db, 'Profile', docid), {
      fullname: doctorname,
      phone: doctorphone,
      email: doctoremail.toLowerCase().trim(),
      //   city: label3.toLowerCase(),
      //   cityl: value3,
      cityl: GetData1[0].selecteduser.cityl,
      doctorfee: doctorfee,
      doctorexp: doctorexp,
      hospitalname: GetData1[0].selecteduser.fullname,
      hospitalphone: GetData1[0].selecteduser.phone,
      hospitaladdress: GetData1[0].selecteduser.address,
      password: doctorpassword,
      doctoredu : doctoredu,
      ownemail: user,
      doctortype: value2,
      doctortypelabel: label2.toLowerCase(),
    //   doctortypelabel: value2,
      monday: monday,
      tuesday: tuesday,
      wednesday: wednesday,
      thursday: thursday,
      friday: friday,
      saturday: saturday,
      sunday: sunday,
      days : [
        monday ? "1" : "0",
        tuesday ? "2" : "0",
        wednesday ? "3" : "0",
        thursday ? "4" : "0",
        friday ? "5" : "0",
        saturday ? "6" : "0",
        sunday ? "7" : "0",
      ],
      doctortimefrom: value,
      doctortimefromlabel: label,
      doctortimeto: value1,
      doctortimetolabel: label1,
      role: 'doctor',
      profilestatus: profilestatus,
      userid: docid,
      slots: slots,
      profilephoto: url,
      timestamp: serverTimestamp(),
    })
      .then(() => {
        console.log('done');
        setloading(false);
        Alert.alert('Congratulation', 'Doctor Detail Has Been Updated', [
          {text: 'OK', onPress: () => navigation.goBack()},
        ]);
      })
      .catch(error => {
        setloading(false);
        Alert.alert('this :', error.message);
      });
  };

  const vrImages = [
    {
      url: 'https://vection-cms-prod.s3.eu-central-1.amazonaws.com/Adobe_Stock_506941973_cc825880a8.jpeg',
      text: 'Today',
    },
    {
      url: 'https://images.inc.com/uploaded_files/image/1920x1080/getty_921019710_413686.jpg',
      text: 'All',
    },
    {
      url: 'https://images.inc.com/uploaded_files/image/1920x1080/getty_921019710_413686.jpg',
      text: 'Emergency',
    },
  ];

  return (
    <>
      {loading1 ? (
        <ActivityIndicator
          style={tw`items-center flex-1 self-center justify-center`}
          size="large"
          color="#199A8E"
        />
      ) : (
        <>
          {userflag === 'user' ? (
            <>
              <View style={tw` bg-white flex-1`}>
                <Screensheader
                  name={'MY APPOINMENTS'}
                  left={10}
                  onPress={() => navigation.goBack()}
                />

                <View
                  style={tw`w-85 h-12   flex-row  self-center  items-center`}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {/* card 1 */}

                    <>
                      {vrImages?.map((item, index) => (
                        <TouchableOpacity
                          key={index}
                          onPress={() => {
                            // setloading(true)
                            // getcatvideo(item.id)

                            if (item.text === 'All') {
                              showallappointment();
                              setcat(item.text);
                            } else if (item.text === 'Today') {
                              showtodayappointment();
                              setcat(item.text);
                            } else {
                              showemergency();
                              setcat(item.text);
                            }
                          }}>
                          <View
                            style={[
                              tw`bg-${
                                cat === item.text ? 'blue-400' : 'white'
                              } h-10 w-25 ml-5 border flex-row items-center justify-evenly rounded-3xl`,
                              {borderRadius: 50, borderColor: '#00B1E7'},
                            ]}>
                            {/* <Image style={tw`h-5 w-5 rounded-full`} source={{ uri: item.url }} /> */}
                            <Text
                              numberOfLines={1}
                              style={tw`text-center text-${
                                cat === item.text ? 'white' : 'black'
                              } w-20`}>
                              {item.text}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </>
                  </ScrollView>
                </View>

                <ScrollView
                  style={tw`flex-1 mb-5 self-center`}
                  showsVerticalScrollIndicator={false}>
                  {GetData.map((data, index) => (
                    <TouchableOpacity disabled={true} key={index}>
                      <View
                        style={[
                          tw`border flex-col justify-center  items-center w-80 h-${
                            cat === "Emergency ? '40' : '45'"
                          } rounded-md self-center mt-5`,
                          {borderColor: '#00B1E7'},
                        ]}>
                        <View
                          key={index}
                          style={[
                            tw` flex-row justify-around  items-center  w-80 h-35  self-center `,
                          ]}>
                          <Image
                            style={tw`h-30 w-35  rounded-md`}
                            resizeMode="cover"
                            source={{uri: data.selecteduser.profile}}
                          />
                          <View
                            style={tw`w-40 h-30 justify-start  items-start `}>
                            <Text
                              numberOfLines={1}
                              style={tw`font-bold w-30 text-xl`}>
                              {data.selecteduser.doctorname}
                            </Text>

                            <Text
                              numberOfLines={1}
                              style={tw`font-light w-30 text-base`}>
                              Token No: {data.selecteduser.token}
                            </Text>

                            <Text
                              numberOfLines={1}
                              style={tw`font-light mt-2 w-30 text-gray-400 text-base`}>
                              {data.selecteduser.doctortypelabel
                                ? data.selecteduser.doctortypelabel
                                : data.selecteduser.status.toUpperCase()}
                            </Text>

                            <Text
                              numberOfLines={1}
                              style={tw`font-medium mt-2  w-30 text-gray-400 text-base`}>
                              From {data.selecteduser.doctortimefromlabel}
                            </Text>
                            {/* <Text
                              numberOfLines={1}
                              style={tw`font-medium mt-2  w-30 text-gray-400 text-base`}>
                              To {data.selecteduser.doctortimetolabel}
                            </Text> */}
                          </View>
                        </View>
                        {cat === 'Emergency' ? (
                          <></>
                        ) : (
                          <View
                            style={tw`h-10  justify-around items-start flex-row w-75`}>
                            <Text
                              numberOfLines={1}
                              style={tw`font-normal  text-base`}>
                              {data.selecteduser.bookdate}
                            </Text>
                            <Text
                              numberOfLines={1}
                              style={tw`font-normal   text-sm`}>
                              {data.selecteduser.bookstime} To{' '}
                              {data.selecteduser.booketime}{' '}
                            </Text>
                            {/* <Text numberOfLines={1} style={tw`font-normal text-green-500   text-base`}>{data.selecteduser.status.toUpperCase()}</Text> */}
                          </View>
                        )}

                        {/* <TouchableOpacity>
                                                        <View style={tw` rounded-md bg-slate-200 w-70 items-center justify-center h-10 mt-5 `}>

                                                            <Text>
                                                                CANCEL
                                                            </Text>

                                                        </View>
                                                    </TouchableOpacity> */}
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </>
          ) : (
            <>
              <View style={[tw`flex-1 flex`, {backgroundColor: '#FFFFFF'}]}>
                <>
                  <Formik
                    enableReinitialize
                    initialValues={initialValues}
                    validationSchema={Validation}
                    onSubmit={(values, {resetForm}) => {
                      if (docid) {
                        updatedocfile(
                          values.doctorname,
                          values.doctorphone,
                          values.doctoremail,
                          values.doctorpassword,
                          values.doctorcity,
                          values.doctorfee,
                          values.doctorexp,
                          values.doctoredu

                        );
                      } else {
                        uploaddocfile(
                          values.doctorname,
                          values.doctorphone,
                          values.doctoremail,
                          values.doctorpassword,
                          values.doctorcity,
                          values.doctorfee,
                          values.doctorexp,
                          values.doctoredu
                        );
                      }
                      // resetForm({})
                    }}>
                    {({
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      errors,
                      touched,
                      values,
                      isValid,
                    }) => (
                      <SafeAreaView>
                        <ScrollView
                          vertical
                          showsVerticalScrollIndicator={true}>
                          <View style={tw`h-${docid ? '280' : '295'}`}>
                            <Screensheader
                              name={'ADD DOCTOR'}
                              left={15}
                              onPress={() => navigation.goBack()}
                            />

                            <View
                              style={tw`flex flex-col w-80 self-center justify-around`}>
                              <TouchableOpacity onPress={() => choosefileimg()}>
                                <View
                                  style={tw`flex w-80  items-center  mt-5 flex-col`}>
                                  <View
                                    style={tw`  h-30 border-2 rounded-full w-30 items-center border-dotted`}>
                                    <Image
                                      source={{uri: filedata1}}
                                      resizeMode="cover"
                                      style={tw` w-29 h-29 rounded-full`}
                                    />
                                  </View>
                                  <View style={tw`mt-2 items-center`}>
                                    <Text style={tw`font-bold  `}>
                                      Add Profile Image
                                    </Text>
                                    <Text style={tw`text-xs  `}>Max 5mb</Text>
                                  </View>
                                </View>
                              </TouchableOpacity>
                            </View>

                            <View style={tw` self-center  h-70`}>
                              <View style={tw`top-5`}>
                                <Input1
                                  placeholder="Add Doctor Name"
                                  onchangetext={handleChange('doctorname')}
                                  onblur={handleBlur('doctorname')}
                                  value={values.doctorname}
                                  error={
                                    touched.doctorname
                                      ? errors.doctorname
                                      : false
                                  }
                                />
                              </View>

                              <View style={tw`top-5`}>
                                <Input1
                                  placeholder="Add Doctor Email"
                                  onchangetext={handleChange('doctoremail')}
                                  onblur={handleBlur('doctoremail')}
                                  value={values.doctoremail}
                                  error={
                                    touched.doctoremail
                                      ? errors.doctoremail
                                      : false
                                  }
                                />
                              </View>

                              {docid ? (
                                <></>
                              ) : (
                                <View style={tw`top-5`}>
                                  <Input1
                                    placeholder="Add Doctor Password"
                                    onchangetext={handleChange(
                                      'doctorpassword',
                                    )}
                                    onblur={handleBlur('doctorpassword')}
                                    value={values.doctorpassword}
                                    error={
                                      touched.doctorpassword
                                        ? errors.doctorpassword
                                        : false
                                    }
                                  />
                                </View>
                              )}

                              {/* <View style={tw`top-7`}>
                                <Dropdown
                                  style={[
                                    tw`h-12 w-80   bg-gray-100 rounded-md`,
                                    {backgroundColor: '#EEEEEE'},
                                  ]}
                                  placeholderStyle={tw`ml-3 text-gray-400 text-xs `}
                                  selectedTextStyle={tw`ml-3 text-gray-400  `}
                                  containerStyle={tw`h-80 w-80  mt-7 bg-gray-100 rounded-md`}
                                  data={GetData3}
                                  maxHeight={300}
                                  labelField="label"
                                  valueField="value"
                                  placeholder={'Select Doctor City'}
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
                                    setIsFocus3(false);
                                  }}
                                />
                              </View> */}

                              <View style={tw`top-5`}>
                                <Input1
                                  edit={true}
                                  placeholder={'Enter The Doctor Fee'}
                                  onchangetext={handleChange('doctorfee')}
                                  onblur={handleBlur('doctorfee')}
                                  value={values.doctorfee}
                                  error={
                                    touched.doctorfee ? errors.doctorfee : false
                                  }
                                />
                              </View>

                              <View style={tw`top-5`}>
                                <Input1
                                  edit={true}
                                  placeholder={'Enter The Doctor Experience'}
                                  onchangetext={handleChange('doctorexp')}
                                  onblur={handleBlur('doctorexp')}
                                  value={values.doctorexp}
                                  error={
                                    touched.doctorexp ? errors.doctorexp : false
                                  }
                                />
                              </View>

                              <View style={tw`top-5`}>
                                <Input1
                                  edit={true}
                                  placeholder={'Enter The Doctor Education'}
                                  onchangetext={handleChange('doctoredu')}
                                  onblur={handleBlur('doctoredu')}
                                  value={values.doctoredu}
                                  error={
                                    touched.doctoredu ? errors.doctoredu : false
                                  }
                                />
                              </View>

                              <View style={tw`top-8`}>
                                <Text style={tw`text-gray-400 `}>
                                  Select Doctor Type
                                </Text>
                                <Dropdown
                                  style={[
                                    tw`h-12 w-80   bg-gray-100 rounded-md`,
                                    {backgroundColor: '#EEEEEE'},
                                  ]}
                                  placeholderStyle={tw`ml-3 text-gray-400 text-xs `}
                                  selectedTextStyle={tw`ml-3 text-gray-400  `}
                                  containerStyle={tw`h-80 w-80  mt-7 bg-gray-100 rounded-md`}
                                  data={GetData2}
                                  maxHeight={300}
                                  labelField="label"
                                  valueField="value"
                                  placeholder={'Select Doctor Type'}
                                  mode="modal"
                                  value={value2}
                                  search // This enables the search option
                                  searchPlaceholder="Search Doctor Type" // Placeholder for the search input
                                  onFocus={() => setIsFocus2(true)}
                                  onBlur={() => setIsFocus2(false)}
                                  onChange={item => {
                                    console.log('time', item.label);
                                    setlabel2(item.label);
                                    setValue2(item.value);
                                    setIsFocus2(false);
                                  }}
                                />
                              </View>

                              <View style={tw`top-8`}>
                                <Input1
                                  placeholder="Add Doctor Phone"
                                  keyboardType={'number-pad'}
                                  onchangetext={handleChange('doctorphone')}
                                  onblur={handleBlur('doctorphone')}
                                  value={values.doctorphone}
                                  error={
                                    touched.doctorphone
                                      ? errors.doctorphone
                                      : false
                                  }
                                />
                              </View>

                              <View
                                style={tw` justify-start  items-center flex-col w-80 h-25 mt-10`}>
                                <Text
                                  style={tw`text-gray-700 font-bold text-lg `}>
                                  Add Doctor Days
                                </Text>

                                <View
                                  style={tw` flex-row items-center justify-center w-70 h-10  `}>
                                  <CheckBox
                                    disabled={false}
                                    value={monday}
                                    onValueChange={newValue =>
                                      setmonday(newValue)
                                    }
                                  />
                                  <Text style={tw`text-gray-400 `}>Monday</Text>

                                  <CheckBox
                                    disabled={false}
                                    value={tuesday}
                                    onValueChange={newValue =>
                                      settuesday(newValue)
                                    }
                                  />
                                  <Text style={tw`text-gray-400 `}>
                                    Tuesday
                                  </Text>

                                  <CheckBox
                                    disabled={false}
                                    value={wednesday}
                                    onValueChange={newValue =>
                                      setwednesday(newValue)
                                    }
                                  />
                                  <Text style={tw`text-gray-400 `}>
                                    Wednesday
                                  </Text>
                                </View>

                                <View
                                  style={tw` flex-row items-center justify-center w-80  h-10  `}>
                                  <CheckBox
                                    disabled={false}
                                    value={thursday}
                                    onValueChange={newValue =>
                                      setthursday(newValue)
                                    }
                                  />
                                  <Text style={tw`text-gray-400 `}>
                                    Thursday
                                  </Text>

                                  <CheckBox
                                    disabled={false}
                                    value={friday}
                                    onValueChange={newValue =>
                                      setfriday(newValue)
                                    }
                                  />
                                  <Text style={tw`text-gray-400 `}>Friday</Text>

                                  <CheckBox
                                    disabled={false}
                                    value={saturday}
                                    onValueChange={newValue =>
                                      setsaturday(newValue)
                                    }
                                  />
                                  <Text style={tw`text-gray-400 `}>
                                    Saturday
                                  </Text>

                                  <CheckBox
                                    disabled={false}
                                    value={sunday}
                                    onValueChange={newValue =>
                                      setsunday(newValue)
                                    }
                                  />
                                  <Text style={tw`text-gray-400 `}>Sunday</Text>
                                </View>
                              </View>

                              <View style={tw`top-8`}>
                                <Text style={tw`text-gray-400 `}>
                                  Select Time From
                                </Text>
                                <Dropdown
                                  style={[
                                    tw`h-12 w-80   bg-gray-100 rounded-md`,
                                    {backgroundColor: '#EEEEEE'},
                                  ]}
                                  placeholderStyle={tw`ml-3 text-gray-400 text-xs `}
                                  selectedTextStyle={tw`ml-3 text-gray-400  `}
                                  containerStyle={tw`h-80 w-80  mt-7 bg-gray-100 rounded-md`}
                                  data={data}
                                  maxHeight={300}
                                  labelField="label"
                                  valueField="value"
                                  placeholder={'Select Doctor Time From'}
                                  mode="modal"
                                  value={value}
                                  onFocus={() => setIsFocus(true)}
                                  onBlur={() => setIsFocus(false)}
                                  onChange={item => {
                                    setValue(item.value);
                                    setlabel(item.label);
                                    setIsFocus(false);
                                  }}
                                />
                              </View>

                              <View style={tw`top-10`}>
                                <Text style={tw`text-gray-400 `}>
                                  Select Time To
                                </Text>
                                <Dropdown
                                  style={[
                                    tw`h-12 w-80   bg-gray-100 rounded-md`,
                                    {backgroundColor: '#EEEEEE'},
                                  ]}
                                  placeholderStyle={tw`ml-3 text-gray-400 text-xs `}
                                  selectedTextStyle={tw`ml-3 text-gray-400  `}
                                  containerStyle={tw`h-80 w-80  mt-7 bg-gray-100 rounded-md`}
                                  data={data1}
                                  maxHeight={300}
                                  labelField="label"
                                  valueField="value"
                                  placeholder={'Select Doctor Time To'}
                                  mode="modal"
                                  value={value1}
                                  onFocus={() => setIsFocus1(true)}
                                  onBlur={() => setIsFocus1(false)}
                                  onChange={item => {
                                    setValue1(item.value);
                                    setlabel1(item.label);
                                    setIsFocus1(false);
                                  }}
                                />
                              </View>

                              {loading ? (
                                <ActivityIndicator
                                  style={tw`mt-15 `}
                                  size="large"
                                  color="#199A8E"
                                />
                              ) : (
                                <View style={tw`mt-15`}>
                                  <Buttonnormal
                                    onPress={handleSubmit}
                                    // onPress={() => {
                                    //     console.log(monday);
                                    //     console.log(tuesday);
                                    //     console.log(wednesday);
                                    //     console.log(thursday);
                                    //     console.log(friday);
                                    //     console.log(saturday);
                                    //     console.log(sunday);
                                    // }}
                                    c1={'#0B4064'}
                                    c2={'#0B4064'}
                                    style={tw`text-white`}
                                    title={
                                      docid ? 'UPDATE DOCTOR' : 'ADD DOCTOR'
                                    }
                                  />
                                </View>
                              )}
                            </View>
                          </View>
                        </ScrollView>
                      </SafeAreaView>
                    )}
                  </Formik>
                </>
              </View>
              <Toast />
            </>
          )}
        </>
      )}
    </>
  );
};

export default Sessions;

var styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
