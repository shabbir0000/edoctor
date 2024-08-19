import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import tw from "twrnc"
import { Input, showToast } from '../Universal/Input'
import CheckBox from '@react-native-community/checkbox';
import { Buttonnormal } from '../Universal/Buttons';
import Screensheader from '../Universal/Screensheader';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';

const Newpass = ({ navigation, route }) => {
    const { email } = route.params;
    const [customerflag, setcustomerflag] = useState(true)
    const [customerflag1, setcustomerflag1] = useState(false)
    const [toggleCheckBox, setToggleCheckBox] = useState(false)
    const [otp, setotp] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setloading] = useState(false);

    useFocusEffect(
        React.useCallback(() => {

            return () => {
                setPassword(null)
                setotp(null)
            }
        }, []),
    );

    const handleresetpass = async () => {
        if (!email || !password || !otp) {
            showToast("error", "Error", "Required Field", true, 3000);
        }
        else {
            const formData = new FormData();
            formData.append('password', password);
            formData.append('password_confirmation', password);
            formData.append('email', email);
            formData.append('otp', otp);

            try {
                setloading(true)
                const response = await fetch('https://vr.evolvsolution.com/api/reset-password', {
                    method: 'POST',
                    body: formData,
                });

                const result = await response.json();
                if (response.ok) {
                    setloading(false)
                    // console.log('Signup successful:', result);
                    navigation.navigate('Login');
                } else {
                    setloading(false)
                    showToast("error", "Error", result.message, true, 3000);
                    // console.error('Signup failed:', result);
                }
            } catch (error) {
                setloading(false)
                showToast("error", "Error", result.message, true, 3000);
                // console.error('Error:', error);
            }
        }
    };

    return (
        <>

            <View style={tw` bg-slate-50 flex-1  `}>
                <Screensheader
                    // name={"Signup"}
                    // left={25}
                    onPress={() => (
                        navigation.goBack()
                    )}
                />
                <View style={tw`items-center`}>
                    <View style={tw`w-80 h-20 items-start justify-center mt-5`}>
                        <Text style={[tw`text-3xl font-bold text-gray-400`, { color: '#199A8E' }]}>
                            Create New Password?
                        </Text>
                        <Text style={[tw`text-sm font-normal text-gray-400`, { color: '#199A8E' }]}>
                            Enter Your New Password For Login
                        </Text>
                    </View>


                    <View style={tw`mt-10`}>
                        <Input
                            value={password}
                            onchangetext={setPassword}
                            entry={true}
                            source={require("../../Images/padlock.png")}
                            placeholder={"Enter Your New Pass"}
                        />

                        <Input
                            value={otp}
                            onchangetext={setotp}
                            source={require("../../Images/padlock.png")}
                            placeholder={"Enter Your OTP"}
                        />



                        {
                            loading ?
                                <ActivityIndicator size={'large'} color={'#199A8E'} style={tw`mt-5`} />
                                :
                                <View style={tw` justify-between w-80 h-15 mt-5 `}>
                                    <Buttonnormal
                                        onPress={() => {
                                            // navigation.navigate('Login')
                                            handleresetpass()
                                        }}
                                        c1={'#199A8E'}
                                        c2={'#199A8E'}
                                        style={tw`text-white`}
                                        title={"RESET PASSWORD"}
                                    />

                                </View>
                        }


                    </View>

                </View>
                <Toast />
            </View>
        </>
    )
}

export default Newpass