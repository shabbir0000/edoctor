import { View, Text, Image, Alert, TouchableOpacity, Linking } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from "twrnc"
import LinearGradient from 'react-native-linear-gradient';
import { useIsFocused } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { app, db } from '../../Firebase';
// import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';



const Showbalance = () => {


    const auth = getAuth(app);
    const [GetData, setGetData] = useState([]);
    const [GetData1, setGetData1] = useState([]);
    const [userflag, setuserflag] = useState(true);
    const date = new Date().toDateString();

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
        const user = auth.currentUser;
        const coll = collection(db, 'Company');

        const unSubscribe = onSnapshot(coll, snapshot => {
            setGetData(
                snapshot.docs.map(doc => ({
                    selecteduser: doc.data(),
                })),
            );
        });
        return () => {
            unSubscribe();
        };
    }, []);

    useEffect(() => {
        const user = auth.currentUser;
        const coll = collection(db, 'Profile');

        const unSubscribe = onSnapshot(coll, snapshot => {
            setGetData1(
                snapshot.docs.map(doc => ({
                    selecteduser: doc.data(),
                })),
            );
        });
        return () => {
            unSubscribe();
        };
    }, []);


    return (
        <>
            <LinearGradient colors={['#00B1E7', '#00B1E7']} style={tw`top-10 flex flex-row items-center justify-around self-center h-35 w-85 rounded-xl`} >


                {/* // balance dev */}
                <View style={tw`w-50 left-3`} >
                    <Text
                        numberOfLines={2}
                        style={tw`text-xl font-bold  text-gray-100`}>
                        {`Find Your Desire`}

                    </Text>
                    <Text
                        numberOfLines={4}
                        style={tw`text-xl font-bold  text-gray-100`}>
                        {`Health Solution \nIn Deefliz`}
                    </Text>
                </View>


                {/* graph  */}
                <View style={tw` h-30 w-30  justify-center self-center items-center `}>
                    <Image
                        style={tw`h-29 w-30 rounded-2xl `}
                        resizeMode='contain'
                        source={require("../../Images/help.png")}
                    />
                </View>


            </LinearGradient>

            {
                userflag ?
                    <LinearGradient colors={['#00B1E7', '#00B1E7']} style={tw`top-10 mt-5 flex flex-row items-center justify-around self-center h-35 w-85 rounded-xl`} >


                        {/* // balance dev */}
                        <View style={tw`w-50 left-3`} >
                            <Text
                                numberOfLines={2}
                                style={tw`text-xl font-bold  text-gray-100`}>
                                {`Early Protection For`}

                            </Text>
                            <Text
                                numberOfLines={4}
                                style={tw`text-xl font-bold  text-gray-100`}>
                                {`Your Family Health`}
                            </Text>

                            <TouchableOpacity 
                             onPress={() => (
                                Linking.openURL(`whatsapp://send?text=Hello\nI Have Query&phone=${"03342788001"}`)
                              )}
                            >
                                <View style={[tw` mt-2 w-30 h-7 items-center justify-center rounded-2xl`,{backgroundColor:"#0B4064"}]}>
                                    <Text style={tw`text-white`}>Chat With Us</Text>
                                </View>
                            </TouchableOpacity>
                        </View>


                        {/* graph  */}
                        <View style={tw` h-30 w-30  justify-center self-center items-center `}>
                            <Image
                                style={tw`h-29 w-30 rounded-2xl `}
                                resizeMode='contain'
                                source={require("../../Images/Image.png")}
                            />
                        </View>


                    </LinearGradient>
                    :
                    <></>
            }


        </>
    )
}

export default Showbalance