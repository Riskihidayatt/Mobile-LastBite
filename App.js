// App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, ThemeContext } from './src/context/ThemeContext';
import { StatusBar } from 'react-native';
import './global.css';
import WelcomeScreen from './src/screen/Welcomescreen/WelcomeScreen';
import LoginScreen from './src/screen/Auth/LoginScreen';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';

const Stack = createNativeStackNavigator();
const RootNavigator = () => {
    const { theme } = React.useContext(ThemeContext);
    const isDarkMode = theme === 'dark';

    return (
        <NavigationContainer>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <Stack.Navigator initialRouteName="Welcome">
                <Stack.Screen
                    name="Welcome"
                    component={WelcomeScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ title: 'Masuk Akun' }}
                />

                {/* Setelah login berhasil, arahkan ke "MainApp".
                  Komponen ini berisi semua layar utama dengan navigasi tab di bawah.
                */}
                <Stack.Screen
                    name="MainApp"
                    component={BottomTabNavigator} // -> Gunakan BottomTabNavigator di sini
                    options={{ headerShown: false }} // -> Sembunyikan header agar tidak tumpang tindih
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default function App() {
    return (
        <ThemeProvider>
            <SafeAreaProvider>
                <RootNavigator />
            </SafeAreaProvider>
        </ThemeProvider>
    );
}
