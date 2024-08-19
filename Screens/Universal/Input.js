import { View, TextInput, Text, Image } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import Toast from 'react-native-toast-message';



export const showToast = (type, text1, text2, hide, time) => {
    Toast.show({
      type: type,
      text1: text1,
      text2: text2,
      autoHide: hide,
      visibilityTime: time,
      position: 'top'
    });
  }


export const Input = ({source, placeholder, onchangetext, onblur, value, entry }) => (
    <>
        <View style={tw`flex-row justify-between rounded-3xl items-center border  w-80  mt-3 `}>
            <TextInput
                placeholder={placeholder}
                onChangeText={onchangetext}
                onBlur={onblur}
                value={value}
                secureTextEntry={entry}
                style={[tw`h-12 w-65 rounded-3xl text-start pl-5 border-black `]}
            >
            </TextInput>
            <Image
                source={source}
                style={tw`h-5 w-5 -left-5  justify-end`}
            />

        </View>
    </>
)


export const Input1 = ({ placeholder, onchangetext,keyboardType, onblur, value, entry }) => (
    <>
        <View style={tw`flex-row justify-center  mt-3 `}>
            <TextInput
                placeholder={placeholder}
                onChangeText={onchangetext}
                keyboardType={keyboardType}
                onBlur={onblur}
                value={value}
                secureTextEntry={entry}
                style={[tw`h-12  w-80 border rounded-md text-start pl-5 border-white `, { backgroundColor: "#EEEEEE" }]}

            ></TextInput>
        </View>
    </>
)



export const Error = ({ error, errors, touch }) => (
    <>

        {(errors && touch) &&
            <Text style={tw`ml-10  mt-3 text-red-500`}>
                {error}
            </Text>
        }

    </>
)
