import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import tw from "twrnc"
import { Input } from '../Universal/Input'
import CheckBox from '@react-native-community/checkbox';
import { Buttonnormal } from '../Universal/Buttons';
import Screensheader from '../Universal/Screensheader';

const Code = ({ navigation }) => {

  const [customerflag, setcustomerflag] = useState(true)
  const [customerflag1, setcustomerflag1] = useState(false)
  const [toggleCheckBox, setToggleCheckBox] = useState(false)

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
              Enter Code?
            </Text>
            <Text style={[tw`text-sm font-normal text-gray-400`, { color: '#199A8E' }]}>
              Enter Code That We Have Send To Your Number 0929292*****
            </Text>
          </View>


          <View style={tw`mt-10`}>
            <Input

              source={require("../../Images/padlock.png")}
              placeholder={"Enter Your Code"}
            />




            <View style={tw` justify-between w-80 h-15 mt-5 `}>
              <Buttonnormal
                onPress={() => {
                  navigation.navigate('Newpass')
                }}
                c1={'#199A8E'}
                c2={'#199A8E'}
                style={tw`text-white`}
                title={"CONFORM CODE"}
              />



            </View>
          </View>

        </View>
      </View>
    </>
  )
}

export default Code