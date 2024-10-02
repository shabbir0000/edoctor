import { View, Text, Image, TouchableOpacity, ActivityIndicator, TextInput, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from "twrnc"
import Screensheader from '../Universal/Screensheader'
import { ScrollView } from 'react-native'
import { FAB } from '@rneui/base'
import Modal from "react-native-modal";
import Toast from 'react-native-toast-message'
import { collection, deleteDoc, doc, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import { db } from '../../Firebase'
import { showToast } from '../Universal/Input'
import AsyncStorage from '@react-native-async-storage/async-storage'
import uuid from 'react-native-uuid';

const Addaccounts = ({ navigation }) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [visible, setVisible] = React.useState(true);
    const [mname, setmname] = React.useState("");
    const [comapny, setcompany] = React.useState("");
    const [comapnyv, setcompanyv] = React.useState("");
    const [comapnyacc, setcompanyacc] = React.useState("");
    const [email, setemail] = React.useState("");
    const [catid, setcatid] = useState("")

    const [loading, setloading] = React.useState(false);
    const userid = uuid.v4();
    const toggleModal = () => {
        setModalVisible(!isModalVisible);

    };

    const [Getdata, setGetdata] = React.useState([]);

    const [Getdata1, setGetdata1] = React.useState([]);
    const [userflag, setuserflag] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem('role').then((role) => {
           
                setuserflag(role)
            
        })
    }, [])


    useEffect(() => {
        console.log("chala");
        AsyncStorage.getItem("email").then((email) => {
            console.log("chala email :", email);
            setemail(email)
            // const user = auth.currentUser;
            const coll = collection(db, 'Accounts');
            const q = query(coll, where('email', '==', email));

            const unSubscribe = onSnapshot(q, snapshot => {
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


    useEffect(() => {
        console.log("chala");
        AsyncStorage.getItem("email").then((email) => {
            console.log("chala email :", email);
            setemail(email)
            // const user = auth.currentUser;
            const coll = collection(db, 'Profile');
            const q = query(coll, where('email', '==', email));

            const unSubscribe = onSnapshot(q, snapshot => {
                setGetdata1(
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


    const addcat = async () => {
        setloading(true);
        setDoc(doc(db, 'Accounts', userid), {
            companyname: Getdata1[0].selecteduser.fullname,
            accountname: comapnyacc,
            bankname: comapnyv,
            accountnum: comapny,
            email : email,
            userid,
            timestamp: serverTimestamp(),
        })
            .then(() => {
                setloading(false)
                toggleModal()
                console.log('done');
                setcompany("")
                setcompanyv("")
                setcompanyacc("")

            })
            .catch(error => {
                toggleModal()
                setloading(false)
                // console.log(error);
                Alert.alert('this :', error.message);
            });
    }



    const updateCat = async () => {
        if (!comapny || !catid || !comapnyv || !comapnyacc) {
            showToast('error', 'Error', "Please Fill The Product Field ", true, 2000);
        } else {
            setloading(true);
            updateDoc(doc(db, 'Accounts', catid), {
                companyname: Getdata1[0].selecteduser.fullname,
                accountname: comapnyacc,
                bankname: comapnyv,
                accountnum: comapny,
                email : email,
                userid : catid,
                timestamp: serverTimestamp(),
            })
                .then(() => {
                    setloading(false);
                    toggleModal();
                    console.log('update done');
                    setcompany("");
                    setcompanyv("")
                    setcompanyacc("")
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
        deleteDoc(doc(db, 'Accounts', docId))
            .then(() => {
                // setLoading(false);
                console.log('delete done');
            })
            .catch(error => {
                // setLoading(false);
                Alert.alert('Error:', error.message);
            });
    };


    return (
        <View style={[tw`flex-1`,{backgroundColor:"#ffffff"}]}>
            <Screensheader name={"MANAGE ACCOUNTS"} left={10}
                onPress={() => {
                    navigation.navigate('Home')
                }}
            />

            <ScrollView >
                {
                    Getdata.map((data, index) => (
                        <View style={[tw` h-40 mb-5 rounded-2xl w-80 flex-row justify-${userflag === "user" ? 'center' : 'between'} self-center`,{backgroundColor:"#ffffff"}]}>
                            <View style={tw`border justify-center border-blue-500 h-40 w-65 rounded-l-2xl`}>
                                <Text style={tw`ml-3 text-lg font-semibold`}>Account Title:</Text>
                                <Text numberOfLines={1} style={tw`ml-3 text-base font-light`}>{data.selecteduser.accountname}</Text>

                                <Text style={tw`ml-3 text-lg font-semibold`}>Bank Name:</Text>
                                <Text numberOfLines={1} style={tw`ml-3 text-base font-light`}>{data.selecteduser.bankname}</Text>

                                <Text style={tw`ml-3 text-lg font-semibold`}>Account No:</Text>
                                <Text numberOfLines={1} style={tw`ml-3 text-base font-light`}>{data.selecteduser.accountnum}</Text>
                            </View>
                            {
                                userflag === "user" ?
                                    <></>
                                    :
                                    <View style={tw`border border-blue-500 justify-around items-center flex-col h-40 w-15 rounded-r-2xl `}>

                                        <TouchableOpacity
                                            onPress={() => {
                                                toggleModal(),
                                                    setmname("UPDATE ACCOUNTS")
                                                setcompanyv(data.selecteduser.bankname.toUpperCase());
                                                setcompany(data.selecteduser.accountnum.toUpperCase());
                                                setcompanyacc(data.selecteduser.accountname.toUpperCase());
                                                setcatid(data.selecteduser.userid);
                                                // setfiledata1(item.even.selecteduser.imglink)
                                                // setuploadedurl1(item.even.selecteduser.imglink)

                                            }
                                            }
                                        >
                                            <Image
                                                style={tw`h-8 w-8 `}
                                                source={require("../../Images/edit.png")}
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => {
                                                Alert.alert('Alert', 'Are You Sure You Want To Delete', [
                                                    {
                                                        text: 'NO',
                                                        onPress: () => console.log('Cancel Pressed'),
                                                        style: 'cancel',
                                                    },
                                                    { text: 'YES', onPress: () => deleteCat(data.selecteduser.userid) },
                                                ]);

                                            }}
                                        >
                                            <Image
                                                style={tw`h-8 w-8 `}
                                                source={require("../../Images/delete.png")}
                                            />
                                        </TouchableOpacity>
                                    </View>
                            }

                        </View>
                    ))
                }


            </ScrollView>

            {

                userflag === "user" ?
                    <></>
                    :
                    <FAB
                        onPress={() => {
                            toggleModal(),
                                setmname("ADD ACCOUNTS")

                        }
                        }
                        style={tw`justify-end w-80 -top-10`}
                        visible={visible}
                        icon={{ name: 'add', color: 'white' }}
                        color="#00B1E7"
                    />
            }



            <Modal

                style={tw`w-80 self-center rounded-t-lg`}
                onDismiss={toggleModal}
                animationIn={'bounceInUp'}
                isVisible={isModalVisible}>
                <View style={{ borderRadius: 50, backgroundColor: '#ffffff' }}>
                    <View style={[{ height: 350, backgroundColor: '#ffffff' }, tw`rounded-xl`]}>

                        <TouchableOpacity
                            onPress={() => {
                                toggleModal()
                                setcompany("")
                                setcompanyv("")
                                setcompanyacc("")
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

                        <Text style={tw`text-center text-lg font-bold`}>{mname}</Text>


                        <View style={tw`mt-2 flex-col h-60 justify-evenly`}>

                            <TextInput
                                value={comapnyacc}
                                onChangeText={(value) => setcompanyacc(value)}
                                style={tw`pl-3 h-10 w-60  self-center rounded-lg border`}
                                placeholder='Enter Account Title'
                            />

                            <TextInput
                                value={comapnyv}
                                onChangeText={(value) => setcompanyv(value)}
                                style={tw`pl-3 h-10 w-60  self-center rounded-lg border`}
                                placeholder='Enter Bank Name'
                            />

                            <TextInput
                                keyboardType='number-pad'
                                value={comapny}
                                onChangeText={(value) => setcompany(value)}
                                style={tw`pl-3 h-10 w-60  self-center rounded-lg border`}
                                placeholder='Enter Account Number'
                            />

                            {
                                loading ?
                                    <ActivityIndicator style={tw`mt-5`} size="large" color="#00BF62" />
                                    :
                                    <View >
                                        <TouchableOpacity
                                            onPress={() => {

                                                mname === "UPDATE ACCOUNTS" ?
                                                    updateCat()
                                                    :
                                                    addcat()

                                            }}
                                        >
                                            <View style={[{ alignItems: 'center', justifyContent: 'center', alignSelf: 'center', height: 40, width: 200, backgroundColor: '#00B1E7' }, tw` rounded-lg`]}>
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




export default Addaccounts