import {
  View,
  Text,
  FlatList,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Screensheader from '../../Screens/Universal/Screensheader';
import tw from 'twrnc';
import Modal from 'react-native-modal';
import FilePicker from 'react-native-document-picker';
import {FAB} from '@rneui/themed';
import {Dropdown} from 'react-native-element-dropdown';
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
import {app, auth, db} from '../../Firebase';
import {getAuth} from 'firebase/auth';
import uuid from 'react-native-uuid';
import {showToast} from '../../Screens/Universal/Input';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '@react-native-firebase/storage';

const Companypromotion = ({navigation}) => {
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
  const user = getAuth(app);

  useEffect(() => {
    console.log('chala');
    AsyncStorage.getItem('email').then(email => {
      console.log('chala email :', email);
      const user = auth.currentUser;
      const coll = collection(db, 'Companypromotion');
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
    });
  }, []);

  return (
    <View style={[tw`flex-1`, {backgroundColor: '#ffffff'}]}>
      <Screensheader
        name={`ALL PROMOTION`}
        left={15}
        onPress={() => {
          navigation.goBack();
        }}
      />
      <EvenOddColumns data={Getdata} navigation={navigation} />
    </View>
  );
};

export default Companypromotion;

const EvenOddColumns = ({data, navigation}) => {
  const userid = uuid.v4();
  const user = getAuth(app);
  const [isModalVisible, setModalVisible] = useState(false);
  const [visible, setVisible] = React.useState(true);
  const [mname, setmname] = React.useState('');
  const [comapny, setcompany] = React.useState('');
  const [userflag, setuserflag] = React.useState(false);
  const [catid, setcatid] = React.useState('');

  const [loading, setloading] = React.useState(false);
  const [imglink1, setimglink1] = useState(null);
  const [name1, setimgname1] = useState(null);
  const [type1, setimgtype1] = useState(null);
  const [filedata1, setfiledata1] = useState(null);

  const [value2, setValue2] = useState(null);
  const [label2, setlabel2] = useState(null);
  const [isFocus2, setIsFocus2] = useState(false);
  const [GetData1, setGetData1] = useState([]);

  useEffect(() => {
    const coll = collection(db, 'Doctorssp');

    const unSubscribe = onSnapshot(coll, snapshot => {
      setGetData1(
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
    AsyncStorage.getItem('role').then(role => {
      if (role === 'employee') {
        setuserflag(true);
      } else {
        setuserflag(false);
      }
    });
  }, []);

  const uploadfile = async () => {
    if (!imglink1 ) {
      showToast(
        'error',
        'Error',
        'Please Fill All The Feild First',
        true,
        3000,
      );
    } else {
      try {
        setloading(true);
        const reference = storage().ref(`allfiles/${name1}`);
        await reference.putFile(imglink1);
        const url = await storage().ref(`allfiles/${name1}`).getDownloadURL();
        console.log('your file is locating :', url);
        addcat(url);
      } catch (error) {
        setloading(false);
        console.log('Error :', error);
      }
    }
  };

  const addcat = async url => {
    if (!url) {
      showToast('error', 'Error', 'Please Fill The Company Field', true, 2000);
    } else {
      setloading(true);
      setDoc(doc(db, 'Companypromotion', userid), {
        // company: comapny.trim().toLowerCase(),
        email: user.currentUser.email,
        userid,
        timestamp: serverTimestamp(),
        img: url,
        // catl: label2,
        // catv: value2,
      })
        .then(() => {
          setloading(false);
          toggleModal();
          console.log('done');
          setcompany('');
        })
        .catch(error => {
          toggleModal();
          setloading(false);
          // console.log(error);
          Alert.alert('this :', error.message);
        });
    }
  };

  const uploadupdatefile = async () => {
    if (filedata1.startsWith('file://') || filedata1.startsWith('content://')) {
      setloading(true);
      const reference = storage().ref(`allfiles/${name1}`);
      await reference.putFile(imglink1);
      const url = await storage().ref(`allfiles/${name1}`).getDownloadURL();
      console.log('your file is locating :', url);
      updateCat(url);
    } else {
      try {
        // showModal;
        setloading(true);
        updateCat(filedata1);
      } catch (error) {
        // showModal;
        setloading(false);
        console.log('Error :', error);
      }
    }
  };

  const updateCat = async url => {
    if (!catid) {
      showToast(
        'error',
        'Error',
        'Please Fill The Cat Field and select a category to update',
        true,
        2000,
      );
    } else {
      setloading(true);
      updateDoc(doc(db, 'Companypromotion', catid), {
        // company: comapny.trim().toLowerCase(),
        timestamp: serverTimestamp(),
        img: url,
      //  catl: label2,
        // catv: value2,
      })
        .then(() => {
          setloading(false);
          toggleModal();
          console.log('update done');
          setcompany('');

          // setCurrentDocId(null); // Reset the currentDocId after update
        })
        .catch(error => {
          toggleModal();
          setloading(false);
          Alert.alert('Error:', error.message);
        });
    }
  };

  const deleteCat = async docId => {
    // setloading(true);
    deleteDoc(doc(db, 'Companysymptoms', docId))
    // Companypromotion
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
  const renderItem = ({item}) => (
    <>
      <ScrollView showsHorizontalScrollIndicator={false}>
        <View style={tw`h-65 flex-row justify-around mt-5`}>
        
            <View
              style={[
                tw`h-60 w-80 items-center justify-around rounded-2xl border border-blue-500  shadow-lg`,
                {backgroundColor: '#ffffff'},
              ]}>
              {userflag ? (
                <></>
              ) : (
                <View style={tw`flex-row w-75 mt-2 justify-between`}>
                  <TouchableOpacity
                    onPress={() => {
                      toggleModal(), setmname('UPDATE PROMOTION');
                      // setcompany(item.selecteduser.company.toUpperCase());
                      setcatid(item.selecteduser.userid);
                      setfiledata1(item.selecteduser.img);
                      // setlabel2(item.selecteduser.catl);
                      // setValue2(item.selecteduser.catv);
                    }}>
                    <Image
                      source={require('../../Images/edit.png')}
                      style={tw`h-5 w-5`}
                      
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert(
                        'Alert',
                        'are you sure you want to delete this ?',
                        [
                          {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'NO',
                          },
                          {
                            text: 'YES',
                            onPress: () =>
                              deleteCat(item.selecteduser.userid),
                          },
                        ],
                      );
                      // deleteCat(item.even.selecteduser.userid)
                    }}>
                    <Image
                      source={require('../../Images/delete.png')}
                      style={tw`h-5 w-5`}
                    />
                  </TouchableOpacity>
                </View>
              )}

              <Image
                source={{uri: item.selecteduser.img}}
                style={tw`h-50 w-75`}
                resizeMode='contain'
              />
             
            </View>
   
          
        </View>
      </ScrollView>
    </>
  );

  return (
    <View style={{flex: 1, padding: 10}}>
      <FlatList
        data={data}
        keyExtractor={(item, index) => `${index}`}
        renderItem={renderItem}
      />

      {userflag ? (
        <></>
      ) : (
        <FAB
          onPress={() => {
            toggleModal(),
              setfiledata1(null),
              setValue2(null),
              setmname('ADD SYMPTOMS');
          }}
          style={tw`justify-end w-80 -top-10`}
          visible={visible}
          icon={{name: 'add', color: 'white'}}
          color="blue"
        />
      )}

      <Modal
        style={tw`w-80 self-center `}
        onDismiss={toggleModal}
        animationIn={'bounceInUp'}
        isVisible={isModalVisible}>
        <View style={{borderRadius: 50, backgroundColor: '#ffffff'}}>
          <View style={[{height: 350, backgroundColor: '#ffffff'}]}>
            <TouchableOpacity
              onPress={() => {
                toggleModal();
                setcompany('');
                // navigation.goBack()
              }}>
              <View style={tw`items-end  self-center justify-end w-310px`}>
                <Image
                  style={{height: 30, width: 30}}
                  source={require('../../Images/close.png')}
                />
              </View>
            </TouchableOpacity>

            <View
              style={tw` flex-col items-center self-center  h-70 `}>
              <TouchableOpacity onPress={() => choosefileimg()}>
                <View
                  style={tw`  h-55 border-2 mt-10 w-75 items-center border-dotted`}>
                  {filedata1 && (
                    <Image
                      source={{
                        uri: filedata1,
                      }}
                      resizeMode="contain"
                      style={tw`h-54 w-74 `}
                    />
                  )}
                </View>
              </TouchableOpacity>

              {/* <View style={tw`self-center`}>
                <Text
                  style={[
                    tw`text-center font-normal text-lg`,
                    {color: '#000000'},
                  ]}>
                  {mname}
                </Text>
              </View> */}

             

           

              {loading ? (
                <ActivityIndicator
                  style={tw`mt-3`}
                  size="large"
                  color="#00BF62"
                />
              ) : (
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      mname === 'ADD SYMPTOMS'
                        ? uploadfile()
                        : uploadupdatefile();
                    }}>
                    <View
                      style={[
                        {
                          marginTop: 10,
                          alignItems: 'center',
                          justifyContent: 'center',
                          alignSelf: 'center',
                          height: 40,
                          width: 200,
                          backgroundColor: '#0B4064',
                        },
                      ]}>
                      <Text style={{textAlign: 'center', color: 'white'}}>
                        {mname}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          <Toast />
        </View>
      </Modal>
    </View>
  );
};
