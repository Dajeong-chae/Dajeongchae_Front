import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, Platform } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import PostScreen from '../screens/PostScreen';
import MyPageScreen from '../screens/MyPageScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="게시판" //디폴트 화면
      screenOptions={({ route }) => ({
        tabBarIcon: () => {
          let iconSource;

          if (route.name === '홈') {
            iconSource = require('../assets/home_icon.png');
          } else if (route.name === '게시판') {
            iconSource = require('../assets/post_icon.png');
          } else if (route.name === '마이') {
            iconSource = require('../assets/my_icon.png');
          }

          return (
            <Image
              source={iconSource}
              style={{
                width: 24,
                height: 24,
              }}
              resizeMode="contain"
            />
          );
        },
        tabBarActiveTintColor: '#FF5B35',
        tabBarInactiveTintColor: '#FF5B35',
        headerShown: false,
        tabBarStyle: {
          paddingBottom: Platform.OS === 'ios' ? 8 : 4,
          paddingTop: 8,
          height: 90, 
        },
        tabBarLabelStyle: {
          fontSize: 12,
          paddingTop: 5,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen name="홈" component={HomeScreen} />
      <Tab.Screen name="게시판" component={PostScreen} />
      <Tab.Screen name="마이" component={MyPageScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;