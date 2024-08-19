import { View, Text, StyleSheet } from 'react-native'
import React, { useRef } from 'react'
import Video, { VideoRef } from 'react-native-video';
import tw from "twrnc"
const Showvideo = ({ navigation, route }) => {
    const { video } = route.params
    const videoRef = useRef (null);
    // const background = require('./background.mp4');

    return (
        <View style={tw`flex-1`}>
            <Video
                // Can be a URL or a local file.
                source={{ uri: video }}
                // Store reference  
                ref={videoRef}
                // Callback when remote video is buffering                                      
                // onBuffer={onBuffer}
                // Callback when video cannot be loaded              
                // onError={onError}
                style={tw`h-100 self-center absolute top-40 left-0 bottom-0 right-0`}
                controls={true}
            />
        </View>
    )
}

export default Showvideo


// Later on in your styles..
var styles = StyleSheet.create({
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        height:265
    },
});