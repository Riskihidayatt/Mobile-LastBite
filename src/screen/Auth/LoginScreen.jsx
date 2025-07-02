// File: src/screen/Auth/LoginScreen.jsx

import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Entypo } from '@expo/vector-icons';
import { ThemeContext } from '../../context/ThemeContext';

const DUMMY_CREDENTIALS = {
    email: 'user@gmail.com',
    password: '123',
};

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { theme } = useContext(ThemeContext);
    const isDarkMode = theme === 'dark';

    const handleLogin = () => {
        if (!email || !password) {
            Alert.alert('Gagal Masuk', 'Mohon isi email dan password.');
            return;
        }

        if (email.toLowerCase() === DUMMY_CREDENTIALS.email && password === DUMMY_CREDENTIALS.password) {
            console.log('Login berhasil!');
            navigation.replace('MainApp');
        } else {
            Alert.alert('Gagal Masuk', 'Email atau password yang Anda masukkan salah.');
        }
    };

    const gradientColors = isDarkMode ? ['#1F2937', '#111827'] : ['#ECFDF5', '#D1FAE5'];
    const inputBgColor = isDarkMode ? 'bg-gray-700' : 'bg-white';
    const iconColor = isDarkMode ? '#D1D5DB' : '#6B7280';

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={gradientColors[0]} />
            <LinearGradient colors={gradientColors} className="flex-1">
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1 justify-center items-center px-6"
                >
                    <View className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg shadow-black/20 dark:shadow-gray-900">
                        <Image
                            source={require('../../assets/logo fix.png')}
                            className="w-28 h-28 self-center mb-5"
                            resizeMode="contain"
                        />

                        {/* Email */}
                        <Text className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Email</Text>
                        <View className={`flex-row items-center ${inputBgColor} rounded-xl mb-4 px-4 border border-gray-200 dark:border-gray-600`}>
                            <Feather name="mail" size={20} color={iconColor} />
                            <TextInput
                                className="flex-1 h-12 text-base text-gray-800 dark:text-white ml-3"
                                placeholder="youremail@example.com"
                                placeholderTextColor={iconColor}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>

                        {/* Password */}
                        <Text className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Password</Text>
                        <View className={`flex-row items-center ${inputBgColor} rounded-xl px-4 border border-gray-200 dark:border-gray-600`}>
                            <Feather name="lock" size={20} color={iconColor} />
                            <TextInput
                                className="flex-1 h-12 text-base text-gray-800 dark:text-white ml-3"
                                placeholder="••••••••"
                                placeholderTextColor={iconColor}
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={setPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Entypo
                                    name={showPassword ? 'eye' : 'eye-with-line'}
                                    size={20}
                                    color={iconColor}
                                />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity onPress={() => console.log('Forgot Password Pressed')}>
                            <Text className="text-sm text-green-500 text-right mt-2 mb-5 font-semibold">
                                Lupa Password?
                            </Text>
                        </TouchableOpacity>

                        {/* Tombol Login */}
                        <TouchableOpacity
                            onPress={handleLogin}
                            className="bg-green-500 dark:bg-green-600 py-3.5 rounded-xl items-center shadow-lg shadow-green-200 active:bg-green-600"
                        >
                            <Text className="text-white text-lg font-bold">Masuk</Text>
                        </TouchableOpacity>

                        {/* Link ke Register */}
                        <View className="flex-row justify-center mt-6">
                            <Text className="text-sm text-gray-600 dark:text-gray-300">Belum punya akun? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                <Text className="text-sm font-bold text-green-500">Daftar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </LinearGradient>
        </SafeAreaView>
    );
}
