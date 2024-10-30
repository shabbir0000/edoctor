import { View, Text, ScrollView, FlatList, Image, TouchableOpacity, Alert, Linking } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import tw from "twrnc"
import { Dropdown } from 'react-native-element-dropdown'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { collection, deleteDoc, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore'
import { db } from '../../Firebase'
import Screensheader from '../Universal/Screensheader'
import Share from 'react-native-share';
import { AppContext } from '../../AppContext'
import { useFocusEffect } from '@react-navigation/native'

const Allhospitals = ({ navigation }) => {


    const [userflag, setuserflag] = useState("")
    const [GetData, setGetData] = useState([]);
    const {cityy} =
    useContext(AppContext);

    useFocusEffect(
        useCallback(() => {
          AsyncStorage.getItem('role').then((role) => {
            setuserflag(role);
            getsubadmin();
          });
        }, [cityy])
      );




    const getsubadmin = async () => {
        // AsyncStorage.getItem("email").then((email) => {
        //     AsyncStorage.getItem("city").then((city) => {
                const allhospital = async (city)=>{
                console.log("user kya ha cat", userflag);

                const coll = collection(db, 'Profile');
                const q = query(coll, where('role', '==', "subadmin"), where('cityl', '==', city));

                const unSubscribe = onSnapshot(q, snapshot => {
                    setGetData(
                        snapshot.docs.map(doc => ({
                            selecteduser: doc.data(),
                        })),
                    );
                });
            }
            allhospital(cityy)
            // })
            return () => {
                unSubscribe();
            };
        
        // })
    }







    return (

        <View style={[tw`flex-1 bg-white `]}>



            <>
                <View style={tw`flex-1`}>
                    <Screensheader
                        name={"All HOSPITALS"}
                        left={15}
                        onPress={() => navigation.goBack()}
                    />



                    <ScrollView style={tw`mb-5`} showsVerticalScrollIndicator={false}>

                        {
                            GetData.map((data, index) => (
                                <>
                                    <TouchableOpacity
                                        // key={index}
                                        onPress={() => {
                                            navigation.navigate("Hospitaldetail", {
                                                phone: data.selecteduser.phone,
                                                name: data.selecteduser.fullname,
                                                email: data.selecteduser.email
                                            })
                                        }}
                                    >
                                        <View style={[tw`border flex-col justify-between   w-80 h-60  self-center mt-5`, { borderColor: "#00B1E7" }]}>
                                            <View style={tw`h-40 items-center self-center w-80`}>
                                                <Image
                                                    style={tw`h-40 w-79 `}
                                                    resizeMode='cover'
                                                    // source={{ uri: data.selecteduser.profile }}
                                                    source={{ uri: data.selecteduser.profilephoto }}
                                                />
                                            </View>
                                            <View style={tw`h-20 justify-center w-35 `}>

                                                <Text numberOfLines={1} style={tw`font-bold ml-2 w-75 text-xl`}>{data.selecteduser.fullname.toUpperCase()}</Text>
                                                <Text numberOfLines={1} style={tw`font-light ml-2  w-40 text-gray-400 text-sm`}>{data.selecteduser.cityl.toUpperCase()}</Text>
                                                <Text numberOfLines={1} style={tw`font-light ml-2  w-40  text-base`}>{data.selecteduser.phone}</Text>



                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </>
                            ))
                        }





                    </ScrollView>
                </View>


            </>






        </View>


    )
}

export default Allhospitals


