import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TextInput, Pressable } from 'react-native';
import { Spacer } from 'react-native-flex-layout';
import {validateEmail, validateName} from "../util.js"
//import "../index.css";


const greeting = "Let us get to know you";

const Onboarding = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nextNow, setNextNow] = useState(true);

  const [userPref, setUserPref] = useState({
    onboarding: true,
    loggedIn: false,
    latestNews: false,
  });

  const updateState = (key) => () =>
    setUserPref((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));

  const getIsFormValid = () => { 
    console.log('validations');
    console.log(userPref);
    //console.log(validateName(name));
    //console.log(validateEmail(email));
    //console.log(Boolean(name));
    //console.log(userPref);
    return ( 
      name && 
      validateEmail(email) && 
      validateName(name)
    ); 
  }; 

  return(
    <View style={styles.container}>
      <View style={styles.top}>
        <Image 
          style={styles.stretch}
          source={require('../assets/logo.png')}
          alt="logo" 
        />
      </View>
      <Text style={styles.header}> 
        {greeting} 
      </Text>
      <Spacer />
      <Text style={styles.title}> 
        First Name
      </Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="First Name"
      />
      <Text style={styles.title}> 
        Email
      </Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
      />
      <View style={styles.footer}>
        <Pressable 
          style={styles.button}
          disabled={!getIsFormValid()}
          onPress={() => {
            updateState('onboarding');
            navigation.navigate('Profile');
          }}>
          <Text style={styles.buttonText}> 
            Next 
          </Text>
        </Pressable>
      </View>
    </View>
  );
}; 
    
export default Onboarding;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    //flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '100%',
    textAlign: 'center',
    backgroundColor: '#999',
  },
  stretch: {
    resizeMode: 'contain',
    height: 70,
    width: 400,
    backgroundColor: '#aaa',
  },
  button: {
    fontSize: 18,
    padding: 6,
    marginVertical: 26,
    margin: 30,
    marginLeft: 260,
    backgroundColor: '#aaa',
    borderRadius: 8
  },
  buttonText: {
    color: '#333333',
    textAlign: 'center',
    fontSize: 24,
  },
  top: {
    paddingTop: 50,
    height: 140,
    width: 400,
    backgroundColor: '#aaa',
  },
  footer: {
    marginTop: 60,
    paddingTop: 30,
    height: 170,
    width: 400,
    backgroundColor: '#ccc',
  },
  input: {
    height: 50,
    width: 300,
    margin: 10,
    borderWidth: 2,
    borderRadius: 6,
    padding: 10,
    fontSize: 24,
  },
  header: {
    //fontFamily: "Regular",
    fontSize: 28,
    paddingTop: 80,
  },
  title: {
    //fontFamily: "Regular",
    fontSize: 28,
    paddingTop: 10,
  }
});