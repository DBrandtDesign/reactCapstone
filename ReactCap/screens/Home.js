import React, { useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, TextInput, Pressable } from 'react-native';
import { Spacer } from 'react-native-flex-layout';
import {validateEmail, validateName} from "../util.js"
//import "../index.css";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

const apiURL =
  "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json";
const categories = ["starters", "mains", "desserts"];

const Home = ({ navigation }) => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    orderStatus: false,
    passwordChanges: false,
    specialOffers: false,
    newsletter: false,
    image: "",
  });
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [query, setQuery] = useState("");
  // const [filterSelections, setFilterSelections] = useState(
  //   sections.map(() => false)
  // );
  
  const fetchData = async () => {
    try {
      const response = await fetch(apiURL);
      const json = await response.json();
      const menu = json.menu.map((item, index) => ({
        id: index+1,
        name: item.name,
        price: item.price.toString(),
        description: item.description,
        image: item.image,
        category: item.category,
      }));
      return menu;
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  
  //Font Stuff
  const [fontsLoaded] = useFonts({
    "Karla-Regular": require("../assets/fonts/Karla-Regular.ttf"),
    "MarkaziText-Regular": require("../assets/fonts/MarkaziText-Regular.ttf"),
  });
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);
  if (!fontsLoaded) {
    return null;
  }
  
  return(
    <View style={styles.container}>
      <Text style={styles.title}> 
        Home
      </Text>
    </View>
  );
}; 
    
export default Home;

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
    fontFamily: "Karla-Regular",
    fontSize: 38,
    paddingTop: 80,
  },
  title: {
    fontFamily: "MarkaziText-Regular",
    fontSize: 45,
    paddingTop: 10,
  }
});