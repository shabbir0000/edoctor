import { View, Text, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import tw from "twrnc"
import { Input, showToast } from '../Universal/Input'
// import CheckBox from '@react-native-community/checkbox';
import { Buttonnormal } from '../Universal/Buttons';
import Screensheader from '../Universal/Screensheader';
// import LinearGradient from 'react-native-linear-gradient'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../../Firebase'
import Toast from 'react-native-toast-message'
import Deviceinfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { collection, doc, getDoc, onSnapshot, query, where } from 'firebase/firestore'
import { useFocusEffect } from '@react-navigation/native'

const Login = ({ navigation }) => {

  const [customerflag, setcustomerflag] = useState(true)
  const [customerflag1, setcustomerflag1] = useState(false)
  const [toggleCheckBox, setToggleCheckBox] = useState(false)
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const [loading, setloading] = useState(false)
  const [GetData, setGetData] = useState([]);
  // const id =  Deviceinfo.getUniqueId();
  useFocusEffect(

    React.useCallback(() => {
      console.log("ma chala ")
      const coll = collection(db, 'Signup');
      const q = query(coll, where('role', '==', "admin"));

      const unSubscribe = onSnapshot(q, snapshot => {
        console.log(snapshot.docs.length);
        setGetData(
          snapshot.docs.map(doc => ({
            selecteduser: doc.data(),
          })),
        );
      });

      // Cleanup function to unsubscribe from the snapshot listener
      return () => {
        unSubscribe();
      };
    }, []) // Empty dependency array ensures this runs only on focus and cleanup on blur
  );

  const loginwithemailandpass = async () => {
    const id = await Deviceinfo.getUniqueId();
    if (!email || !password) {
      showToast("error", "Field Required", "Must Fill All The Field", true, 1000)
    }

    else {
      setloading(true)
      try {
        signInWithEmailAndPassword(auth, email, password)
          .then(data1 => {
            // navigation.navigate("Tabbar")
            console.log("get email :", GetData[0].selecteduser.email);
            console.log("login email :", data1.user.email);
            if (GetData[0].selecteduser.email === data1.user.email) {
              console.log("admin");
              AsyncStorage.setItem("mobileid", id).then(() => {
                AsyncStorage.setItem("role", "admin").then(() => {
                  AsyncStorage.setItem("email", data1.user.email).then(() => {
                    navigation.navigate("Tabbar")
                    setloading(false)
                    console.log("unique id ", id);
                  })
                })
              })
            }
            else {
              console.log("user");
              AsyncStorage.setItem("mobileid", id).then(() => {
                AsyncStorage.setItem("role", "user").then(() => {
                  AsyncStorage.setItem("email", data1.user.email).then(() => {

                    navigation.navigate("Tabbar")
                    setloading(false)
                    console.log("unique id ", id);
                  })
                })
              })
            }
          })
          .catch(error => {
            setloading(false)

            showToast("error", "Error", error.message, true, 1000)

          });
      } catch (error) {
        setloading(false)
        showToast("error", "Error", 'Plzz Enter Valid Email Or Pass', true, 1000)
      }
     
    }
  };


  return (
    <>

      <View style={tw` bg-slate-50 flex-1  `}>
        <Screensheader
          name={"Login"}
          left={28}
          onPress={() => (
            navigation.goBack()
          )}
        />
        <View style={tw`items-center`}>
          <View style={tw`w-80 h-20 items-center justify-center mt-5`}>
            <Text style={[tw`text-3xl font-bold text-gray-400`, { color: '#00B1E7' }]}>
              Welcome
            </Text>
            <Text style={[tw`text-sm font-normal text-gray-400`, { color: '#00B1E7' }]}>
              Sign in to acess your account
            </Text>
          </View>

          {/* <View style={tw` flex-row justify-center items-center h-14 w-80 mt-5`}>

            <TouchableOpacity
              onPress={() => {
                setcustomerflag(!customerflag)
                setcustomerflag1(!customerflag1)

              }}
            >
              <View style={tw` h-12 w-35 items-center justify-center rounded-3xl bg-${customerflag ? 'red-500' : 'slate-50'}`}>
                <Text style={tw`text-${customerflag ? 'white' : 'gray-400'}`}>
                  Customer
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setcustomerflag(!customerflag)
                setcustomerflag1(!customerflag1)

              }}
            >
              <View style={tw` h-12 w-35 items-center justify-center rounded-3xl bg-${customerflag1 ? 'red-500' : 'slate-50'}`}>
                <Text style={tw`text-${customerflag1 ? 'white' : 'gray-400'}`}>
                  Merchant
                </Text>
              </View>
            </TouchableOpacity>


          </View> */}

          <Input
            value={email}
            onchangetext={setemail}
            source={require("../../Images/mail.png")}
            placeholder={"Enter Your Email"}
          />

          <Input
            value={password}
            entry={true}
            onchangetext={setpassword}
            source={require("../../Images/padlock.png")}
            placeholder={"Enter Your Password"}
          />


          <View style={tw` justify-end  items-center flex-row w-80 h-10 mt-5`}>


            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Forget')
              }}
            >
              <Text style={[tw` text-center`, { color: '#00B1E7' }]}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
          {
            loading ?
              <ActivityIndicator size={'large'} color={'#199A8E'} />
              :
              <View style={tw` justify-between w-80 h-15 mt-5 `}>
                <Buttonnormal
                  onPress={() => {
                    // navigation.navigate('Subplan')
                    loginwithemailandpass()

                  }}
                  c1={'#0B4064'}
                  c2={'#0B4064'}
                  style={tw`text-white`}
                  title={"LOGIN"}
                />
              </View>
          }
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Signup")
            }}
          >
            <View style={tw`mt-5`}>

              <Text>
                New Member?

                <Text style={{ color: '#00B1E7' }}> Sign Up Now</Text>

              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <Toast />
      </View>
    </>
  )
}

export default Login