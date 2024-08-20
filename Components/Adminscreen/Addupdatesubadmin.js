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
import React, { useEffect, useState, useCallback, useContext } from 'react';
import tw from 'twrnc';
import { Error, Input1, showToast } from '../../Screens/Universal/Input';
import { Formik } from 'formik';
import { Dropdown } from 'react-native-element-dropdown';
import * as Yup from 'yup';
import Screensheader from '../../Screens/Universal//Screensheader';
import storage from '@react-native-firebase/storage';
import { ref1, app, db, auth } from '../../Firebase';
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

import FilePicker from 'react-native-document-picker';
import uuid from 'react-native-uuid';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { Buttonnormal } from '../../Screens/Universal/Buttons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import CheckBox from '@react-native-community/checkbox';

const Addupdatesubadmin = ({ navigation, route }) => {
    const {

        doctorname,
        doctorphone,
        doctorcity,
        doctoremail,
        doctorpassword,
        mondayy,
        tuesdayy,
        wednesdayy,
        thursdayy,
        fridayy,
        saturdayy,
        sundayy,
        docid,
        profile,
        profilestatus
    } = route.params;

    const [initialValues, setInitialValues] = useState({
        doctorname: '',
        doctorphone: '',
        doctorcity: '',
        doctoremail: '',
        doctorpassword: ''
    });

    const [loading, setloading] = useState(false);

    //for image
    const [imglink1, setimglink1] = useState(null);
    const [name1, setimgname1] = useState(null);
    const [type1, setimgtype1] = useState(null);
    const [filedata1, setfiledata1] = useState(profile);
    const [user, setuser] = useState(null);
    const [monday, setmonday] = useState(mondayy)
    const [tuesday, settuesday] = useState(tuesdayy)
    const [wednesday, setwednesday] = useState(wednesdayy)
    const [thursday, setthursday] = useState(thursdayy)
    const [friday, setfriday] = useState(fridayy)
    const [saturday, setsaturday] = useState(saturdayy)
    const [sunday, setsunday] = useState(sundayy)
    const [loading1, setloading1] = useState(true);
    const [userflag, setuserflag] = useState("");
    const [GetData, setGetData] = useState([])

    const userid = uuid.v4();
    const datee = new Date()
    const showdate = datee.getFullYear() + "/" + (datee.getMonth() + 1) + "/" + datee.getDate();

    const [cat, setcat] = useState("Today")



    const Validation = Yup.object().shape({
        doctorname: Yup.string().required('Must be filled'),
        doctorphone: Yup.string().required('Must be filled'),
        doctorcity: Yup.string().required('Must be filled'),
        doctoremail: Yup.string().required('Must be filled'),
        doctorpassword: Yup.string().required('Must be filled'),
    });

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
        AsyncStorage.getItem("email").then((email) => {
            const coll = collection(db, 'Appointment');
            const q = query(coll, where('email', '==', email), where('bookdate', '==', showdate));

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




    useEffect(() => {
        console.log("route.params:", route.params);

        setInitialValues({
            doctorname: doctorname,
            doctorphone: doctorphone,
            doctorcity: doctorcity,
            doctoremail: doctoremail,
            doctorpassword: doctorpassword,
        });
        setmonday(mondayy)
        settuesday(tuesdayy)
        setwednesday(wednesdayy)
        setthursday(thursdayy)
        setfriday(fridayy)
        setsaturday(saturdayy)
        setsunday(sundayy)
        setloading1(false)
        setfiledata1(profile)


        return () => {
            setInitialValues({
                doctorname: '',
                doctorphone: '',
                doctorcity: '',
                doctoremail: '',
                doctorpassword : ''
            });
            setmonday(false)
            settuesday(false)
            setwednesday(false)
            setthursday(false)
            setfriday(false)
            setsaturday(false)
            setsunday(false)
            setloading1(true)
        };
    }, [route.params]);

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






    const uploaddocfile = async (doctorname, doctorphone, doctorcity, doctoremail,doctorpassword) => {
        console.log("data :", doctorname, doctorphone, doctorcity, doctoremail,doctorpassword, imglink1);
        if (!doctorname || !doctorphone || !doctorcity || !doctoremail || !doctorpassword || !imglink1) {
            Alert.alert('Alert', 'Please Fill All The Detail');

        }
        else {
            setloading(true);
            const reference = storage().ref(`allfiles/${name1}`);
            await reference.putFile(imglink1);
            const url = await storage().ref(`allfiles/${name1}`).getDownloadURL();
            console.log('your file is locating :', url);
            adddoc(doctorname, doctorphone, doctorcity, doctoremail,doctorpassword, url);
        }
    };

    const adddoc = async (doctorname, doctorphone, doctorcity, doctoremail,doctorpassword, url) => {
        if (!doctorname || !doctorphone || !doctorcity || !doctoremail || !doctorpassword) {
            showToast("error", "Field Required", "Must Fill All The Field", true, 1000)
        }

        else {
            await createUserWithEmailAndPassword(auth, doctoremail, doctorpassword);
            setDoc(doc(db, 'Signup', userid), {
                fullname: doctorname,
                phone: doctorphone,
                city: doctorcity.toLowerCase().trim(),
                email: doctoremail.toLowerCase().trim(),
                password: doctorpassword,
                monday: monday,
                tuesday: tuesday,
                wednesday: wednesday,
                thursday: thursday,
                friday: friday,
                saturday: saturday,
                sunday: sunday,
                profilestatus: "active",
                role: "subadmin",
                userid,
                timestamp: serverTimestamp(),
                profilephoto: url
            })
                .then(() => {
                    console.log('done');
                    //  setfiledata1(null)
                    setDoc(doc(db, 'Profile', userid), {
                        fullname: doctorname,
                        phone: doctorphone,
                        city: doctorcity.toLowerCase().trim(),
                        email: doctoremail.toLowerCase().trim(),
                        password: doctorpassword,
                        monday: monday,
                        tuesday: tuesday,
                        wednesday: wednesday,
                        thursday: thursday,
                        friday: friday,
                        saturday: saturday,
                        sunday: sunday,
                        profilestatus: "active",
                        role: "subadmin",
                        userid,
                        timestamp: serverTimestamp(),
                        profilephoto: url
                    })
                        .then(() => {
                            setmonday(false)
                            settuesday(false)
                            setwednesday(false)
                            setthursday(false)
                            setfriday(false)
                            setsaturday(false)
                            setsunday(false)


                            setloading(false)
                            Alert.alert('Congratulation', 'Hospital Has Been Register', [
                                {
                                    text: 'OK',
                                    onPress: () => navigation.navigate('Home'),
                                },
                            ]);
                        })
                })
                .catch(error => {
                    setloading(false)
                    // console.log(error);
                    Alert.alert('this :', error.message);
                });

        }
    };


    const updatedocfile = async (doctorname, doctorphone, doctorcity, doctoremail,doctorpassword) => {
        if (filedata1.startsWith('file://') || filedata1.startsWith('content://')) {
            // showModal;
            setloading(true);
            const reference = storage().ref(`allfiles/${name1}`);
            await reference.putFile(imglink1);
            const url = await storage().ref(`allfiles/${name1}`).getDownloadURL();
            console.log('your file is locating :', url);
            updatedoc(doctorname, doctorphone, doctorcity, doctoremail,doctorpassword, url);
        }
        else {
            try {
                setloading(true);
                updatedoc(doctorname, doctorphone, doctorcity, doctoremail,doctorpassword, filedata1);
            }
            catch (error) {
                setloading(false);
                console.log("Error :", error);
            }
        }
    };

    const updatedoc = async (doctorname, doctorphone, doctorcity, doctoremail,doctorpassword, url) => {

        updateDoc(doc(db, 'Profile', docid), {
            fullname: doctorname,
                phone: doctorphone,
                city: doctorcity.toLowerCase().trim(),
                email: doctoremail.toLowerCase().trim(),
                password: doctorpassword,
                monday: monday,
                tuesday: tuesday,
                wednesday: wednesday,
                thursday: thursday,
                friday: friday,
                saturday: saturday,
                sunday: sunday,
                profilestatus: profilestatus,
                role: "subadmin",
                userid : docid,
                timestamp: serverTimestamp(),
                profilephoto: url
        })
            .then(() => {
                console.log('done');
                setloading(false);
                Alert.alert('Congratulation', 'Hospital Detail Has Been Updated', [
                    { text: 'OK', onPress: () => navigation.goBack() },
                ]);
            })
            .catch(error => {
                setloading(false);
                Alert.alert('this :', error.message);
            });
    };



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

                        <>
                            <View style={[tw`flex-1 flex`, { backgroundColor: '#FFFFFF' }]}>
                                <>
                                    <Formik
                                        enableReinitialize
                                        initialValues={initialValues}
                                        validationSchema={Validation}
                                        onSubmit={(values, { resetForm }) => {

                                            if (docid) {
                                                updatedocfile(
                                                    values.doctorname,
                                                    values.doctorphone,
                                                    values.doctorcity,
                                                    values.doctoremail,
                                                    values.doctorpassword
                                                )
                                            } else {
                                                uploaddocfile(
                                                    values.doctorname,
                                                    values.doctorphone,
                                                    values.doctorcity,
                                                    values.doctoremail,
                                                    values.doctorpassword
                                                )
                                            }
                                            // resetForm({})


                                        }}>
                                        {({
                                            handleChange,
                                            handleBlur,
                                            handleSubmit,
                                            errors,
                                            touched,
                                            values,
                                            isValid,
                                        }) => (
                                            <SafeAreaView>
                                                <ScrollView vertical showsVerticalScrollIndicator={true}>
                                                    <View style={tw`h-230`}>
                                                        <Screensheader
                                                            name={docid ? "UPDATE HOSPITAL" : "ADD HOSPITAL"}
                                                            left={15}
                                                            onPress={() => navigation.goBack()}
                                                        />



                                                        <View
                                                            style={tw`flex flex-col w-80 self-center justify-around`}>
                                                            <TouchableOpacity onPress={() => choosefileimg()}>
                                                                <View
                                                                    style={tw`flex w-80  items-center  mt-5 flex-col`}>
                                                                    <View
                                                                        style={tw`  h-50 border-2  w-80 items-center border-dotted`}>

                                                                        <Image
                                                                            source={{ uri: filedata1 }}
                                                                            resizeMode='cover'
                                                                            style={tw` w-79 h-49 `}
                                                                        />

                                                                    </View>
                                                                    <View style={tw`mt-2 items-center`}>
                                                                        <Text style={tw`font-bold  `}>
                                                                            {docid ? "Update Hospital Image" : "Add Hospital Image"}
                                                                        </Text>
                                                                        <Text style={tw`text-xs  `}>Max 5mb</Text>
                                                                    </View>
                                                                </View>
                                                            </TouchableOpacity>
                                                        </View>

                                                        <View style={tw` self-center  h-70`}>
                                                            <View style={tw`top-5`}>
                                                                <Input1
                                                                    placeholder="Add Hospital Name"
                                                                    onchangetext={handleChange('doctorname')}
                                                                    onblur={handleBlur('doctorname')}
                                                                    value={values.doctorname}
                                                                    error={touched.doctorname ? errors.doctorname : false}
                                                                />
                                                            </View>





                                                            <View style={tw`top-6`}>
                                                                <Input1
                                                                    placeholder="Enter Hospital Phone"
                                                                    keyboardType={"number-pad"}
                                                                    onchangetext={handleChange('doctorphone')}
                                                                    onblur={handleBlur('doctorphone')}
                                                                    value={values.doctorphone}

                                                                    error={touched.doctorphone ? errors.doctorphone : false}
                                                                />
                                                            </View>

                                                            <View style={tw`top-8`}>
                                                                <Input1
                                                                    placeholder="Enter City In Hospital Located"

                                                                    onchangetext={handleChange('doctorcity')}
                                                                    onblur={handleBlur('doctorcity')}
                                                                    value={values.doctorcity}

                                                                    error={touched.doctorcity ? errors.doctorcity : false}
                                                                />
                                                            </View>

                                                            <View style={tw`top-8`}>
                                                                <Input1
                                                                    placeholder="Enter Hospital Account Email"

                                                                    onchangetext={handleChange('doctoremail')}
                                                                    onblur={handleBlur('doctoremail')}
                                                                    value={values.doctoremail}

                                                                    error={touched.doctoremail ? errors.doctoremail : false}
                                                                />
                                                            </View>

                                                            {
                                                                docid ?
                                                                    <></>
                                                                    :
                                                                    <View style={tw`top-8`}>
                                                                        <Input1
                                                                            placeholder="Enter Hospital Account password"

                                                                            onchangetext={handleChange('doctorpassword')}
                                                                            onblur={handleBlur('doctorpassword')}
                                                                            value={values.doctorpassword}

                                                                            error={touched.doctorpassword ? errors.doctorpassword : false}
                                                                        />
                                                                    </View>
                                                            }



                                                            <View style={tw` justify-start  items-center flex-col w-80 h-25 mt-10`}>
                                                                <Text style={tw`text-gray-700 font-bold text-lg `}>{docid ? "Update" : "Add"} Hospital Open Days</Text>

                                                                <View style={tw` flex-row items-center justify-center w-70 h-10  `}>

                                                                    <CheckBox
                                                                        disabled={false}
                                                                        value={monday}
                                                                        onValueChange={(newValue) => setmonday(newValue)}
                                                                    />
                                                                    <Text style={tw`text-gray-400 `}>Monday</Text>

                                                                    <CheckBox
                                                                        disabled={false}
                                                                        value={tuesday}
                                                                        onValueChange={(newValue) => settuesday(newValue)}
                                                                    />
                                                                    <Text style={tw`text-gray-400 `}>Tuesday</Text>


                                                                    <CheckBox
                                                                        disabled={false}
                                                                        value={wednesday}
                                                                        onValueChange={(newValue) => setwednesday(newValue)}
                                                                    />
                                                                    <Text style={tw`text-gray-400 `}>Wednesday</Text>



                                                                </View>

                                                                <View style={tw` flex-row items-center justify-center w-80  h-10  `}>

                                                                    <CheckBox
                                                                        disabled={false}
                                                                        value={thursday}
                                                                        onValueChange={(newValue) => setthursday(newValue)}
                                                                    />
                                                                    <Text style={tw`text-gray-400 `}>Thursday</Text>

                                                                    <CheckBox
                                                                        disabled={false}
                                                                        value={friday}
                                                                        onValueChange={(newValue) => setfriday(newValue)}
                                                                    />
                                                                    <Text style={tw`text-gray-400 `}>Friday</Text>


                                                                    <CheckBox
                                                                        disabled={false}
                                                                        value={saturday}
                                                                        onValueChange={(newValue) => setsaturday(newValue)}
                                                                    />
                                                                    <Text style={tw`text-gray-400 `}>Saturday</Text>

                                                                    <CheckBox
                                                                        disabled={false}
                                                                        value={sunday}
                                                                        onValueChange={(newValue) => setsunday(newValue)}
                                                                    />
                                                                    <Text style={tw`text-gray-400 `}>Sunday</Text>



                                                                </View>



                                                            </View>



                                                            {
                                                                loading ?
                                                                    <ActivityIndicator
                                                                        style={tw`mt-15 `}
                                                                        size="large"
                                                                        color="#199A8E"
                                                                    />
                                                                    :
                                                                    <View style={tw`mt-10`}>
                                                                        <Buttonnormal
                                                                            onPress={handleSubmit}
                                                                            // onPress={() => {
                                                                            //     console.log(monday);
                                                                            //     console.log(tuesday);
                                                                            //     console.log(wednesday);
                                                                            //     console.log(thursday);
                                                                            //     console.log(friday);
                                                                            //     console.log(saturday);
                                                                            //     console.log(sunday);
                                                                            // }}
                                                                            c1={'#0B4064'}
                                                                            c2={'#0B4064'}
                                                                            style={tw`text-white`}
                                                                            title={docid ? "UPDATE HOSPITAL" : "ADD HOSPITAL"}
                                                                        />
                                                                    </View>

                                                            }



                                                        </View>
                                                    </View>
                                                </ScrollView>
                                            </SafeAreaView>
                                        )}
                                    </Formik>
                                </>
                            </View >
                            <Toast />
                        </>


                    </>
            }
        </>
    );
};

export default Addupdatesubadmin;

var styles = StyleSheet.create({
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
});
