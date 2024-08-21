import React, { useCallback, useState } from "react";
import { Image, View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import tw from "twrnc"
// import Supplier from "../Tabbar/Supplier";
import Home from "../Tabbar/Home";
import Profile from "../Tabbar/Profile";
import Sessions from "../Tabbar/Sessions";
import Yourplan from "../Tabbar/Yourplan";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import Category from "./Category";
import Allhospitals from "../Tabbar/Allhospitals";
const Tab = createBottomTabNavigator();

function Tabbar() {
    const [userflag, setuserflag] = useState("");

    useFocusEffect(
        useCallback(() => {

            AsyncStorage.getItem("role").then((role) => {

                setuserflag(role)

            })

            return () => {

            };
        }, []),
    );

    return (
        <Tab.Navigator

            screenOptions={{
                tabBarActiveTintColor: '#00B1E7',  // Green color when focused
                tabBarInactiveTintColor: '#000000',  // Black color when not focused

                // tabBarBackground: () => (
                //     <View style={{flex:1, backgroundColor: 'white' }} />
                //   ),
                tabBarHideOnKeyboard: true,
                headerShown: false,
                tabBarStyle: {
                    // borderRadius: 40,
                    // marginBottom: 10,
                    // width: 300,
                    alignItems: 'center',
                    justifyContent: 'center',
                    // left: 30,
                    // right: 30,
                    // height: 60,
                    backgroundColor: 'white'
                    //  paddingBottom:20,
                    // position:'absolute'

                }
            }}>
            <Tab.Screen
                options={{

                    tabBarLabel: 'Home',
                    tabBarIcon: ({ focused }) => (
                        <Image style={tw`h-8 w-8`} source={focused ? require("../../Images/homeb.png") : require("../../Images/home.png")} />
                    ),
                }}
                name="Home"
                component={Home}
            />

            {
                userflag === "user" &&
                <Tab.Screen
                    options={{
                        tabBarLabel: 'Hospitals',

                        tabBarIcon: ({ focused }) => (
                            <Image style={tw`h-8 w-8 `} source={focused ? require("../../Images/hospitalb.png") : require("../../Images/hospital1.png")} />
                        ),
                    }}
                    name="Hospitals"
                    component={Allhospitals}
                />
            }

            {
                userflag === "user" || userflag === "subadmin" ?
                    <>
                        <Tab.Screen
                            name="Yourplan"
                            options={{

                                tabBarLabel: 'Appointment',
                                tabBarIcon: ({ focused }) => (
                                    <Image style={tw`h-8 w-8`} source={focused ? require("../../Images/to-do-listb.png") : require("../../Images/to-do-list.png")} />
                                ),
                            }}
                            component={Yourplan}
                        />


                        <Tab.Screen
                            listeners={({ navigation }) => ({
                                tabPress: (e) => {
                                    // Prevent default behavior
                                    e.preventDefault();

                                    // Generate a new key to force re-render
                                    navigation.navigate('Sessions', {
                                        doctorname: "",
                                        doctortype: "",
                                        doctorphone: "",
                                        doctoremail: "",
                                        doctorpassword: "",
                                        doctorcity: "",
                                        mondayy: false,
                                        tuesdayy: false,
                                        wednesdayy: false,
                                        thursdayy: false,
                                        fridayy: false,
                                        saturdayy: false,
                                        sundayy: false,
                                        docid: "",
                                        doctortimefrom: "",
                                        doctortimeto: "",
                                        labell: "",
                                        labell1: "",
                                        labell2: "",
                                        profile: "https://firebasestorage.googleapis.com/v0/b/supplysync-3e4b1.appspot.com/o/allfiles%2Fimages.jpg?alt=media&token=0aa9155e-5ebd-4b22-8f77-c9d70d280507",
                                        profilestatus: ""
                                    });
                                },
                            })}
                            options={{

                                tabBarLabel: userflag === "user" ? "Booked" : 'Add Doctor',
                                tabBarIcon: ({ focused }) => (
                                    userflag === "user" ?
                                        <Image style={tw`h-8 w-8`} source={focused ? require("../../Images/appointment-bookb.png") : require("../../Images/appointment-book.png")} />
                                        :
                                        <Image style={tw`h-8 w-8`} source={focused ? require("../../Images/doctorb.png") : require("../../Images/doctor.png")} />
                                ),
                            }}
                            name="Sessions"
                            component={Sessions}
                        />
                    </>
                    :
                    <>
                        <Tab.Screen
                            options={{
                                tabBarLabel: 'Manage',


                                tabBarIcon: ({ focused }) => (
                                    <Image style={tw`h-7 w-7 top-1`} source={focused ? require("../../Images/to-do-listb.png") : require("../../Images/to-do-list.png")} />
                                ),
                            }}
                            name="Category"
                            component={Category}
                        />
                    </>
            }








            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{

                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ focused }) => (
                        <Image style={tw`h-8 w-8`} source={focused ? require("../../Images/userb.png") : require("../../Images/user.png")} />
                    ),
                }}
            />
        </Tab.Navigator>
    )
}

export default Tabbar;