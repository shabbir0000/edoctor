import { View, Text, ScrollView, FlatList, Image, TouchableOpacity, Alert, Linking } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from "twrnc"
import { Dropdown } from 'react-native-element-dropdown'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { collection, deleteDoc, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore'
import { db } from '../../Firebase'
import Screensheader from '../Universal/Screensheader'
import Share from 'react-native-share';

const Category = ({ navigation }) => {


  const [userflag, setuserflag] = useState("")
  const [GetData, setGetData] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem('role').then((role) => {
      setuserflag(role)
      if (role === "admin") {
        getsubadmin()
      }
    })
   
  }, [])

  const shareUserCredentials = (name, email, password, role) => {

    const message = `Hello ${name},\nyour email is\n${email}\nand your password is\n${password}.\nand your Role is\n${role}`;

    const options = {
      title: 'Share User Credentials',
      message: message,
    };

    Share.open(options)
      .then((res) => console.log(res))
      .catch((err) => {
        if (err) console.log(err);
      });
  };


  const getsubadmin = async () => {
    AsyncStorage.getItem("email").then((email) => {
      AsyncStorage.getItem("role").then((role) => {
        console.log("user kya ha cat", userflag);

        const coll = collection(db, 'Profile');
        const q = query(coll, where('role', '==', "subadmin"));
       
        const unSubscribe = onSnapshot(q, snapshot => {
          setGetData(
            snapshot.docs.map(doc => ({
              selecteduser: doc.data(),
            })),
          );
        });
      })
      return () => {
        unSubscribe();
      };
    })
  }

 






  const updatedoc = async (docid, status) => {
    // const slots =  calculateSessionSlots(label,label1,45)
    updateDoc(doc(db, 'Profile', docid), {
      profilestatus: status
    })
      .then(() => {
        console.log('done');
        // setloading(false);
        Alert.alert('Congratulation', `User Has Been Send TO ${status} Mode`, [
          { text: 'OK' },
        ]);
      })
      .catch(error => {
        // setloading(false);
        Alert.alert('this :', error.message);
      });
  };




  return (

    <View style={[tw`flex-1 bg-white `]}>
      {

        userflag === "admin" ?
          <>
            <View style={tw`flex-1`}>
              <Screensheader
                name={"MANAGE HOSPITALS"}
                left={10}
                onPress={() => navigation.goBack()}
              />

              <View
                style={tw`w-70 h-12   flex-row  self-center justify-${userflag === "admin" ? "center" : 'between'}  items-center`}>
                {/* <ScrollView horizontal showsHorizontalScrollIndicator={false}> */}
                {/* card 1 */}


                <TouchableOpacity
                  onPress={() => {

                    navigation.navigate('Addupdatesubadmin', {
                      doctorname: "",
                      doctorphone: "",
                      doctorcity : "",
                      doctoraddress : "",
                      doctoremail : "",
                      doctorpassword : '',
                      mondayy: false,
                      tuesdayy: false,
                      wednesdayy: false,
                      thursdayy: false,
                      fridayy: false,
                      saturdayy: false,
                      sundayy: false,
                      docid: "",
                      profile: "https://firebasestorage.googleapis.com/v0/b/supplysync-3e4b1.appspot.com/o/allfiles%2Fimages.jpg?alt=media&token=0aa9155e-5ebd-4b22-8f77-c9d70d280507",
                      profilestatus : ""
                    });
                  }}
                >
                  <Image
                    source={require("../../Images/plusr.png")}
                    style={tw`w-8 h-8`}
                  />
                </TouchableOpacity>



                {/* </ScrollView> */}
              </View>

              <ScrollView style={tw`mb-5`}  showsVerticalScrollIndicator={false}>

                {
                  GetData.map((data, index) => (
                    <>
                      <TouchableOpacity
                        // key={index}
                      
                      >
                        <View style={[tw`border flex-col justify-between   w-80 h-80  self-center mt-5`, { borderColor: "#00B1E7" }]}>
                          <View style={tw`h-40 items-center self-center w-80`}>
                            <Image
                              style={tw`h-40 w-79 `}
                              resizeMode='cover'
                              // source={{ uri: data.selecteduser.profile }}
                              source={{uri : data.selecteduser.profilephoto}}
                            />
                          </View>
                          <View style={tw`h-40 justify-center w-35 `}>

                            <Text numberOfLines={1} style={tw`font-bold ml-2 w-75 text-xl`}>{data.selecteduser.fullname.toUpperCase()}</Text>
                            <Text numberOfLines={1} style={tw`font-light ml-2 mt-1 w-40 text-gray-400 text-sm`}>{data.selecteduser.city.toUpperCase() }</Text>
                            <Text numberOfLines={1} style={tw`font-light ml-2 mt-1 w-40  text-base`}>{data.selecteduser.profilestatus.toUpperCase()}</Text>





                            <View style={tw` items-center h-10 w-80 justify-around flex-row mt-2`}>

                              <TouchableOpacity
                                onPress={() => (
                                  Linking.openURL(`whatsapp://send?text=Hello\nI Have Query&phone=${data.selecteduser.phone}`)
                                )}
                              >
                                <Image
                                  style={tw`h-6 w-6`}
                                  resizeMode='cover'
                                  source={require("../../Images/whatsapp.png")}
                                />
                              </TouchableOpacity>


                              <TouchableOpacity

                                onPress={() => {
                                  navigation.navigate("Addupdatesubadmin", {
                                    doctorname: data.selecteduser.fullname,
                                    doctorcity: data.selecteduser.city,
                                    doctoraddress: data.selecteduser.address,
                                    doctorphone: data.selecteduser.phone,
                                    doctoremail: data.selecteduser.email,
                                    doctorpassword: data.selecteduser.password,
                                    mondayy: data.selecteduser.monday,
                                    tuesdayy: data.selecteduser.tuesday,
                                    wednesdayy: data.selecteduser.wednesday,
                                    thursdayy: data.selecteduser.thursday,
                                    fridayy: data.selecteduser.friday,
                                    saturdayy: data.selecteduser.saturday,
                                    sundayy: data.selecteduser.sunday,
                                    docid: data.selecteduser.userid,
                                    profile: data.selecteduser.profilephoto,
                                    profilestatus: data.selecteduser.profilestatus,
                                  })
                                }}

                              >
                                <Image
                                  style={tw`h-6 w-6`}
                                  resizeMode='cover'
                                  source={require("../../Images/edit.png")}
                                />
                              </TouchableOpacity>

                              <TouchableOpacity
                                onPress={() => {
                                  Alert.alert('Alert', `You Want TO Send This On ${data.selecteduser.profilestatus === "pending" ? "active" : "pending"} Mode?`, [
                                    {
                                      text: 'No',
                                      onPress: () => console.log('Cancel Pressed'),
                                      style: 'cancel',
                                    },
                                    { text: 'YES', onPress: () => updatedoc(data.selecteduser.userid, data.selecteduser.profilestatus === "pending" ? "active" : "pending") },
                                  ]);

                                }}
                              >
                                <Image
                                  style={tw`h-6 w-6`}
                                  resizeMode='cover'
                                  source={require("../../Images/status-quo.png")}
                                />
                              </TouchableOpacity>


                              <TouchableOpacity
                                onPress={() => {
                                  shareUserCredentials(data.selecteduser.fullname, data.selecteduser.email, data.selecteduser.password, data.selecteduser.role)

                                }}
                              >
                                <Image
                                  style={tw`h-6 w-6`}
                                  resizeMode='cover'
                                  source={require("../../Images/send.png")}
                                />
                              </TouchableOpacity>

                            </View>


                          </View>
                        </View>
                      </TouchableOpacity>
                    </>
                  ))
                }





              </ScrollView>
            </View>


          </>
          :
          userflag === "doctor" ?
            <>
              <View style={tw`justify-center items-center flex-1 `}>
                <Text>Doctor</Text>
              </View>
            </>
            :

            <></>

      }



    </View>


  )
}

export default Category


