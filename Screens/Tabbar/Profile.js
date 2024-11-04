import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import tw from 'twrnc';
import Options from '../Universal/Options';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {collection, onSnapshot, query, where} from 'firebase/firestore';
import {db} from '../../Firebase';
import Toast from 'react-native-toast-message';
import {AppContext} from '../../AppContext';

const Profile = ({navigation}) => {
  const [GetData, setGetData] = useState([]);
  const [role, setrole] = useState('');
  const {setcity} = useContext(AppContext);

  useEffect(() => {
    AsyncStorage.getItem('email').then(email => {
      AsyncStorage.getItem('role').then(role => {
        setrole(role);
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
      });
    });
  }, []);

  const [name, setname] = useState('');
  const [fname, setfname] = useState('');
  const [lname, setlname] = useState('');
  const [email, setemail] = useState('');

  return (
    <View style={tw`flex-1`}>
      <View style={tw`h-80 w-full`}>
        <Image
          style={tw`h-80 w-full absolute`}
          source={require('../../Images/gradient.png')}
        />

        <View
          style={tw`h-30 w-30 mt-10 items-center justify-center self-center border-black  `}>
          <Image
            style={tw`h-28 w-28 `}
            resizeMode="contain"
            source={require('../../Images/deefelz.png')}
          />
        </View>

        <View style={tw`self-center justify-center mt-5`}>
          <Text style={tw`text-xl text-gray-200`}>
            {GetData[0]?.selecteduser.fullname}
          </Text>
        </View>
      </View>
      <View
        style={[
          {borderTopLeftRadius: 40, borderTopRightRadius: 40},
          tw` justify-start  items-center shadow-md -mt-10 border-black bg-white h-120 w-90`,
        ]}>
        <View style={tw`mt-15`}>
          <Options
            text={'Change Password'}
            top={1}
            top1={5}
            flag={true}
            left={44}
            onPress={() => {
              navigation.navigate('Forget');
            }}
          />
          <Options
            text={'Update Profile'}
            top={1}
            top1={5}
            flag={true}
            left={44}
            onPress={() => {
              navigation.navigate('Updateprofile', {
                url: GetData[0]?.selecteduser.profilephoto
                  ? GetData[0]?.selecteduser.profilephoto
                  : 'https://firebasestorage.googleapis.com/v0/b/supplysync-3e4b1.appspot.com/o/allfiles%2Fimages.jpg?alt=media&token=0aa9155e-5ebd-4b22-8f77-c9d70d280507',
                pname: GetData[0]?.selecteduser.fullname,
                pid: GetData[0]?.selecteduser.userid,
              });
            }}
          />
          <Options
            text={'Privacy Policy'}
            top={7}
            top1={5}
            flag={true}
            left={51}
            onPress={() => navigation.navigate('PP')}
          />

          {/* <Options text={"Chat With Us"} top={7} top1={5} flag={true} left={51}
            onPress={() => (
              Linking.openURL(`whatsapp://send?text=Hello\nI Have Query&phone=${"03342788001"}`)
            )}
          /> */}
          {/* <Options text={"App Version"} top={7} top1={5} flag={false} text1={1.1} logo={false} left={55} /> */}

          <Options
            text={'Logout'}
            top={7}
            top1={5}
            flag={true}
            logo={false}
            left={65}
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
                  text: 'OK',
                  onPress: () => {
                    AsyncStorage.removeItem('mobileid').then(() => {
                      AsyncStorage.removeItem('city').then(() => {
                        AsyncStorage.removeItem('token').then(() => {
                          setcity(null);
                          navigation.reset({
                            index: 0,
                            routes: [{name: 'WelcomeScreen'}],
                          });
                          // navigation.navigate("Login")
                        });
                      });
                    });
                  },
                },
              ]);
            }}
          />
        </View>
        {role === 'user' ? (
          <></>
        ) : (
          <View
            style={tw` flex-row items-center justify-around border-black h-15 w-85 self-center rounded-md mt-5`}>
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
        )}
      </View>

      <Toast />
    </View>
  );
};

export default Profile;
