import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import Onboarding from './screens/Onboarding';
import Profile from './screens/Profile';
import Home from './screens/Home.js'
import SplashScreen from './screens/SplashScreen'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useUpdate from './useUpdate';

const Stack = createNativeStackNavigator();
const temp = true;

export default function App({ navigation }) {
  const [userPref, setUserPref] = useState({
    onboarding: true,
    loggedIn: false,
    latestNews: false,
  });

  useEffect(() => {
    // Populating preferences from storage using AsyncStorage.multiGet
    (async () => {
      try {
        const values = await AsyncStorage.multiGet(Object.keys(userPref));
        const initialState = values.reduce((acc, curr) => {
          // Every item in the values array is itself an array with a string key and a stringified value, i.e ['pushNotifications', 'false']
          acc[curr[0]] = JSON.parse(curr[1]);
          return acc;
        }, {});
        setUserPref(initialState);
      } catch (e) {
        Alert.alert(`An error occurred: ${e.message}`);
      }
    })();
  }, []);

  // This effect only runs when the preferences state updates, excluding initial mount
  useUpdate(() => {
    (async () => {
      // Every time there is an update on the preference state, we persist it on storage
      // The exercise requierement is to use multiSet API
      const keyValues = Object.entries(userPref).map((entry) => {
        return [entry[0], String(entry[1])];
      });
      try {
        await AsyncStorage.multiSet(keyValues);
      } catch (e) {
        Alert.alert(`An error occurred: ${e.message}`);
      }
    })();
  }, [userPref]);

  // if (state.isLoading) {
  //   // We haven't finished reading from AsyncStorage yet
  //   return <SplashScreen />;
  // }
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          { temp ? (
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Profile" component={Profile} />
          ) : (
            // User is NOT signed in
            <Stack.Screen name="Onboarding" component={Onboarding} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}