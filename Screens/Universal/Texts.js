import { View, Text, SafeAreaView, TextInput, TouchableOpacity, Image, Alert, ScrollView } from 'react-native'
import React from 'react'
import tw from 'twrnc'


export const Texts = ({ style, title,onPress }) => (
    <>
        <View >
           
                <Text style={style} onPress={onPress}>{title}</Text>
           
        </View>
    </>
)

