import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import React from 'react';
import tw from 'twrnc';
import Screensheader from '../Universal/Screensheader';

const PP = ({ navigation }) => {
  return (
    <SafeAreaView style={[{ backgroundColor: '#FFFFFF', flex: 1 }]}>
      <Screensheader
        name={'Privacy Policy'}
        left={18}
        onPress={() => navigation.goBack()}
      />
      <ScrollView vertical showsVerticalScrollIndicator={true}>
        <View style={tw`items-start self-center flex-1`}>
          <Text style={tw`w-80 text-sm text-start  mt-10`}>
            Welcome to Dee-Fliz! We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, share, and protect your data when you use our application. When you sign up, we may collect your name, email address, and other account details. This information is essential for creating and managing your account, providing access to various features and services offered by Dee-Fliz, and delivering personalized experiences. Your email address may be used to send you important updates, notifications, and promotional materials unless you choose to opt-out.

            The account information you provide is critical for the seamless operation of Dee-flizz. It allows us to personalize your experience, ensuring that you receive the most relevant content and services. For instance, we might use your account information to tailor recommendations and reminders, helping you manage your health and wellness more effectively. Additionally, we may use your email address to inform you about new features, updates, or special offers that might interest you. However, you can control your communication preferences and opt-out of receiving promotional emails at any time by following the instructions in the emails or through your account settings.

           
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PP;
