import React, { useContext } from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';
import StoreCard from '../../components/StoreCard';
import {colors} from "../../assets/colors";
import {LinearGradient} from "expo-linear-gradient";



const stores = [
    {
        id: '1',
        name: 'Warung Pak Selamet',
        image: require('../../assets/ayam-bakar.jpg'), // Replace with actual image for Pak Selamet
    },
    {
        id: '2',
        name: 'Nasi Padang Pak Jo',
        image: require('../../assets/ayam-bakar.jpg'), // Replace with actual image for Pak Jo
    },
    {
        id: '3',
        name: 'Nasi Padang Mak Jo',
        image: require('../../assets/ayam-bakar.jpg'), // Replace with actual image for Mak Jo
    },
    {
        id: '4',
        name: 'Nasi Padang Pak Jo',
        image: require('../../assets/ayam-bakar.jpg'), // Replace with actual image for Pak Jo
    },
    {
        id: '5',
        name: 'Nasi Padang Mak Jo',
        image: require('../../assets/ayam-bakar.jpg'), // Replace with actual image for Mak Jo
    },
];

const StoreListScreen = () => {
    const { theme } = useContext(ThemeContext);
    const isDarkMode = theme === 'dark';

    return (
        <LinearGradient
            colors={isDarkMode ? colors.gradientDark : colors.gradientLight}
            style={{ flex: 1 }}
        >
            <SafeAreaView className="flex-1">
            <View className="py-4 border-b border-gray-200 dark:border-gray-700">
                <Text className="text-xl font-bold text-center text-gray-800 dark:text-white">Pilih Toko</Text>
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ paddingVertical: 20 }}>
                {stores.map((store) => (
                    <StoreCard key={store.id} store={store} />
                ))}
            </ScrollView>
        </SafeAreaView>
        </LinearGradient>
    );
};

export default StoreListScreen;
