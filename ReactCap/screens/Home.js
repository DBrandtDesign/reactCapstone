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

const menuItem = ({ name, price, description, image }) => (
    <View style={styles.item}>
      <View style={styles.itemBody}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.price}>${price}</Text>
      </View>
      <Image
        style={styles.itemImage}
        source={{
          uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${image}?raw=true`,
        }}
      />
    </View>
  );

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
    <View style={styles.container} onLayout={onLayoutRootView}>
      <View style={styles.header}>
        <Image
          style={styles.logo}
          source={require("../img/littleLemonLogo.png")}
          accessible={true}
          accessibilityLabel={"Little Lemon Logo"}
        />
        <Pressable
          style={styles.avatar}
          onPress={() => navigation.navigate("Profile")}
        >
          {profile.image ? (
            <Image source={{ uri: profile.image }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarEmpty}>
              <Text style={styles.avatarEmptyText}>
                {profile.firstName && Array.from(profile.firstName)[0]}
                {profile.lastName && Array.from(profile.lastName)[0]}
              </Text>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
}; 
    
export default Home;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    //flexDirection: 'column',
    justifyContent: 'space-around',
    height: '100%',
    textAlign: 'center',
    backgroundColor: '#FFF',
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
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#cccccc",
    paddingVertical: 10,
  },
  itemBody: {
    flex: 1,
  },
  itemHeader: {
    fontSize: 24,
    paddingVertical: 8,
    color: "#495e57",
    backgroundColor: "#fff",
    fontFamily: "Karla-Regular",
  },
  name: {
    fontSize: 20,
    color: "#000000",
    paddingBottom: 5,
    fontFamily: "Karla-Regular",
  },
  description: {
    color: "#495e57",
    paddingRight: 5,
    fontFamily: "Karla-Regular",
  },
  price: {
    fontSize: 20,
    color: "#EE9972",
    paddingTop: 5,
    fontFamily: "Karla-Regular",
  },
  itemImage: {
    width: 100,
    height: 100,
  },
  logo: {
    height: 50,
    width: 150,
    resizeMode: "contain",
  },
  avatar: {
    flex: 1,
    position: "absolute",
    right: 10,
    top: 10,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarEmpty: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#0b9a6a",
    alignItems: "center",
    justifyContent: "center",
  },
});