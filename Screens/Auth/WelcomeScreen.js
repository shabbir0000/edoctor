// src/screens/WelcomeScreen.js

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image resizeMode='contain' source={require('../../Images/deefelz.png')} style={styles.logo} />
      <Text style={styles.title}>Dee-Filz</Text>
      <Text style={styles.subtitle}>Let's get started!</Text>
      <Text style={styles.description}>Login to enjoy the features we’ve provided, and stay healthy!</Text>
      
      <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signUpButton} onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signUpButtonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0B4064',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#7e7e7e',
    textAlign: 'center',
    marginBottom: 40,
  },
  loginButton: {
    backgroundColor: '#0B4064',
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 30,
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signUpButton: {
    borderColor: '#0B4064',
    borderWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 30,
  },
  signUpButtonText: {
    color: '#00B1E7',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen;
