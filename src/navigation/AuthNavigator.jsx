import React, { useContext } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import LoginScreen from '../screen/Auth/LoginScreen';
import RegisterScreen from '../screen/Auth/RegisterScreen';
import { ThemeContext } from '../context/ThemeContext';

const Tab = createMaterialTopTabNavigator();

const AuthNavigator = () => {
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';

  return (
    <Tab.Navigator
      initialRouteName="LoginTab"
      screenOptions={{
        swipeEnabled: false,
        tabBarShowLabel: false,
        tabBarButton: () => null,
        tabBarActiveTintColor: isDarkMode ? '#34D399' : '#28A745',
        tabBarInactiveTintColor: isDarkMode ? '#9CA3AF' : 'gray',
        tabBarIndicatorStyle: {
          backgroundColor: isDarkMode ? '#34D399' : '#28A745',
        },
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
          height: 0,
        },
        tabBarLabelStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="LoginTab"
        component={LoginScreen}
        options={{ title: 'Masuk Akun' }}
      />
      <Tab.Screen
        name="RegisterTab"
        component={RegisterScreen}
        options={{ title: 'Daftar Akun' }}
      />
    </Tab.Navigator>
  );
};

export default AuthNavigator;
