import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LandScr from './screens/LandScr';
import HomeScr from './screens/HomeScr';
import ResScr from './screens/ResScr';
import TripHistScr from './screens/TripHistScr';
import { AppProv } from './context/AppCont';

export type RootStackParamList = { Landing: undefined; Home: undefined; Results: undefined; History: undefined };

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <AppProv>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Landing" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Landing" component={LandScr} />
          <Stack.Screen name="Home" component={HomeScr} />
          <Stack.Screen name="Results" component={ResScr} />
          <Stack.Screen name="History" component={TripHistScr} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProv>
  );
};

export default App;