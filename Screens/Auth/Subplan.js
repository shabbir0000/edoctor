import { View, Text, Image, ScrollView, TouchableOpacity, Alert, BackHandler, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import tw from "twrnc"
import LinearGradient from 'react-native-linear-gradient'
import { useFocusEffect } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { showToast } from '../Universal/Input'
import Toast from 'react-native-toast-message'
import Deviceinfo from 'react-native-device-info';

const Subplan = ({ navigation }) => {
    const [token, settoken] = useState("");
    const [Plandata, setplandata] = useState([]);
    const [loading, setloading] = useState(false)


    const getinfo = async (id) => {

        try {
            setloading(true)
            const response = await fetch(`https://vr.evolvsolution.com/api/assign_subscription/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Replace YOUR_TOKEN_HERE with the actual token
                },
            });

            const result = await response.json();
            if (response.ok) {
                const id = await Deviceinfo.getUniqueId();

                console.log('Request successful:', result);
                AsyncStorage.setItem("mobileid", id).then(() => {
                    setloading(false);
                    navigation.navigate('Tabbar')
                })

                // console.log("result :", result);
                // if (result.data.subscription === null) {
                //   navigation.navigate('Subplan')
                //   setEmail(null);
                //   setPassword(null);
                //   console.log("result :", result.data.subscription);
                // }
                // else {
                //   navigation.navigate('Tabbar')
                //   setEmail(null);
                //   setPassword(null);
                //   console.log("result else:", result.data.subscription);
                // }

            } else {
                setloading(false);
                showToast("error", "Error", response.status === 401 ? result.message : result.errors[0], true, 3000);
            }
        } catch (error) {
            setloading(false);
            showToast("error", "Error", error, true, 3000);
            console.error('Catch Error:', error);
        }
    };

    const getplan = async (token) => {

        try {
            // setloading(true)
            const response = await fetch(`https://vr.evolvsolution.com/api/subscription`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Replace YOUR_TOKEN_HERE with the actual token
                },
            });

            const result = await response.json();
            if (response.ok) {

                console.log('Request successful:', result);
                setplandata(result.data)
                console.log("details :", JSON.parse(result.data[0].details));
                let data = [];
                data = result.data.map((detail) => (
                    JSON.parse(detail.details)
                ))
                console.log("details", data);

            } else {

                showToast("error", "Error", response.status === 401 ? result.message : result.errors[0], true, 3000);
            }
        } catch (error) {

            showToast("error", "Error", error, true, 3000);
            console.error('Catch Error:', error);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            const checkUserRole = async () => {
                const token = await AsyncStorage.getItem("token");
                if (token) {
                    settoken(token);
                    getplan(token)

                } else {
                    settoken("");
                }
            };

            checkUserRole();

            // Cleanup function if needed (not required for this case)
            return () => { };

        }, []) // Empty dependency array ensures this runs only on focus and cleanup on blur
    );



    useFocusEffect(
        React.useCallback(() => {
            const backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                handleBackButtonPress,
            );

            return () => backHandler.remove();
        }, []),
    );

    const handleBackButtonPress = () => {
        navigation.goBack()
        return true; // Prevent default back button behavior
    };

    return (
        <View style={tw`mt-10`}>
            <>
                <View style={tw`justify-start mt-13 w-80 h-10 items-center self-center`}   >
                    <Text style={[tw`text-left  font-bold text-2xl`, { color: '#199A8E' }]}>
                        SUBSCRIPTION PLANS
                    </Text>
                </View>
                <View
                    style={tw`w-85 h-130 flex  flex-row  self-center rounded-xl items-center`}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {/* card 1 */}

                        <>

                            {
                                Plandata.map((data, index) => {
                                    const details = JSON.parse(data.details);
                                    return (
                                        <View key={index} style={[tw`h-110 border w-65 ml-5 rounded-lg`, { borderTopLeftRadius: 50, borderBottomRightRadius: 50, borderColor: '#199A8E' }]}>
                                            <View style={[tw`h-30 w-35 items-center justify-center`, { borderTopLeftRadius: 50, borderBottomRightRadius: 50, backgroundColor: '#199A8E' }]}>
                                                <Text style={[tw`text-white font-medium text-lg`]}>
                                                    {data.name}
                                                </Text>
                                            </View>
                                            <View style={tw`items-center mt-5 justify-center`}>
                                                <Text style={tw`text-3xl`}>
                                                    {data.price}$
                                                </Text>
                                                <View style={tw`w-50 flex-col h-50 justify-evenly items-center self-center`}>
                                                    {
                                                        details.map((detail, detailIndex) => (
                                                            <>



                                                                <View key={detailIndex} style={tw`flex-row w-45`}>
                                                                    <Image
                                                                        style={tw`h-5 w-5`}
                                                                        source={require("../../Images/checked.png")}
                                                                    />
                                                                    <Text numberOfLines={1} style={tw`text-gray-400  w-45`}> {detail}</Text>


                                                                </View>
                                                            </>
                                                        ))
                                                    }
                                                </View>
                                                {
                                                    loading ?
                                                        <ActivityIndicator size={'large'} color={"#199A8E"} />
                                                        :
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                getinfo(data.id);
                                                            }}
                                                        >
                                                            <View style={[tw`items-center w-35 h-10 rounded-3xl justify-center`, { backgroundColor: '#199A8E' }]}>
                                                                <Text style={tw`text-white text-center`}>Subscribe</Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                }
                                            </View>
                                        </View>
                                    );
                                })
                            }

                            {/* {
                                Plandata.map((data, index) => (
                                    <View key={index} style={[tw`h-110 border w-65 ml-5 rounded-lg  `, { borderTopLeftRadius: 50, borderBottomRightRadius: 50, borderColor: '#199A8E' }]}>

                                        <View style={[tw` h-30 w-35 items-center justify-center `, { borderTopLeftRadius: 50, borderBottomRightRadius: 50, backgroundColor: '#199A8E' }]}>
                                            <Text style={[tw`text-white font-medium text-lg`]}>
                                                {data.name}
                                            </Text>
                                        </View>

                                        <View style={tw`items-center mt-5 justify-center`}>
                                            <Text style={tw`text-3xl`}>
                                                {data.price}$
                                            </Text>

                                            <View style={tw`w-50 flex-col h-50 justify-evenly items-center self-center`}>
                                                <View style={tw`flex-row w-45 `}>
                                                    <Image
                                                        style={tw`h-5 w-5 `}
                                                        source={require("../../Images/checked.png")}
                                                    />
                                                    <Text style={tw`text-gray-400`}> Theme With Music</Text>
                                                </View>

                                                <View style={tw`flex-row w-45`}>
                                                    <Image
                                                        style={tw`h-5 w-5 `}
                                                        source={require("../../Images/checked.png")}
                                                    />
                                                    <Text style={tw`text-gray-400`}> {data.details[2]} Session With Music</Text>
                                                </View>

                                                <View style={tw`flex-row w-45`}>
                                                    <Image
                                                        style={tw`h-5 w-5 `}
                                                        source={require("../../Images/checked.png")}
                                                    />
                                                    <Text style={tw`text-gray-400`}> Free Avatar</Text>
                                                </View>

                                                <View style={tw`flex-row w-45`}>
                                                    <Image
                                                        style={tw`h-5 w-5 `}
                                                        source={require("../../Images/checked.png")}
                                                    />
                                                    <Text style={tw`text-gray-400`}> {data.details[14]} Device Login</Text>
                                                </View>
                                            </View>

                                            {
                                                loading ?
                                                    <ActivityIndicator size={'large'} color={"199A8E"} />
                                                    :
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            // navigation.navigate("Tabbar")
                                                            getinfo(data.id)
                                                        }}
                                                    >
                                                        <View style={[tw`items-center w-35 h-10 rounded-3xl justify-center `, { backgroundColor: '#199A8E' }]}>
                                                            <Text style={tw`text-white text-center`}>Subscribe</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                            }

                                        </View>
                                    </View>
                                ))
                            } */}








                        </>


                    </ScrollView>
                    <Toast />
                </View>
            </>
        </View>
    )
}

export default Subplan