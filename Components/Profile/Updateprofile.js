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
import * as Yup from 'yup';
import Screensheader from '../../Screens/Universal//Screensheader';
import storage from '@react-native-firebase/storage';
import { ref1, app, db } from '../../Firebase';
import {
    doc,
    updateDoc,
} from 'firebase/firestore';

import FilePicker from 'react-native-document-picker';
import uuid from 'react-native-uuid';
import { getAuth } from 'firebase/auth';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { Buttonnormal } from '../../Screens/Universal/Buttons';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { AppContext } from '../../AppContext';
import Toast from 'react-native-toast-message';

const Updateprofile = ({ navigation, route }) => {
    // const { cat } = useContext(AppContext);
    const { url, pname,pid } = route.params;
   
    const [loading, setloading] = useState(false);

    //for image
    const [imglink1, setimglink1] = useState(null);
    const [name1, setimgname1] = useState(null);
    const [type1, setimgtype1] = useState(null);
    const [filedata1, setfiledata1] = useState(url);
    const [user, setuser] = useState(null);

    const userid = uuid.v4();


    const Validation = Yup.object().shape({
        name: Yup.string().required('Must be filled'),
    });

    useFocusEffect(
        useCallback(() => {

            AsyncStorage.getItem('email').then((email) => {
                setuser(email);
            });
            return () => {

            };
        }, [])

    );

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




    const uploadupdatefile = async (productname) => {
        if (filedata1.startsWith('file://') || filedata1.startsWith('content://')) {
           
            setloading(true);
            const reference = storage().ref(`allfiles/${name1}`);
            await reference.putFile(imglink1);
            const url = await storage().ref(`allfiles/${name1}`).getDownloadURL();
            console.log('your file is locating :', url);
            Uploaupdatedata(productname, url);
        }
        else {
            try {
            
                setloading(true);
                Uploaupdatedata(productname, url);
            }
            catch (error) {
                
                setloading(false);
                console.log("Error :", error);
            }
        }
    };

    const Uploaupdatedata = async (productname, uploadedurlimg) => {

        updateDoc(doc(db, 'Profile', pid), {
            userid: pid,
            fullname: productname,     
            profilephoto: uploadedurlimg,
            email: user,
        })
            .then(() => {
                console.log('done');
                setloading(false);
                Alert.alert('Congratulation', 'Profile Has Been Updated', [
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

            <>
                <View style={[tw`flex-1 flex`, { backgroundColor: '#FFFFFF' }]}>
                    <>
                        <Formik
                            initialValues={{
                                name: pname
                            }}
                            validationSchema={Validation}
                            onSubmit={(values, { resetForm }) => {
                                    
                                    uploadupdatefile(
                                        values.name
                                    )
                                

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
                                        <View style={tw`h-180`}>
                                            <Screensheader
                                                name={'Update Your Profile'}
                                                left={10}
                                                onPress={() => navigation.goBack()}
                                            />

                                           

                                            <View
                                                style={tw`flex flex-col w-80 self-center justify-around`}>
                                                <TouchableOpacity onPress={() => choosefileimg()}>
                                                    <View
                                                        style={tw`flex w-80  items-center  mt-5 flex-col`}>
                                                        <View
                                                            style={tw`  h-50 border-2 rounded-full w-50 items-center border-dotted`}>
                                                          
                                                                <Image
                                                                     source={{uri : filedata1}}
                                                                    resizeMode='cover'
                                                                    style={tw` w-49 h-49 rounded-full`}
                                                                />
                                                         
                                                        </View>
                                                        <View style={tw`mt-2 items-center`}>
                                                            <Text style={tw`font-bold  `}>
                                                                Add Profile Image
                                                            </Text>
                                                            <Text style={tw`text-xs  `}>Max 5mb</Text>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>

                                            <View style={tw` self-center  h-70`}>
                                                <View style={tw`top-5`}>
                                                    <Input1
                                                        placeholder="Add Product Name"
                                                        onchangetext={handleChange('name')}
                                                        onblur={handleBlur('name')}
                                                        value={values.name}
                                                        error={touched.name ? errors.name : false}
                                                    />
                                                </View>



                                                {
                                                    loading ?
                                                        <ActivityIndicator
                                                            style={tw`mt-10 `}
                                                            size="large"
                                                            color="#199A8E"
                                                        />
                                                        :
                                                        <View style={tw`mt-10`}>
                                                            <Buttonnormal
                                                                onPress={handleSubmit}
                                                                c1={'#0B4064'}
                                                                c2={'#0B4064'}
                                                                style={tw`text-white`}
                                                                title={"UPDATE PROFILE"}
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
                </View>
                <Toast />
            </>

        </>
    );
};

export default Updateprofile;

var styles = StyleSheet.create({
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
});
