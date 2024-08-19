import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Linking } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from "twrnc"
import { showToast } from '../../Screens/Universal/Input';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Screensheader from '../../Screens/Universal/Screensheader';
import { Buttonnormal } from '../../Screens/Universal/Buttons';
import { Calendar } from 'react-native-calendars'
import { collection, doc, getDocs, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../../Firebase';
import uuid from 'react-native-uuid';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Dropdown } from 'react-native-element-dropdown';
// import LinearGradient f,slotsrom 'react-native-linear-gradient'

const Showappointments = ({ navigation, route }) => {
    const { phone, slots, usercontrol } = route.params;
    const [email, setemail] = useState("");
    const [slotsselect, setslotsselect] = useState([]);
    const [dayselect, setdayselect] = useState("");
    const [price, setprice] = useState("");
    const [updatedocid, setupdatedocid] = useState("");
    const [cat, setcat] = useState("Today All")
    const [userflag, setuserflag] = useState(usercontrol);
    const [loading, setloading] = useState(false);
    const [loading1, setloading1] = useState(false);
    const [GetData, setGetData] = useState([]);
    const [GetData1, setGetData1] = useState([]);
    const userid = uuid.v4();
    const datee = new Date()
    const showdate = datee.getFullYear() + "/" + (datee.getMonth() + 1) + "/" + datee.getDate();
    const [model, setmodel] = useState(false)
    const [date, setdate] = useState("")
    const [model1, setmodel1] = useState(false)
    const [time, settime] = useState("")
    const [value2, setValue2] = useState("");
    const [label2, setlabel2] = useState("");
    const [isFocus2, setIsFocus2] = useState(false);
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');


    const fetchSlots = async (tempdate) => {
        try {
            const q = query(
                collection(db, 'Filledapp'),
                where('bookdate', '==', tempdate),
                where('doctorphone', '==', phone)
            );
            const querySnapshot = await getDocs(q);
            const slotsArray = querySnapshot.docs.map((doc) => ({
                start: doc.data().start,
                end: doc.data().end,
            }));

            // setAllSlots(slotsArray);
            console.log("filledapp", slotsArray);

            const uniqueSlots = removeSlotsFromArray(slotsArray, slots);
            console.log("unique", uniqueSlots);

            const transformedData = uniqueSlots.map((slot, index) => ({
                label: `${slot.start} ,${slot.end}`,
                value: index.toString()
            }));
            console.log('Unique Slots:', transformedData);

            setslotsselect(transformedData);

        } catch (error) {
            console.error('Error fetching documents: ', error);
        }
    };


    const areSlotsEqual = (slot1, slot2) => {
        return slot1.start === slot2.start && slot1.end === slot2.end;
    };

    const removeSlotsFromArray = (arr1, arr2) => {
        let filteredArr2 = [...arr2];

        arr1.forEach(slot1 => {


            filteredArr2 = filteredArr2.filter(slot2 => !areSlotsEqual(slot1, slot2));
            console.log("filtereddddd", filteredArr2);
        });

        return filteredArr2;
    };

    useEffect(() => {



        fetchSlots(showdate);
        // Helper function to check if two slot objects are equal

        // AsyncStorage.getItem("role").then((role) => {
        if (userflag === true) {
            // setuserflag(true)
            AsyncStorage.getItem("email").then((email) => {
                setemail(email)
                const coll = collection(db, 'Doctors');
                const q = query(coll, where("doctorphone", '==', phone));

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
        else {
            showtodayappointment()
            // setuserflag(false)
        }
        // })
    }, [])

    useEffect(() => {
        AsyncStorage.getItem("email").then((email) => {
            setemail(email)
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

    const vrImages = [
        {
            url: "https://vection-cms-prod.s3.eu-central-1.amazonaws.com/Adobe_Stock_506941973_cc825880a8.jpeg",
            text: "Today All"
        },
        {
            url: "https://images.inc.com/uploaded_files/image/1920x1080/getty_921019710_413686.jpg",
            text: "Today Cancelled"
        },

        {
            url: "https://images.inc.com/uploaded_files/image/1920x1080/getty_921019710_413686.jpg",
            text: "All Booking"
        },

    ];




    const bookappointment = async (doctorname, doctorphone, monday, tuesday, wednesday, thursday, friday, saturday, sunday, label2, label, label1, url) => {
        if (!doctorname || !doctorphone || !start || !end || !date) {
            showToast("error", "Field Required", "Must Fill All The Field", true, 1000)
        }

        else {
            setloading(true)
            setDoc(doc(db, 'Appointment', userid), {
                doctorname: doctorname,
                doctorphone: doctorphone,
                doctortypelabel: label2,
                username: GetData1[0].selecteduser.fullname,
                phone: GetData1[0].selecteduser.phone,
                bookdate: date,
                bookstime: start.trim(),
                booketime: end.trim(),
                monday: monday,
                tuesday: tuesday,
                wednesday: wednesday,
                thursday: thursday,
                friday: friday,
                saturday: saturday,
                sunday: sunday,
                doctortimefromlabel: label,
                doctortimetolabel: label1,
                userid,
                email: email,
                todaydate: showdate,
                status: "confirmed",
                timestamp: serverTimestamp(),
                profile: url
            })
                .then(() => {
                    console.log('done');
                    setDoc(doc(db, 'Filledapp', userid), {
                        doctorname: doctorname,
                        doctorphone: doctorphone,
                        doctortypelabel: label2,
                        username: GetData1[0].selecteduser.fullname,
                        phone: GetData1[0].selecteduser.phone,
                        bookdate: date,
                        start: start.trim(),
                        end: end.trim(),
                        userid,
                        email: email,
                        todaydate: showdate,
                        status: "confirmed",
                        timestamp: serverTimestamp(),

                    })
                    setloading(false)
                    Alert.alert('Congratulation', 'Appointment Has Been Booked', [
                        {
                            text: 'OK',
                            onPress: () => navigation.navigate('Home'),
                        },
                    ]);
                })
                .catch(error => {
                    setloading(false)
                    // console.log(error);
                    Alert.alert('this :', error.message);
                });

        }
    };


    // useEffect(() => {
    //     if (!userflag) {
    //         showtodayappointment()
    //     }

    // }, [userflag]);


    const showtodayappointment = async () => {
        AsyncStorage.getItem("email").then((email) => {
            const coll = collection(db, 'Appointment');
            const q = query(coll, where('doctorphone', '==', phone), where('bookdate', '==', showdate), where('status', '==', "confirmed"));

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
            const q = query(coll, where('doctorphone', '==', phone));

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

    const showtodaycancelledappointment = async () => {
        AsyncStorage.getItem("email").then((email) => {
            const coll = collection(db, 'Appointment');
            const q = query(coll, where('doctorphone', '==', phone), where('bookdate', '==', showdate), where('status', '==', "cancelled"));

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


    const handleConfirm = (day) => {
        const hours = day.getHours();
        const minutes = day.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12; // Convert to 12-hour format
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const formattedTime = `${formattedHours}:${formattedMinutes} ${ampm}`;

        settime(formattedTime);
        setmodel1(false);
    };

    const updatedoc = async (status, apid) => {
        setloading1(true)
        updateDoc(doc(db, 'Appointment', apid), {
            status: status
        })
            .then(() => {
                console.log('done');
                setloading1(false);
                if (cat === "Today Cancelled") {
                    showtodaycancelledappointment()
                    // setcat(item.text)
                } else if (cat === "Today All") {
                    showtodayappointment()
                    // setcat(item.text)
                }
                else {
                    showallappointment()
                    // setcat(item.text)
                }
                // showtodayappointment()
                // Alert.alert('Congratulation', 'Appoint Has Been Cancelled', [
                //     { text: 'OK' },
                // ]);
            })
            .catch(error => {
                setloading1(false);
                Alert.alert('this :', error.message);
            });
    };


    return (
        <>
            {
                userflag ?
                    <>
                        <View style={tw` bg-white flex-1`}>
                            <Screensheader
                                name={'BOOK APPOINMENT'}
                                left={10}
                                onPress={() => navigation.goBack()}
                            />



                            <ScrollView style={tw`flex-1 mb-5 self-center `} showsVerticalScrollIndicator={false}>
                                {

                                    GetData.map((data, index) => (
                                        < >
                                            <View key={index} style={[tw` flex-row justify-around items-center  w-80 h-35  self-center `]}>


                                                <Image
                                                    style={tw`h-30 w-35 border rounded-md`}
                                                    resizeMode='cover'
                                                    source={{ uri: data.selecteduser.profile }}
                                                />
                                                <View style={tw`w-40 h-30 justify-start  items-start `}>


                                                    <Text numberOfLines={1} style={tw`font-bold w-30 text-xl`}>{data.selecteduser.doctorname}</Text>
                                                    <Text numberOfLines={1} style={tw`font-light mt-2 w-30 text-gray-400 text-base`}>{data.selecteduser.doctortypelabel}</Text>

                                                    <Text numberOfLines={1} style={tw`font-medium mt-2  w-30 text-gray-400 text-base`}>From {data.selecteduser.doctortimefromlabel}</Text>
                                                    <Text numberOfLines={1} style={tw`font-medium mt-2  w-30 text-gray-400 text-base`}>To {data.selecteduser.doctortimetolabel}</Text>
                                                </View>


                                            </View>

                                            <View style={tw` self-center items-center justify-center w-80 h-40 `}>
                                                <Text style={tw`font-light text-sm`}>
                                                    {`At Dee-Felz, we provide top-notch healthcare with leading doctors like `}
                                                    <Text style={tw`font-semibold`}>
                                                        {data.selecteduser.doctorname}
                                                    </Text>
                                                    {`, the city’s top `}
                                                    <Text style={tw`font-semibold`}>
                                                        {data.selecteduser.doctortypelabel}
                                                    </Text>
                                                    {`. Our clinic ensures exceptional care with skilled professionals dedicated to your well-being. From expert diagnosis to advanced treatments, trust Dee-Felz for unparalleled medical attention.`}
                                                </Text>

                                            </View>

                                            <View style={tw`h-40  mb-5  justify-between flex-col w-80 self-center `}>


                                                <View style={tw`h-18  self-center  w-80 `}>
                                                    <View style={tw` items-center h-10  w-70 self-center justify-between flex-row `}>

                                                        <View style={[tw`h-7 w-15 rounded-3xl  border border-blue-300 items-center justify-center`, { backgroundColor: data.selecteduser.monday === true ? '#00B1E7' : 'lightgray' }]}>
                                                            <Text style={tw`text-xs text-black`}>Monday</Text>
                                                        </View>
                                                        <View style={[tw`h-7 w-15 rounded-3xl items-center border border-blue-300 justify-center`, { backgroundColor: data.selecteduser.tuesday === true ? '#00B1E7' : 'lightgray' }]}>
                                                            <Text style={tw`text-xs text-black`}>Tuesday</Text>
                                                        </View>
                                                        <View style={[tw`h-7 w-20 rounded-3xl items-center border border-blue-300 justify-center`, { backgroundColor: data.selecteduser.wednesday === true ? '#00B1E7' : 'lightgray' }]}>
                                                            <Text style={tw`text-xs text-black`}>Wednesday</Text>
                                                        </View>

                                                        <View style={[tw`h-7 w-15 rounded-3xl  border border-blue-300 items-center justify-center`, { backgroundColor: data.selecteduser.thursday === true ? '#00B1E7' : 'lightgray' }]}>
                                                            <Text style={tw`text-xs text-black`}>Thursday</Text>
                                                        </View>




                                                    </View>


                                                    <View style={tw` items-center h-10  w-50 self-center justify-between flex-row `}>

                                                        <View style={[tw`h-7 w-15 rounded-3xl items-center border border-blue-300 justify-center`, { backgroundColor: data.selecteduser.friday === true ? '#00B1E7' : 'lightgray' }]}>
                                                            <Text style={tw`text-xs text-black`}>Friday</Text>
                                                        </View>
                                                        <View style={[tw`h-7 w-15 rounded-3xl items-center border border-blue-300 justify-center`, { backgroundColor: data.selecteduser.saturday === true ? '#00B1E7' : 'lightgray' }]}>
                                                            <Text style={tw`text-xs text-black`}>Saturday</Text>
                                                        </View>
                                                        <View style={[tw`h-7 w-15 rounded-3xl  border border-blue-300 items-center justify-center`, { backgroundColor: data.selecteduser.sunday === true ? '#00B1E7' : 'lightgray' }]}>
                                                            <Text style={tw`text-xs text-black`}>Sunday</Text>
                                                        </View>

                                                    </View>

                                                </View>




                                                <View style={tw` w-80 h-16  flex-row justify-between items-center self-center `}>
                                                    <View style={tw` w-35 h-10 justify-between self-center `}>

                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                setmodel(!model)
                                                            }}
                                                        >
                                                            <View style={tw`h-10 w-35 items-center rounded-3xl  justify-center border border-blue-400`}>
                                                                <Text style={tw`text-sm text-gray-500  text-center font-normal`}>{date ? date : "Appointment Date"}</Text>

                                                            </View>
                                                        </TouchableOpacity>

                                                    </View>
                                                    <DateTimePickerModal
                                                        isVisible={model}
                                                        mode="date"
                                                        onConfirm={day => {
                                                            const dd = day.getFullYear() + '/' + (day.getMonth() + 1) + '/' + day.getDate();
                                                            fetchSlots(dd)
                                                            setdate(

                                                                day.getFullYear() +
                                                                '/' +
                                                                (day.getMonth() + 1) +
                                                                '/' +
                                                                day.getDate(),
                                                            );
                                                            setmodel(!model)
                                                        }}
                                                        onCancel={() =>
                                                            setmodel(!model)
                                                        }
                                                    />



                                                    <Dropdown
                                                        style={[tw`h-10 w-40 border border-blue-500  bg-white rounded-3xl`, { backgroundColor: "#FFFFFF" }]}
                                                        placeholderStyle={tw`ml-3 text-gray-500 text-sm `}
                                                        selectedTextStyle={tw`ml-3 text-sm text-gray-400  `}
                                                        containerStyle={tw`h-80 w-80  mt-7 bg-gray-100 rounded-md`}
                                                        data={slotsselect}
                                                        maxHeight={300}
                                                        labelField="label"
                                                        valueField="value"
                                                        placeholder={'Doctor Slot'}
                                                        mode='modal'

                                                        value={value2}
                                                        onFocus={() => setIsFocus2(true)}
                                                        onBlur={() => setIsFocus2(false)}
                                                        onChange={item => {
                                                            const timeString = item.label
                                                            const timeArray = timeString.split(',');

                                                            if (timeArray.length === 2) {
                                                                setStart(timeArray[0]);
                                                                setEnd(timeArray[1]);
                                                            }
                                                            console.log("time", item.label);
                                                            setlabel2(item.label)
                                                            setValue2(item.value);
                                                            setIsFocus2(false);
                                                        }}

                                                    />
                                                </View>
                                            </View>

                                            {
                                                loading ?
                                                    <ActivityIndicator style={tw`mt-5`} size={'large'} color={'blue'} />
                                                    :
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            bookappointment(
                                                                data.selecteduser.doctorname,
                                                                data.selecteduser.doctorphone,
                                                                data.selecteduser.monday,
                                                                data.selecteduser.tuesday,
                                                                data.selecteduser.wednesday,
                                                                data.selecteduser.thursday,
                                                                data.selecteduser.friday,
                                                                data.selecteduser.saturday,
                                                                data.selecteduser.sunday,
                                                                data.selecteduser.doctortypelabel,
                                                                data.selecteduser.doctortimefromlabel,
                                                                data.selecteduser.doctortimetolabel,
                                                                data.selecteduser.profile
                                                            )

                                                        }}
                                                    >
                                                        <View style={tw` rounded-3xl bg-blue-800 w-80 self-center items-center justify-center h-10  `}>

                                                            <Text style={tw`text-white`}>
                                                                BOOK APPOINMENT
                                                            </Text>

                                                        </View>
                                                    </TouchableOpacity>
                                            }

                                        </>
                                    ))
                                }


                            </ScrollView>
                            <Toast />
                        </View>
                    </>
                    :

                    <View style={tw` bg-white flex-1`}>

                        <ScrollView style={tw`flex-1 mb-5 self-center `} showsVerticalScrollIndicator={false}>
                            <View style={tw` bg-white flex-1`}>
                                <Screensheader
                                    name={'TODAY APPOINMENTS'}
                                    left={5}
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

                                                        if (item.text === "Today Cancelled") {
                                                            setcat(item.text)
                                                            showtodaycancelledappointment()
                                                          
                                                        } else if (item.text === "Today All") {
                                                            setcat(item.text)
                                                            showtodayappointment()
                                                          
                                                        }
                                                        else {
                                                            setcat(item.text)
                                                            showallappointment()
                                                            
                                                        }

                                                    }}>
                                                    <View style={[tw`bg-${cat === item.text ? 'blue-400' : 'white'} h-10 w-30 ml-5 border flex-row items-center justify-evenly rounded-3xl`, { borderRadius: 50, borderColor: '#00B1E7' }]}>
                                                        {/* <Image style={tw`h-5 w-5 rounded-full`} source={{ uri: item.url }} /> */}
                                                        <Text numberOfLines={1} style={tw`text-center text-${cat === item.text ? "white" : "black"} w-28`}>{item.text}</Text>
                                                    </View>
                                                </TouchableOpacity>

                                            ))
                                            }
                                        </>


                                    </ScrollView>
                                </View>

                                <ScrollView style={tw`flex-1 mb-5 self-center `} showsVerticalScrollIndicator={false}>

                                    {
                                        GetData.map((data, index) => (
                                            <TouchableOpacity
                                                disabled={true}
                                                key={index}
                                            >
                                                <View style={[tw`border flex-col justify-center items-center w-80 h-60 rounded-md self-center mt-5`, { borderColor: "#00B1E7" }]}>

                                                    <View style={tw`h-15 w-70 flex-row items-center justify-between `}>

                                                        <View>
                                                            <Text numberOfLines={1} style={tw`font-bold w-40 text-xl`}>{data.selecteduser.doctorname}</Text>
                                                            <Text numberOfLines={1} style={tw`font-light  w-40 text-gray-400 text-sm`}>{data.selecteduser.doctortypelabel}</Text>
                                                        </View>

                                                        <Image
                                                            style={tw`h-15 w-15 rounded-full`}
                                                            resizeMode='cover'
                                                            source={{ uri: data.selecteduser.profile }}
                                                        />
                                                    </View>

                                                    <View style={tw`h-10  justify-between items-center flex-row w-70`}>
                                                        <Text numberOfLines={1} style={tw`font-normal  text-base`}>{data.selecteduser.bookdate}</Text>
                                                        <Text numberOfLines={1} style={tw`font-normal   text-sm`}>{data.selecteduser.bookstime} {"to"} {data.selecteduser.booketime}</Text>
                                                        {/* <Text numberOfLines={1} style={tw`font-normal text-green-500   text-base`}>{data.selecteduser.status}</Text> */}


                                                    </View>

                                                    <View style={tw`h-10  justify-between items-center flex-row w-70 `}>
                                                        <Text numberOfLines={1} style={tw`font-normal text-start   w-35  text-base`}>{data.selecteduser.username}</Text>
                                                        <TouchableOpacity
                                                            onPress={() => (
                                                                Linking.openURL(`whatsapp://send?text=Hello ${data.selecteduser.username}\nYou Booked Appoinment in Dee-felz Clinic\nYour Booking Date And Time is\n${data.selecteduser.bookdate} \nFrom ${data.selecteduser.bookstime} To ${data.selecteduser.booketime} &phone=${data.selecteduser.phone}`)
                                                            )}
                                                        >
                                                            <Text numberOfLines={1} style={tw`font-normal text-right underline w-30 text-sm`}>{data.selecteduser.phone}</Text>
                                                            {/* <Text numberOfLines={1} style={tw`font-normal text-green-500   text-base`}>{data.selecteduser.status}</Text> */}
                                                        </TouchableOpacity>

                                                    </View>

                                                    {
                                                        loading1 && data.selecteduser.userid === updatedocid ?
                                                            <ActivityIndicator size="large" style={tw`mt-5`} color="#00B1E7" />
                                                            :
                                                            <TouchableOpacity
                                                                onPress={() => {
                                                                    setupdatedocid(data.selecteduser.userid)
                                                                    updatedoc(data.selecteduser.status === "confirmed" ? 'cancelled' : 'confirmed', data.selecteduser.userid)
                                                                }}
                                                            >
                                                                <View style={tw` rounded-md bg-slate-200 w-70 items-center justify-center h-10 mt-5 `}>

                                                                    <Text>
                                                                        {data.selecteduser.status === "confirmed" ? "CANCEL BOOKING" : "ACCEPT AGAIN"}
                                                                    </Text>

                                                                </View>
                                                            </TouchableOpacity>
                                                    }

                                                </View>
                                            </TouchableOpacity>
                                        ))
                                    }


                                </ScrollView>
                            </View>



                        </ScrollView>
                    </View>
            }
        </>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedDateText: {
        marginTop: 20,
        fontSize: 18,
        color: 'blue',
    },
    selectDateText: {
        marginTop: 20,
        fontSize: 18,
        color: 'gray',
    },
});

export default Showappointments

