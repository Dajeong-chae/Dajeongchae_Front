// navigation/AppNavigator.tsx
import React from 'react';
import { RootStackParamList } from './RootStackParamList';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import WritePostScreen from '../screens/WritePostScreen';
import DetailPostScreen from '../screens/DetailPostScreen';
const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* 탭 네비게이터를 Stack의 메인으로 */}
        <Stack.Screen name="Main" component={BottomTabNavigator} />
        <Stack.Screen name="WritePostScreen" component={WritePostScreen} />
        <Stack.Screen name="DetailPostScreen" component={DetailPostScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;