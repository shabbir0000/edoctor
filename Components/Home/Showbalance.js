import { View, Text, Image, Alert, TouchableOpacity, Linking, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from "twrnc"
import LinearGradient from 'react-native-linear-gradient';
import { useIsFocused } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { app, db } from '../../Firebase';
// import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';



const Showbalance = ({ navigation }) => {


    const data2 = [
        { label: 'Cardiologist', image: 'https://cdn-icons-png.flaticon.com/512/1546/1546124.png' },
        { label: 'Dermatologist', image: 'https://static.vecteezy.com/system/resources/previews/019/761/802/non_2x/beauty-parlour-skincare-salon-spa-dermatology-clinic-logo-design-design-concept-free-vector.jpg' },
        { label: 'Neurologist', image: 'https://c8.alamy.com/comp/2BKGHAK/brain-neurology-logo-2BKGHAK.jpg' },
        { label: 'Orthopedic', image: 'https://static.vecteezy.com/system/resources/previews/017/438/838/non_2x/joint-bones-logo-design-for-orthopedic-clinics-free-vector.jpg' },
        { label: 'Pediatrician', image: 'https://img.freepik.com/premium-vector/pediatrician-logo-template-design-vector_20029-1040.jpg' },
        { label: 'Psychiatrist', image: 'https://cdn.vectorstock.com/i/500p/20/78/human-head-logo-psychological-vector-46552078.jpg' },
        { label: 'Radiologist', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7PfK0wtBEPywVa4Unlx6Ilb7r2_9qZoVhiA&s' },
        { label: 'Urologist', image: 'https://cdn.vectorstock.com/i/500p/43/52/urology-logo-vector-46474352.jpg' },
        { label: 'Gynecologist', image: 'https://w7.pngwing.com/pngs/621/257/png-transparent-obstetrics-and-gynaecology-obstetrics-and-gynaecology-clinic-hospital-obstetrics-s-purple-blue-text-thumbnail.png' },
        { label: 'Pathologist', image: 'https://static.vecteezy.com/system/resources/thumbnails/021/599/743/small/the-logo-for-a-science-laboratory-is-called-a-microscope-vector.jpg' },
        { label: 'General', image: 'https://w7.pngwing.com/pngs/206/469/png-transparent-health-care-physician-surgery-surgeon-medicine-general-practitioner.png' }
    ];


    const auth = getAuth(app);
    const [GetData, setGetData] = useState([]);
    const [GetData1, setGetData1] = useState([]);
    const [userflag, setuserflag] = useState(true);
    const date = new Date().toDateString();

    useEffect(() => {
        AsyncStorage.getItem("role").then((role) => {

            setuserflag(role)

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
                        {`Health Solution \nIn E-Doctor`}
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
                userflag === "user" ?
                    <View
                        style={tw`w-85 h-20 mt-12  flex-row  self-center  items-center`}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {/* card 1 */}

                            <>


                                {data2?.map((item, index) => (
                                    <TouchableOpacity
                                        key={index}

                                        onPress={() => {
                                            // console.log(item.label);

                                            navigation.navigate('Yourplan', {
                                                catt: item.label
                                            })
                                        }}

                                    >
                                        <View style={[tw`h-20 w-30 ml-3  flex-col items-center justify-evenly `]}>
                                            <Image style={tw`h-15 w-15  rounded-full `} source={{ uri: item.image }} />
                                            <Text numberOfLines={1} style={tw`text-center text-black w-25`}>{item.label}</Text>
                                        </View>
                                    </TouchableOpacity>

                                ))
                                }




                            </>


                        </ScrollView>
                    </View>
                    :
                    <></>

            }


        </>
    )
}

export default Showbalance