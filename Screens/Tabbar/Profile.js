import { View, Text, Image, TouchableOpacity, Alert, Linking } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from "twrnc"
import Options from '../Universal/Options'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../../Firebase'
import Toast from 'react-native-toast-message'

const Profile = ({ navigation }) => {

  const [GetData, setGetData] = useState([]);

  useEffect(() => {

    AsyncStorage.getItem("email").then((email) => {
      const coll = collection(db, 'Profile');
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
    })
  }, []);

  const [name, setname] = useState("");
  const [fname, setfname] = useState("");
  const [lname, setlname] = useState("");
  const [email, setemail] = useState("");





  return (
    <View style={tw`flex-1`}>

      <View style={tw`h-80 w-full`}>
        <Image
          style={tw`h-80 w-full absolute`}
          source={require('../../Images/gradient.png')}
        />



        <View style={tw`h-30 w-30 mt-10 items-center justify-center self-center border-black  `}>
          <Image
            style={tw`h-28 w-28 `}
            resizeMode='contain'
            source={require('../../Images/deefelz.png')}
          />
        </View>


        <View style={tw`self-center justify-center mt-5`}>
          <Text style={tw`text-xl text-gray-200`}>
            {GetData[0]?.selecteduser.fullname}
          </Text>
        </View>

      </View>
      <View style={[{ borderTopLeftRadius: 40, borderTopRightRadius: 40 }, tw` justify-start  items-center shadow-md -mt-10 border-black bg-white h-120 w-90`]}>
        <View style={tw`mt-15`}>
          <Options text={"Change Password"} top={1} top1={5} flag={true} left={44}
            onPress={() => {
              navigation.navigate("Forget")
            }}
          />
          <Options text={"Update Profile"} top={1} top1={5} flag={true} left={44}
            onPress={() => {
              navigation.navigate("Updateprofile", {
                url: GetData[0]?.selecteduser.profilephoto ? GetData[0]?.selecteduser.profilephoto : "https://firebasestorage.googleapis.com/v0/b/supplysync-3e4b1.appspot.com/o/allfiles%2Fimages.jpg?alt=media&token=0aa9155e-5ebd-4b22-8f77-c9d70d280507",
                pname: GetData[0]?.selecteduser.fullname,
                pid: GetData[0]?.selecteduser.userid
              })
            }}
          />
          <Options text={"Privacy Policy"} top={7} top1={5} flag={true} left={51}
            onPress={() => (
              navigation.navigate("PP")
            )}
          />

          <Options text={"Chat With Us"} top={7} top1={5} flag={true} left={51}
            onPress={() => (
              Linking.openURL(`whatsapp://send?text=Hello\nI Have Query&phone=${"03342788001"}`)
            )}
          />
          {/* <Options text={"App Version"} top={7} top1={5} flag={false} text1={1.1} logo={false} left={55} /> */}

          <Options text={"Logout"} top={7} top1={5} flag={true} logo={false} left={65}
            onPress={() => {
              // AsyncStorage.removeItem("mobileid").then(() => {

              // })

              Alert.alert('Alert', 'Are You Sure You Want Logout?', [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {
                  text: 'OK', onPress: () => {
                    AsyncStorage.removeItem("mobileid").then(() => {
                      // AsyncStorage.removeItem("email").then(() => {
                      AsyncStorage.removeItem("token").then(() => {
                        navigation.reset({
                          index: 0,
                          routes: [{ name: 'WelcomeScreen' }],
                        });
                        // navigation.navigate("Login")

                        // })
                      })
                    })
                  }
                },
              ]);
            }}

          />

        </View>
        <Toast />
      </View>
    </View>
  )
}

export default Profile