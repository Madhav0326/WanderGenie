import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LandScr from '../screens/LandScr';
import HomeScr from '../screens/HomeScr';
import ResScr from '../screens/ResScr';

export type RootStackParamList = {
  Landing: undefined;
  Home: undefined;
  Results: { dest: string; days: string; budget: string; pref: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Landing" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Landing" component={LandScr} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeScr} />
      <Stack.Screen name="Results" component={ResScr} />
    </Stack.Navigator>
  );
}