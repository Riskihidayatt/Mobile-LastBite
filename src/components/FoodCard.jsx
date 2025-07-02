// src/components/FoodCard.js
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const FoodCard = ({ item }) => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            onPress={() => navigation.navigate('DetailMenu', { item: item })}
            className="bg-white mt-5 rounded-xl shadow-lg overflow-hidden"
        >
            {/* Gambar */}
            <Image
                source={{ uri: item.image }}
                className="w-full h-40"
                resizeMode="cover"
            />

            {/* Info */}
            <View className="p-3 flex-row justify-between items-start ">
                {/* Kiri - Nama dan Menu */}
                <View>
                    <Text className="text-base font-bold text-black capitalize">
                        {item.name}
                    </Text>
                    <Text className="text-sm text-[#28A745] mt-1">{item.dish}</Text>
                </View>

                {/* Kanan - Harga */}
                <View className="items-end">
                    <Text className="text-red-500 font-bold text-base">Rp.{item.price}</Text>
                    <Text className="text-xs text-gray-400 line-through">Rp.{item.oldPrice}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default FoodCard;
