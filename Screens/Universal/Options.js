import { View, Text, Image, TouchableOpacity, Switch } from 'react-native';
import React, { useState } from 'react';
import tw from 'twrnc';

const Options = ({ text, top, onPress, top1, text1, flag, left, logo }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return (
    <>
      <View >
        <View style={tw` w-80 h-15 `}>
          <TouchableOpacity onPress={onPress}>
            <View style={tw` flex-row justify-between items-center`}>
              <View style={tw` w-40 items-start justify-center h-15`}>
                <Text style={tw`text-lg font-mono font-bold `}>{text}</Text>
              </View>
              <View>
                {flag ? (
                  <Image
                    source={require('../../Images/right.png')}
                    style={tw`h-6 w-6  top-1`}
                  />
                ) :
                  (
                    <>
                      <Text
                        style={tw`h-6 w-6 font-bold text-blue-600  top-1`}>
                        {text1}
                      </Text>
                    </>
                  )}
              </View>
            </View>
          </TouchableOpacity>
           <Image
          source={require('../../Images/line.png')}
          style={tw`w-80  self-center`}
        />
        </View>
        {/* <Image
          source={require('../../Images/line.png')}
          style={tw`w-80 top-${top1} self-center`}
        /> */}
      </View>
    </>
  );
};

export default Options;
