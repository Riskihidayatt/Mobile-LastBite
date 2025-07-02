import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../../context/ThemeContext';

const WelcomeScreen = () => {
    const navigation = useNavigation();
    const { theme } = useContext(ThemeContext);

    return (
        <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900 px-6">
            <Image
                source={require('../../assets/foodearth.png')}
                className="w-80 h-80 mb-6"
                resizeMode="contain"
            />

            <Text className="text-xl font-bold text-center mb-2 dark:text-white">
                {`Save Food, Save Money,\nSave Earth`}
            </Text>

            <Text className="text-sm text-gray-600 dark:text-gray-300 text-center mb-6">
                Discover surplus food from local vendors at discounted prices.
                Reduce waste and enjoy great deals.
            </Text>

            <TouchableOpacity
                className="bg-green-500 dark:bg-green-600 px-8 py-3 rounded-full shadow-lg shadow-green-200"
                activeOpacity={0.8}
                onPress={() => navigation.navigate('Login')}
            >
                <Text className="text-white font-semibold text-base">Get Started</Text>
            </TouchableOpacity>
        </View>
    );
};

export default WelcomeScreen;
