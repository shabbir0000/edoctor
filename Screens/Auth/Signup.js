import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import tw from 'twrnc';
import {Input, showToast} from '../Universal/Input';
import CheckBox from '@react-native-community/checkbox';
import {Buttonnormal} from '../Universal/Buttons';
import Screensheader from '../Universal/Screensheader';
import {doc, setDoc, addDoc, serverTimestamp, collection, onSnapshot} from 'firebase/firestore';
import {db, app, auth} from '../../Firebase';
import uuid from 'react-native-uuid';
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
// import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import {Dropdown} from 'react-native-element-dropdown';

const Signup = ({navigation}) => {
  const [customerflag, setcustomerflag] = useState(true);
  const [customerflag1, setcustomerflag1] = useState(false);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [loading, setloading] = useState(false);
  const [GetData3, setGetData3] = useState([]);
  const [name, setname] = useState('');
  const [email, setemail] = useState('');
  const [phone, setphone] = useState('');
  const [city, setcity] = useState('');
  const [password, setpassword] = useState('');
  const userid = uuid.v4();
  const [value3, setValue3] = useState(null);
  const [label3, setlabel3] = useState(null);
  const [isFocus3, setIsFocus3] = useState(false);

  const Signinwithemailandpass = async () => {
    if (!email || !password || !name || !phone) {
      showToast(
        'error',
        'Field Required',
        'Must Fill All The Field',
        true,
        1000,
      );
    } else {
      setloading(true);
      createUserWithEmailAndPassword(auth, email, password)
        .then(data => {
          console.log(data.user.email);

          setDoc(doc(db, 'Signup', userid), {
            fullname: name,
            phone: phone,
            role: 'user',
            cityl: city.toLowerCase().trim(),
            email: email.toLowerCase().trim(),
            password,
            userid,
            timestamp: serverTimestamp(),
          })
            .then(() => {
              console.log('done');

              setDoc(doc(db, 'Profile', userid), {
                fullname: name,
                phone: phone,
                city: city.toLowerCase().trim(),
                email: email.toLowerCase().trim(),
                profilephoto: '',
                role: 'user',
                userid,
                timestamp: serverTimestamp(),
              })
                .then(() => {
                  setloading(false);
                  setemail('');
                  setpassword('');
                  setname('');
                  setphone('');
                  setcity('');

                  Alert.alert('Congratulation', 'User Has Been Register', [
                    {
                      text: 'OK',
                      onPress: () => navigation.navigate('Login'),
                    },
                  ]);
                })
                .catch(error => {
                  setloading(false);
                  // console.log(error);
                  Alert.alert('this :', error.message);
                });
            })
            .catch(error => {
              setloading(false);
              // console.log(error);
              Alert.alert('this :', error.message);
            });
        })
        .catch(error => {
          setloading(false);
          // console.log("this : ",error.message);
          Alert.alert('this :', error.message);
        });
    }
  };

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

  return (
    <>
      <View style={tw` bg-slate-50 flex-1  `}>
        <Screensheader
          name={'Signup'}
          left={25}
          onPress={() => navigation.goBack()}
        />
        <View style={tw`items-center`}>
          <ScrollView>
            <View style={tw`w-80 h-20 items-center justify-center mt-5`}>
              <Text
                style={[
                  tw`text-3xl font-bold text-gray-400`,
                  {color: '#00B1E7'},
                ]}>
                Great
              </Text>
              <Text
                style={[
                  tw`text-sm font-normal text-gray-400`,
                  {color: '#00B1E7'},
                ]}>
                Sign Up To Create Your Account
              </Text>
            </View>

            <Input
              onchangetext={setname}
              source={require('../../Images/user.png')}
              placeholder={'Your Full Name'}
            />

            <Input
              onchangetext={setphone}
              entry={false}
              source={require('../../Images/smartphone.png')}
              placeholder={'Enter Your Phone Number'}
            />

            {/* 
            <Input
              onchangetext={setcity}
              entry={false}
              source={require("../../Images/location-pin.png")}
              placeholder={"Enter Your City"}
            /> */}

            <Dropdown
              style={[
                tw`h-12 w-80 mt-3 border border-black rounded-3xl`,
               
              ]}
              placeholderStyle={tw`ml-3 text-gray-400 text-xs `}
              selectedTextStyle={tw`ml-3 text-gray-400  `}
              containerStyle={tw`h-80 w-80   mt-7  rounded-md`}
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
                setcity(item.label)
                setIsFocus3(false);
              }}
            />

            <Input
              onchangetext={setemail}
              source={require('../../Images/mail.png')}
              placeholder={'Enter Your Email'}
            />

            <Input
              onchangetext={setpassword}
              entry={true}
              source={require('../../Images/padlock.png')}
              placeholder={'Enter Your Password'}
            />

            <View
              style={tw` justify-start  items-center flex-row w-80 h-12 mt-5`}>
              <View
                style={tw` flex-row items-center justify-center w-80 h-10  `}>
                <CheckBox
                  disabled={false}
                  value={toggleCheckBox}
                  onValueChange={newValue => setToggleCheckBox(newValue)}
                />
                <Text style={tw`text-gray-400 `}>
                  By Checking The Box You Agree Our Term And Condition
                </Text>
              </View>
            </View>

            {loading ? (
              <ActivityIndicator size={'large'} color={'#199A8E'} />
            ) : (
              <View style={tw` justify-between w-80 h-15 mt-5 `}>
                <Buttonnormal
                  onPress={() => {
                    // navigation.navigate('Tabbar')
                    Signinwithemailandpass();
                  }}
                  c1={'#0B4064'}
                  c2={'#0B4064'}
                  style={tw`text-white`}
                  title={'SIGNUP'}
                />
              </View>
            )}

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Login');
              }}>
              <View style={tw`mt-5 self-center`}>
                <Text>
                  Already Member?
                  <Text style={{color: '#00B1E7'}}> Login Now</Text>
                </Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>
        <Toast />
      </View>
    </>
  );
};

export default Signup;
