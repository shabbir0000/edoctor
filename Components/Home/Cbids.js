import { View, Text, TouchableOpacity, Image, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import LottieView from 'lottie-react-native';
import tw from 'twrnc';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showToast } from '../../Screens/Universal/Input';
import { useFocusEffect } from '@react-navigation/native';
import { collection, limit, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../Firebase';


const Cbids = ({ navigation }) => {
  const [userflag, setuserflag] = useState(false);
  const [loading, setloading] = useState(false);
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  const [name, setname] = useState("");
  const [GetData, setGetData] = useState([]);
  const [GetData1, setGetData1] = useState([]);
  const [GetData2, setGetData2] = useState([]);
  const datee = new Date()
  const showdate = datee.getFullYear() + "/" + (datee.getMonth() + 1) + "/" + datee.getDate();


  useEffect(() => {
    AsyncStorage.getItem("role").then((role) => {
      if (role === "user") {
        setuserflag(true)
      }
      else {
        setuserflag(false)
      }
    })
  }, [])


  useEffect(() => {

    AsyncStorage.getItem("email").then((email) => {
      const coll = collection(db, 'Doctors');
      const q = query(coll, limit(4));

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


  useEffect(() => {

    AsyncStorage.getItem("email").then((email) => {
      const coll = collection(db, 'Appointment');
      const q = query(coll, where("bookdate", '==',showdate));

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
    })
  }, []);


  useEffect(() => {

    AsyncStorage.getItem("email").then((email) => {
      const coll = collection(db, 'Doctors');
      // const q = query(coll, limit(4));

      const unSubscribe = onSnapshot(coll, snapshot => {
        setGetData2(
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



  return (
    <>
      {
        loading ?
          <ActivityIndicator style={{ flex: 1, alignItems: 'center', alignSelf: 'center', justifyContent: 'center' }} size={'large'} />
          :
          userflag ?
            <>
              <View style={tw` h-7 w-80 mt-15 self-center flex-row justify-between items-center`}>
                <Text style={tw`text-base font-bold`}>Top Doctors</Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Yourplan')
                  }}
                >
                  <Text style={tw`text-base text-green-500 font-semibold`}>See All</Text>
                </TouchableOpacity>
              </View>


              <View style={tw`h-60 w-90 justify-center rounded-md`}>
                <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
                  {
                    GetData.map((data, index) => (
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate("Showappoinments", {
                            phone: data.selecteduser.doctorphone,
                            slots: data.selecteduser.slots,
                            usercontrol : true,
                          })
                        }}
                      >
                        <View key={index} style={tw`border ml-3 mr-3 border-gray-300 h-50 w-45 self-center items-center justify-center mt-5 rounded-md`}>
                          <Image
                            style={tw`border h-25 w-25 rounded-full`}
                            source={{ uri: data.selecteduser.profile }}
                          />
                          <Text style={tw`text-base font-bold`}>{data.selecteduser.doctorname}</Text>
                          <Text style={tw`text-base font-light`}>{data.selecteduser.doctortypelabel}</Text>
                          <Text style={tw`text-base font-light`}>{data.selecteduser.doctortimefromlabel} To {data.selecteduser.doctortimetolabel}</Text>
                        </View>
                      </TouchableOpacity>
                    ))
                  }





                </ScrollView>
              </View>

            </>
            :
            <View style={tw` w-80 self-center mt-10 h-190`}>
              <View style={tw`mt-10 h-70 w-80 border-black items-center self-center `}>

                <LottieView
                  style={tw`self-center  w-60 h-60`}
                  source={require('../../Images/Animation - 1722075556252.json')}
                  autoPlay
                  loop={true}
                  speed={0.5}
                />
              </View>

              <View style={tw` items-center justify-around w-80 h-30 self-center flex-row `}>
                <View
                  style={[tw`shadow-xl w-30 h-30 items-center justify-center self-center`, { backgroundColor: '#00B1E7' }]}>
                  <Text style={tw`text-white text-lg font-bold`}>Today Appointment</Text>

                  <Text style={tw`text-lg text-white`}>{GetData1.length} </Text>
                </View>

                <View
                  style={[tw`shadow-xl bg-blue-500 w-30 h-30  items-center justify-center self-center`, { backgroundColor: '#00B1E7' }]}>
                  <Text style={tw`text-white text-lg font-bold`}>My Total {'\n'}Doctors</Text>
                  <Text style={tw`text-lg text-white`}>{GetData2.length}</Text>
                </View>

                {/* <View
                style={[tw`shadow-xl w-25 h-20 items-center justify-center self-center`, { borderTopRightRadius: 30 ,backgroundColor:'#199A8E'}]}>
                <Text style={tw`text-white`}>Today Orders</Text>
                <Text style={tw`text-lg`}>{GetData1.length}</Text>
              </View> */}

              </View>
            </View>
      }
    </>

  );
};

export default Cbids;
