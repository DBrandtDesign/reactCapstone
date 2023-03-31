import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import Onboarding from './screens/Onboarding';
import Profile from './screens/Profile';
import Home from './screens/Home.js'
import * as SplashScreen from "expo-splash-screen";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useUpdate from './useUpdate';
import { useFonts } from "expo-font";

const Stack = createNativeStackNavigator();
const temp = true;

export default function App({ navigation }) {
  const [userPref, setUserPref] = useState({
    onboarding: true,
  });

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
    <NavigationContainer>
      <Stack.Navigator>
        { temp ? (
          <>
            <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
            <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
          </>
        ) : (
          // User is NOT signed in
          <Stack.Screen name="Onboarding" component={Onboarding} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}