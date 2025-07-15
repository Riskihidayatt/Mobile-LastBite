import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

const StoreCard = ({ store, onPress }) => {
    const { theme } = useContext(ThemeContext);
    const isDarkMode = theme === 'dark';

    return (
        <TouchableOpacity onPress={onPress} className={`rounded-xl shadow-gray-50 mx-5 mb-6 overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <Image source={store.image ? { uri: store.image } : require('../assets/foodearth.png')} className="w-full h-48 object-cover" />
            <View className="p-4">
                <Text className={`text-2xl font-bold text-center mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{store.name}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default StoreCard;
