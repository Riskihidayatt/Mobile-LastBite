import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const StoreCard = ({ store }) => {
    const navigation = useNavigation();

    const handlePress = () => {
        // Navigate to CartScreen when a store is pressed
        navigation.navigate('CartMain', { storeId: store.id, storeName: store.name });
    };

    return (
        <TouchableOpacity onPress={handlePress} className="bg-white dark:bg-gray-800 rounded-xl shadow-gray-50 mx-5 mb-6 overflow-hidden">
            <Image source={store.image} className="w-full h-48 object-cover" />
            <View className="p-4">
                <Text className="text-2xl font-bold text-gray-800 dark:text-white text-center mb-2">{store.name}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default StoreCard;
