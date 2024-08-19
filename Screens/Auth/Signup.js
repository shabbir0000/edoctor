import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import React, { useState } from 'react'
import tw from "twrnc"
import { Input, showToast } from '../Universal/Input'
import CheckBox from '@react-native-community/checkbox';
import { Buttonnormal } from '../Universal/Buttons';
import Screensheader from '../Universal/Screensheader';
import { doc, setDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, app, auth } from '../../Firebase';
import uuid from 'react-native-uuid';
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
// import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';

const Signup = ({ navigation }) => {

  const [customerflag, setcustomerflag] = useState(true)
  const [customerflag1, setcustomerflag1] = useState(false)
  const [toggleCheckBox, setToggleCheckBox] = useState(false)
  const [loading, setloading] = useState(false)
  const [name, setname] = useState("")
  const [email, setemail] = useState("")
  const [phone, setphone] = useState("")
  const [password, setpassword] = useState("")
  const userid = uuid.v4();


  const Signinwithemailandpass = async () => {
    if (!email || !password || !name || !phone) {
      showToast("error", "Field Required", "Must Fill All The Field", true, 1000)
    }

    else {
      setloading(true)
      createUserWithEmailAndPassword(auth, email, password)
        .then(data => {
          console.log(data.user.email);

          setDoc(doc(db, 'Signup', userid), {
            fullname: name,
            phone : phone,
            role: 'user',
            email: email.toLowerCase(),
            password,
            userid,
            timestamp: serverTimestamp(),
          })
            .then(() => {
              console.log('done');

              setDoc(doc(db, 'Profile', userid), {
                fullname: name,
                phone : phone,
                email: email.toLowerCase(),
                profilephoto: '',
                role: 'user',
                userid,
                timestamp: serverTimestamp(),
              })
                .then(() => {
                  setloading(false)
                  Alert.alert('Congratulation', 'User Has Been Register', [
                    {
                      text: 'OK',
                      onPress: () => navigation.navigate('Login'),
                    },
                  ]);
                })
                .catch(error => {
                  setloading(false)
                  // console.log(error);
                  Alert.alert('this :', error.message);
                });
            })
            .catch(error => {
              setloading(false)
              // console.log(error);
              Alert.alert('this :', error.message);
            });
        })
        .catch(error => {
          setloading(false)
          // console.log("this : ",error.message);
          Alert.alert('this :', error.message);
        });
    }
  };


  return (
    <>

      <View style={tw` bg-slate-50 flex-1  `}>
        <Screensheader
          name={"Signup"}
          left={25}
          onPress={() => (
            navigation.goBack()
          )}
        />
        <View style={tw`items-center`}>
          <View style={tw`w-80 h-20 items-center justify-center mt-5`}>
            <Text style={[tw`text-3xl font-bold text-gray-400`, { color: '#00B1E7' }]}>
              Great
            </Text>
            <Text style={[tw`text-sm font-normal text-gray-400`, { color: '#00B1E7' }]}>
              Sign Up To Create Your Account
            </Text>
          </View>

          <Input
            onchangetext={setname}
            source={require("../../Images/user.png")}
            placeholder={"Your Full Name"}
          />

          <Input
            onchangetext={setphone}
            entry={true}
            source={require("../../Images/smartphone.png")}
            placeholder={"Enter Your Phone Number"}
          />


          <Input
            onchangetext={setemail}
            source={require("../../Images/mail.png")}
            placeholder={"Enter Your Email"}
          />

          <Input
            onchangetext={setpassword}
            entry={true}
            source={require("../../Images/padlock.png")}
            placeholder={"Enter Your Password"}
          />


          <View style={tw` justify-start  items-center flex-row w-80 h-12 mt-5`}>
            <View style={tw` flex-row items-center justify-center w-80 h-10  `}>
              <CheckBox
                disabled={false}
                value={toggleCheckBox}
                onValueChange={(newValue) => setToggleCheckBox(newValue)}
              />
              <Text style={tw`text-gray-400 `}>By Checking The Box You Agree Our Term And Condition</Text>
            </View>

          </View>

          {
            loading ?
              <ActivityIndicator size={'large'} color={'#199A8E'} />
              :
              <View style={tw` justify-between w-80 h-15 mt-5 `}>
                <Buttonnormal
                  onPress={() => {
                    // navigation.navigate('Tabbar')
                    Signinwithemailandpass()
                  }}
                  c1={'#0B4064'}
                  c2={'#0B4064'}
                  style={tw`text-white`}
                  title={"SIGNUP"}
                />



              </View>
          }


          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Login")
            }}
          >
            <View style={tw`mt-5`}>

              <Text>
                Already Member?

                <Text style={{ color: '#00B1E7' }}> Login Now</Text>

              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <Toast />
      </View>
    </>
  )
}

export default Signup