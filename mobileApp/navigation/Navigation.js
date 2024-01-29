import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import TakePhotoScreen from '../screens/TakePhotoScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const Navigation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Tab.Navigator
          tabBarOptions={{
            activeTintColor: '#3498db',
            inactiveTintColor: 'gray',
            showLabel: false, 
            style: {
              backgroundColor: '#fff', 
            },
          }}>
          <Tab.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Icon name="dashboard" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="TakePhoto"
            component={TakePhotoScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Icon name="camera" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Profile"
            options={{
              tabBarIcon: ({ color, size }) => (
                <Icon name="user" color={color} size={size} />
              ),
            }}
          >
            {(props) => <ProfileScreen {...props} onLogout={handleLogout} />}
          </Tab.Screen>
        </Tab.Navigator>

      ) : (
        <Stack.Navigator initialRouteName={'login'} screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login">
            {(props) => <LoginScreen {...props} onLoginSuccess={handleLoginSuccess} />}
          </Stack.Screen>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default Navigation;
