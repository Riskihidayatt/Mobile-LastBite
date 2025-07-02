import React, { useContext, useState } from 'react';
import { View, Text, SafeAreaView, Image, TouchableOpacity, Switch } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemeContext } from '../../context/ThemeContext';
import { Picker } from '@react-native-picker/picker';

// Placeholder user data for a more dynamic component
const user = {
    name: 'Jhon Doe',
    email: 'jhon.doe@email.com',
    avatar: require('../../assets/logo fix.png'),
};

const ProfileScreen = ({ navigation }) => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const isDarkMode = theme === 'dark';

    // Navigate to Login screen on logout
    const handleLogout = () => {
        navigation.replace('Login');
        console.log('User logged out');
    };

    // Placeholder function for edit profile action
    const handleEditProfile = () => {
        console.log('Navigate to Edit Profile Screen');
        navigation.navigate('EditProfile');
    };

    // Placeholder function for changing profile picture
    const handleChangeProfilePicture = () => {
        console.log('Change Profile Picture');
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <View className="py-4 border-b border-gray-200 dark:border-gray-700">
                <Text className="text-xl font-bold text-center text-gray-800 dark:text-white">Profile Detail</Text>
            </View>

            {/* User Info Section */}
            <View className="items-center mt-12">
                <View className="relative w-28 h-28 rounded-full">
                    <Image
                        source={user.avatar}
                        className="w-full h-full rounded-full"
                    />
                    <TouchableOpacity
                        onPress={handleChangeProfilePicture}
                        className="absolute bottom-0 right-0 bg-green-500 dark:bg-green-600 rounded-full p-2 border-2 border-white dark:border-gray-900"
                    >
                        <Feather name="camera" size={18} color="white" />
                    </TouchableOpacity>
                </View>
                <Text className="text-2xl font-bold text-gray-900 mt-4 dark:text-white">{user.name}</Text>
                <Text className="text-base text-gray-500 mt-1 dark:text-gray-400">{user.email}</Text>
            </View>

            {/* Options Card */}
            <View className={`rounded-2xl shadow-md mx-5 mt-10 p-5 ${isDarkMode ? 'bg-gray-800 shadow-gray-900' : 'bg-white shadow-gray-100'}`}>
                {/* Edit Profile Option */}
                <TouchableOpacity 
                    onPress={handleEditProfile}
                    className={`flex-row items-center p-3 border rounded-xl mb-4 ${isDarkMode ? 'border-gray-700 shadow-gray-900' : 'border-gray-200 shadow-gray-100'}`}>
                    <Feather name="edit-3" size={22} color={isDarkMode ? '#D1D5DB' : '#4B5563'} />
                    <Text className="text-base text-gray-700 font-semibold ml-4 dark:text-gray-200">Edit Profile</Text>
                </TouchableOpacity>

                {/* Dark Mode Toggle Option */}
                <View className={`flex-row items-center justify-between p-3 border rounded-xl ${isDarkMode ? 'border-gray-700 shadow-gray-900' : 'border-gray-200 shadow-gray-100'}`}>
                    <View className="flex-row items-center">
                        <Feather name="moon" size={22} color={isDarkMode ? '#D1D5DB' : '#4B5563'} />
                        <Text className="text-base text-gray-700 font-semibold ml-4 dark:text-gray-200">Tampilan</Text>
                    </View>
                    <Switch
                        trackColor={{ false: '#767577', true: '#34D399' }}
                        thumbColor={isDarkMode ? '#F9FAFB' : '#f4f3f4'}
                        onValueChange={toggleTheme}
                        value={isDarkMode}
                    />
                </View>

                {/* Logout Button */}
                <TouchableOpacity
                    onPress={handleLogout}
                    className="bg-red-500 dark:bg-red-600 rounded-xl py-4 mt-8"
                >
                    <Text className="text-white text-center font-bold text-lg">Keluar</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default ProfileScreen;
