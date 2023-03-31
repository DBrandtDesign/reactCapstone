import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TextInput, Pressable, SectionList, Alert } from 'react-native';
import { createTable, getMenuItems, saveMenuItems, filterByQueryAndCategories, } from "../database";
import { Searchbar } from "react-native-paper";
import { getSectionListData, useUpdateEffect, validateEmail, validateName } from "../util";
import Categories from "../components/Categories";
//import "../index.css";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

const apiURL =
  "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json";
const sections = ["starters", "mains", "desserts"];

const MenuItem = ({ name, price, description, imageFileName }) => (
    <View style={styles.item}>
      <View style={styles.itemBody}>
        <Text style={styles.name}>{name}</Text>
        <Text numberOfLines={2} ellipsizeMode='tail' style={styles.description}>{description}</Text>
        <Text style={styles.price}>${price}</Text>
      </View>
      <Image
        style={styles.itemImage}
        source={{
          uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${imageFileName}?raw=true`,
        }}
      />
    </View>
  );

const Home = ({ navigation }) => {
  const [profile, setProfile] = useState({
    firstName: "D",
    lastName: "B",
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
  const [filterSelections, setFilterSelections] = useState(
    sections.map(() => false)
  );

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

  useEffect(() => {
    (async () => {
      let menuItems = [];
      try {
        await createTable();
        menuItems = await getMenuItems();
        if (!menuItems.length) {
          menuItems = await fetchData();
          saveMenuItems(menuItems);
        }
        const sectionListData = getSectionListData(menuItems);
        setData(sectionListData);
        const getProfile = await AsyncStorage.getItem("Profile");
        //setProfile(JSON.parse(getProfile));
      } catch (e) {
        Alert.alert(e.message);
      }
    })();
  }, []);

  const handleSearchChange = text => {
    setSearchText(text);
    debouncedLookup(text);
  };
  
  const handleFiltersChange = async index => {
    const fixed = [...filterSelections];
    fixed[index] = !filterSelections[index];
    setFilterSelections(fixed);
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
          {profile && profile.image ? (
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
      <View style={styles.heroSection}>
        <Text style={styles.heroHeader}>Little Lemon</Text>
        <View style={styles.heroBody}>
          <View style={styles.heroContent}>
            <Text style={styles.heroSubHeader}>Chicago</Text>
            <Text style={styles.heroText}>
              We are a family owned Mediterranean restaurant, focused on
              traditional recipes served with a modern twist.
            </Text>
          </View>
          <Image
            style={styles.heroImage}
            source={require("../assets/food.png")}
            accessible={true}
            accessibilityLabel={"Little Lemon Food"}
          />
        </View>
        <Searchbar
          placeholder="Search"
          placeholderTextColor="#333333"
          onChangeText={handleSearchChange}
          value={searchText}
          style={styles.searchBar}
          iconColor="#333333"
          inputStyle={{ color: "#333333" }}
          elevation={0}
        />
      </View>
      <Text style={styles.title}>ORDER FOR DELIVERY!</Text>
      <Categories
        selections={filterSelections}
        onChange={handleFiltersChange}
        sections={sections}
      />
      <SectionList
        style={styles.sectionList}
        sections={data}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <MenuItem
            name={item.name}
            price={item.price}
            description={item.description}
            imageFileName={item.image}
          />
        )}
        renderSectionHeader={({ section: { name } }) => (
          <Text style={styles.itemHeader}>{name}</Text>
        )}
      />
    </View>
  );
}; 
    
export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    paddingTop: 40,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "center"
  },
  title: {
    fontFamily: "Karla-Regular",
    fontSize: 30,
    padding: 10,
    textAlign: "center",
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
    fontSize: 24,
    color: "#000000",
    paddingBottom: 5,
    fontFamily: "Karla-Regular",
  },
  description: {
    color: "#495e57",
    fontSize: 20,
    paddingRight: 5,
    
    fontFamily: "Karla-Regular",
  },
  price: {
    fontSize: 20,
    color: "#495e57",
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
    right: 18,
    top: 40,
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
  heroSection: {
    backgroundColor: "#495e57",
    padding: 15,
  },
  heroHeader: {
    color: "#f4ce14",
    fontSize: 80,
    fontFamily: "MarkaziText-Regular",
    marginTop: -10,
  },
  heroSubHeader: {
    color: "#fff",
    fontSize: 50,
    fontFamily: "MarkaziText-Regular",
    marginTop: -20,
  },
  heroText: {
    color: "#fff",
    fontFamily: "Karla-Regular",
    fontSize: 20,
    marginTop: 20,
  },
  heroBody: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  heroContent: {
    flex: 1,
  },
  heroImage: {
    width: 150,
    height: 150,
    borderRadius: 12,
  },
  sectionList: {
    paddingHorizontal: 16,
  },
  searchBar: {
    marginTop: 15,
    backgroundColor: "#e4e4e4",
  },
});