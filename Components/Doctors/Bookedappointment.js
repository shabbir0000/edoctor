import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    Image,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import tw from 'twrnc';
import Screensheader from '../../Screens/Universal//Screensheader';
import { db, auth } from '../../Firebase';
import {
    collection,
    onSnapshot,
    query,
    where,
} from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Bookedappointment = ({ navigation }) => {

    const [user, setuser] = useState(null);
    const [loading1, setloading1] = useState(false);
    const [userflag, setuserflag] = useState("");
    const [GetData, setGetData] = useState([])
    const [GetData1, setGetData1] = useState([]);
    const datee = new Date()
    const showdate = datee.getFullYear() + "/" + (datee.getMonth() + 1) + "/" + datee.getDate();

    const [cat, setcat] = useState("Today")


    useEffect(() => {
        AsyncStorage.getItem("email").then((email) => {
            const user = auth.currentUser;
            const coll = collection(db, 'Profile');
            const q = query(coll, where("email", '==', email));
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




    useFocusEffect(
        useCallback(() => {

            AsyncStorage.getItem('email').then((email) => {
                console.log("email :", email);
                setuser(email);
            });

            AsyncStorage.getItem("role").then((role) => {

                setuserflag(role)

            })

            return () => {

            };
        }, []),
    );

    useEffect(() => {
        showtodayappointment()

    }, []);


    const showtodayappointment = async () => {
        console.log("date today", showdate);

        AsyncStorage.getItem("email").then((email) => {
            const coll = collection(db, 'Appointment');
            const q = query(coll, where('doctoremail', '==', email), where('bookdate', '==', showdate));

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
    }

    const showemergency = async () => {
        console.log("date today", showdate);

        AsyncStorage.getItem("email").then((email) => {
            const coll = collection(db, 'Emergency');
            const q = query(coll, where('doctoremail', '==', email), where('todaydate', '==', showdate));

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
    }

    const showallappointment = async () => {
        AsyncStorage.getItem("email").then((email) => {
            const coll = collection(db, 'Appointment');
            const q = query(coll, where('doctoremail', '==', email));

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
    }


    const vrImages = [
        {
            url: "https://vection-cms-prod.s3.eu-central-1.amazonaws.com/Adobe_Stock_506941973_cc825880a8.jpeg",
            text: "Today"
        },
        {
            url: "https://images.inc.com/uploaded_files/image/1920x1080/getty_921019710_413686.jpg",
            text: "All"
        },
        

    ];


    return (
        <>
            {
                loading1 ?

                    <ActivityIndicator
                        style={tw`items-center flex-1 self-center justify-center`}
                        size="large"
                        color="#199A8E"
                    />
                    :


                    <>
                        <View style={tw` bg-white flex-1`}>
                            <Screensheader
                                name={'MY APPOINMENTS'}
                                left={10}
                                onPress={() => navigation.goBack()}
                            />

                            <View
                                style={tw`w-85 h-12   flex-row  self-center  items-center`}>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    {/* card 1 */}

                                    <>


                                        {vrImages?.map((item, index) => (
                                            <TouchableOpacity
                                                key={index}
                                                onPress={() => {
                                                    // setloading(true)
                                                    // getcatvideo(item.id)

                                                    if (item.text === "All") {
                                                        showallappointment()
                                                        setcat(item.text)
                                                    } else {

                                                        showtodayappointment()
                                                        setcat(item.text)
                                                    } 

                                                }}>
                                                <View style={[tw`bg-${cat === item.text ? 'blue-400' : 'white'} h-10 w-30 ml-10 border flex-row items-center justify-evenly rounded-3xl`, { borderRadius: 50, borderColor: '#00B1E7' }]}>
                                                    {/* <Image style={tw`h-5 w-5 rounded-full`} source={{ uri: item.url }} /> */}
                                                    <Text numberOfLines={1} style={tw`text-center text-${cat === item.text ? "white" : "black"} w-20`}>{item.text}</Text>
                                                </View>
                                            </TouchableOpacity>

                                        ))
                                        }
                                    </>


                                </ScrollView>
                            </View>

                            <ScrollView style={tw`flex-1 mb-5 self-center`} showsVerticalScrollIndicator={false}>

                                {
                                    GetData.map((data, index) => (
                                        <TouchableOpacity
                                            disabled={true}
                                            key={index}
                                        >
                                            <View style={[tw`border flex-col justify-center  items-center w-80 h-${cat === "Emergency ? '40' : '45'"} rounded-md self-center mt-5`, { borderColor: "#00B1E7" }]}>


                                                <View key={index} style={[tw` flex-row justify-around  items-center  w-80 h-35  self-center `]}>


                                                    <Image
                                                        style={tw`h-30 w-35  rounded-md`}
                                                        resizeMode='contain'
                                                        source={require("../../Images/user.png")}
                                                    />
                                                    <View style={tw`w-40 h-25 justify-start  items-start `}>


                                                        <Text numberOfLines={1} style={tw`font-bold w-30 text-xl`}>{data.selecteduser.username}</Text>
                                                        <Text numberOfLines={1} style={tw`font-light mt-2 w-30 text-base`}>{data.selecteduser.phone}</Text>
                                                        <Text numberOfLines={1} style={tw`font-light  text-base`}>{data.selecteduser.bookdate}</Text>
                                                        <Text numberOfLines={1} style={tw`font-light   text-sm`}>{data.selecteduser.bookstime} To {data.selecteduser.booketime} </Text>

                                                    </View>


                                                </View>



                                            </View>
                                        </TouchableOpacity>
                                    ))
                                }


                            </ScrollView>
                        </View>
                    </>



            }
        </>
    );
};

export default Bookedappointment;

var styles = StyleSheet.create({
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
});
