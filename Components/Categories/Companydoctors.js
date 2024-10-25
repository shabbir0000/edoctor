import { View, Text, FlatList, ScrollView, Image, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import Screensheader from '../../Screens/Universal/Screensheader'
import tw from "twrnc"
import Modal from "react-native-modal";
import { FAB } from '@rneui/themed';
import { collection, deleteDoc, doc, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { app, auth, db } from '../../Firebase';
import { getAuth } from 'firebase/auth';
import uuid from 'react-native-uuid';
import { showToast } from '../../Screens/Universal/Input';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Companydoctors = ({ navigation }) => {

  const [categories, setCategories] = useState([
    'daal',
    'chawal',
    'gheee',
    'ata',
    'chini',
    'namak',
    'mix item',
    'biscuit',


  ]);

  const [Getdata, setGetdata] = React.useState([]);
  const user = getAuth(app)



  useEffect(() => {
    console.log("chala");
    AsyncStorage.getItem("email").then((email) => {
      console.log("chala email :", email);
      const user = auth.currentUser;
      const coll = collection(db, 'Doctorssp');
      // const q = query(coll, where('email', '==', email));

      const unSubscribe = onSnapshot(coll, snapshot => {
        setGetdata(
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
    <View style={[tw`flex-1`,{backgroundColor:"#ffffff"}]}>
      <Screensheader name={"ALL SPECIALIST"} left={15}
        onPress={() => {
          navigation.goBack()
        }}
      />
      <EvenOddColumns data={Getdata} navigation={navigation} />




    </View>
  )
}

export default Companydoctors


const EvenOddColumns = ({ data, navigation }) => {

  const userid = uuid.v4();
  const user = getAuth(app)
  const [isModalVisible, setModalVisible] = useState(false);
  const [visible, setVisible] = React.useState(true);
  const [mname, setmname] = React.useState("");
  const [comapny, setcompany] = React.useState("");
  const [userflag, setuserflag] = React.useState(false);
  const [catid, setcatid] = React.useState("");

  const [loading, setloading] = React.useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  // Filter even and odd elements
  const evenElements = data.filter((_, index) => index % 2 === 0);
  const oddElements = data.filter((_, index) => index % 2 !== 0);

  // Combine even and odd elements into one array of objects with type 'even' or 'odd'
  const combinedData = evenElements.map((item, index) => ({
    even: item,
    odd: oddElements[index],
  }));

  useEffect(() => {
    AsyncStorage.getItem('role').then((role) => {
      if (role === "employee") {
        setuserflag(true)
      }
      else {
        setuserflag(false)
      }
    })
  }, [])

  const addcat = async () => {
    if (!comapny) {
      showToast('error', 'Error', "Please Fill The Company Field", true, 2000)
    }
    else {
      setloading(true);
      setDoc(doc(db, 'Doctorssp', userid), {
        company: comapny.trim().toLowerCase(),
        email: user.currentUser.email,
        userid,
        timestamp: serverTimestamp(),
      })
        .then(() => {
          setloading(false)
          toggleModal()
          console.log('done');
          setcompany("")
        })
        .catch(error => {
          toggleModal()
          setloading(false)
          // console.log(error);
          Alert.alert('this :', error.message);
        });
    }
  }


  const updateCat = async () => {
    if (!comapny || !catid) {
      showToast('error', 'Error', "Please Fill The Cat Field and select a category to update", true, 2000);
    } else {
      setloading(true);
      updateDoc(doc(db, 'Doctorssp', catid), {
        company: comapny.trim().toLowerCase(),
        timestamp: serverTimestamp(),
      })
        .then(() => {
          setloading(false);
          toggleModal();
          console.log('update done');
          setcompany("");
          // setCurrentDocId(null); // Reset the currentDocId after update
        })
        .catch(error => {
          toggleModal();
          setloading(false);
          Alert.alert('Error:', error.message);
        });
    }
  };


  const deleteCat = async (docId) => {
    // setloading(true);
    deleteDoc(doc(db, 'Doctorssp', docId))
      .then(() => {
        // setLoading(false);
        console.log('delete done');
      })
      .catch(error => {
        // setLoading(false);
        Alert.alert('Error:', error.message);
      });
  };

  // Render an item
  const renderItem = ({ item }) => (
    <>
      <ScrollView showsHorizontalScrollIndicator={false}>

        <View style={tw`h-45 flex-row justify-around mt-5`}>
          <TouchableOpacity
            // onPress={() => {
            //   navigation.navigate("Companyoption", {
            //     companyname: item.even.selecteduser.company
            //   })
            // }}
          >
            <View style={[tw`h-40 w-40 items-center justify-${userflag ? 'around' : 'between'} rounded-2xl border border-blue-500  shadow-lg`,{backgroundColor:"#ffffff"}]}>
              {
                userflag ?
                  <></>
                  :
                  <View style={tw`flex-row w-35 mt-2 justify-between`}>
                    <TouchableOpacity
                      onPress={() => {
                        toggleModal(),
                          setmname("UPDATE SPECIALIST")
                        setcompany(item.even.selecteduser.company.toUpperCase());
                        setcatid(item.even.selecteduser.userid);

                      }
                      }
                    >
                      <Image
                        source={require('../../Images/edit.png')}
                        style={tw`h-5 w-5`}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        Alert.alert('Alert', 'are you sure you want to delete this ?', [
                          {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'NO',
                          },
                          { text: 'YES', onPress: () => deleteCat(item.even.selecteduser.userid) },
                        ]);
                        // deleteCat(item.even.selecteduser.userid)
                      }}
                    >
                      <Image
                        source={require('../../Images/delete.png')}
                        style={tw`h-5 w-5`}
                      />
                    </TouchableOpacity>
                  </View>
              }

              <Image
                source={require('../../Images/doctorsp.png')}
                style={tw`h-20 w-20`}
              />
              <Text
                numberOfLines={2}
                style={[{
                  fontSize: 14,

                  textAlign: 'center',
                  margin: 5,
                }, tw` w-35 h-10 `]}>
                {item.even.selecteduser.company.toUpperCase()}
              </Text>
            </View>
          </TouchableOpacity>
          {item.odd && (
            <TouchableOpacity
              // onPress={() => {
              //   navigation.navigate("Companyoption", {
              //     companyname: item.odd.selecteduser.company
              //   })
              // }}
            >
              <View style={[tw`h-40 w-40 items-center justify-${userflag ? 'around' : 'between'} border border-blue-500 rounded-2xl shadow-lg`,{backgroundColor:"#ffffff"}]}>

                {
                  userflag ?
                    <></>
                    :
                    <View style={tw`flex-row w-35 mt-2 justify-between`}>
                      <TouchableOpacity
                        onPress={() => {
                          toggleModal(),
                            setmname("UPDATE SPECIALIST")
                          setcompany(item.odd.selecteduser.company.toUpperCase());
                          setcatid(item.odd.selecteduser.userid);
                        }
                        }
                      >
                        <Image
                          source={require('../../Images/edit.png')}
                          style={tw`h-5 w-5`}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          Alert.alert('Alert', 'are you sure you want to delete this ?', [
                            {
                              text: 'Cancel',
                              onPress: () => console.log('Cancel Pressed'),
                              style: 'No',
                            },
                            { text: 'Yes', onPress: () => deleteCat(item.odd.selecteduser.userid) },
                          ]);
                          // deleteCat(item.odd.selecteduser.userid)
                        }}
                      >
                        <Image
                          source={require('../../Images/delete.png')}
                          style={tw`h-5 w-5`}
                        />
                      </TouchableOpacity>
                    </View>

                }


                <Image
                  source={require('../../Images/doctorsp.png')}
                  style={tw`h-20 w-20`}
                />
                <Text
                  numberOfLines={2}
                  style={[{
                    fontSize: 14,
                    textAlign: 'center',
                    margin: 5,
                  }, tw` w-35  h-10 `]}>
                  {item.odd.selecteduser.company.toUpperCase()}
                </Text>
              </View>
            </TouchableOpacity>
          )}

        </View>
      </ScrollView>

    </>
  );

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
        data={combinedData}
        keyExtractor={(item, index) => `${index}`}
        renderItem={renderItem}
      />

      {
        userflag ?
          <></>
          :
          <FAB
            onPress={() => {
              toggleModal(),
                setmname("ADD SPECIALIST")

            }
            }
            style={tw`justify-end w-80 -top-10`}
            visible={visible}
            icon={{ name: 'add', color: 'white' }}
            color="blue"
          />
      }


      <Modal

        style={tw`w-80 self-center `}
        onDismiss={toggleModal}
        animationIn={'bounceInUp'}
        isVisible={isModalVisible}>
        <View style={{ borderRadius: 50, backgroundColor: '#ffffff' }}>
          <View style={[{ height: 300, backgroundColor: '#ffffff' }]}>

            <TouchableOpacity
              onPress={() => {
                toggleModal()
                setcompany("")
                // navigation.goBack()
              }}
            >
              <View
                style={tw`items-end self-center justify-end w-310px`}>
                <Image
                  style={{ height: 30, width: 30 }}
                  source={require('../../Images/close.png')}
                />
              </View>
            </TouchableOpacity>

            <View style={tw`mt-10 flex-col  h-30 justify-around`}>

              <View style={tw`self-center`} >
                <Text style={[tw`text-center font-normal text-lg`, { color: '#000000' }]}>
                  {mname}
                </Text>
              </View>

              <TextInput
                value={comapny}
                onChangeText={(value) => setcompany(value)}
                style={tw`pl-3 h-10 w-60 mt-15 self-center  border`}
                placeholder='Enter SPECIALITY'
              />

              {
                loading ?
                  <ActivityIndicator style={tw`mt-5`} size="large" color="#00BF62" />
                  :
                  <View style={tw`mt-10`}>
                    <TouchableOpacity
                      onPress={() => {
                        mname === "ADD SPECIALIST" ?
                          addcat()
                          :
                          updateCat()
                      }}
                    >
                      <View style={[{ marginTop: 40, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', height: 40, width: 200, backgroundColor: '#0B4064' }]}>
                        <Text style={{ textAlign: 'center', color: 'white' }}>{mname}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
              }

            </View>
          </View>

          <Toast />
        </View>
      </Modal>



    </View>
  )
}