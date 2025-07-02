import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Menggunakan ikon dari Expo
import { ThemeContext } from '../context/ThemeContext';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screen/Home/HomeScreen';
import DetailMenuScreen from '../screen/Home/DetailMenuScreen';
import OrderScreen from '../screen/Order/OrderScreen';
import RatingScreen from '../screen/Order/RatingScreen';
import CartStack from './CartStack';
import ProfileScreen from "../screen/Profile/ProfileScreen";
import EditProfileScreen from "../screen/Profile/EditProfileScreen";

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const OrderStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

const HomeStackScreen = () => (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
        <HomeStack.Screen name="HomeMain" component={HomeScreen} />
        <HomeStack.Screen name="DetailMenu" component={DetailMenuScreen} />
    </HomeStack.Navigator>
);

const OrderStackScreen = () => (
    <OrderStack.Navigator screenOptions={{ headerShown: false }}>
        <OrderStack.Screen name="OrderMain" component={OrderScreen} />
        <OrderStack.Screen name="RatingScreen" component={RatingScreen} />
    </OrderStack.Navigator>
);

const ProfileStackScreen = () => (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
        <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
        <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
    </ProfileStack.Navigator>
);

const BottomTabNavigator = () => {
    const { theme } = useContext(ThemeContext);
    const isDarkMode = theme === 'dark';

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false, // Menyembunyikan header default dari setiap screen
                tabBarActiveTintColor: '#28A745', // Warna ikon aktif (hijau)
                tabBarInactiveTintColor: isDarkMode ? '#9CA3AF' : 'gray', 
                tabBarShowLabel: true,
                tabBarStyle: {
                    paddingBottom: 5,
                    paddingTop: 5,
                    height: 60,
                    backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                    borderTopColor: isDarkMode ? '#374151' : '#E5E7EB',
                    display: route.state && route.state.routes[route.state.index].name === 'DetailMenu' ? 'none' : 'flex',
                },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Cart') {
                        iconName = focused ? 'cart' : 'cart-outline';
                    } else if (route.name === 'Order') {
                        iconName = focused ? 'receipt' : 'receipt-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person-circle' : 'person-circle-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeStackScreen} />
            <Tab.Screen name="Order" component={OrderStackScreen} />
            <Tab.Screen name="Cart" component={CartStack} />
            <Tab.Screen name="Profile" component={ProfileStackScreen} />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;