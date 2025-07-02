import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { ThemeContext } from '../../context/ThemeContext';
import { useCart } from '../../hooks/useCart';

const DetailMenuScreen = ({ route }) => {
    const navigation = useNavigation();
    const { theme } = useContext(ThemeContext);
    const isDarkMode = theme === 'dark';

    // Menerima data item dari navigasi
    const { item } = route.params;

    const { addItem } = useCart(item.storeId); // Menggunakan storeId dari item

    const formatCurrency = (amount) => {
        return `Rp${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
    };

    const handleAddToCart = () => {
        if (item && item.storeId) {
            addItem(item, item.storeId);
            alert('Item ditambahkan ke keranjang!');
        } else {
            alert('Gagal menambahkan item. Informasi toko tidak ditemukan.');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-100 dark:bg-gray-900">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 shadow-sm">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={isDarkMode ? 'white' : 'black'} />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-800 dark:text-white">Detail Menu</Text>
                <View className="w-6" />
            </View>

            <ScrollView className="flex-1 p-4">
                <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-4">
                    {/* Nama Warung */}
                    <View className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <Text className="text-lg font-bold text-gray-800 dark:text-white">{item.storeName || 'Nama Warung'}</Text>
                    </View>

                    {/* Gambar Makanan */}
                    <Image
                        source={{ uri: item.image }}
                        className="w-full h-60 resize-cover"
                    />

                    {/* Detail Makanan */}
                    <View className="p-4">
                        <View className="flex-row justify-between items-center mb-2">
                            <Text className="text-2xl font-bold text-gray-800 dark:text-white">{item.name}</Text>
                            <View className="flex-row items-center">
                                <Ionicons name="star" size={18} color="#FFD700" />
                                <Text className="text-base text-gray-700 dark:text-gray-300 ml-1">{item.rating || '4.9'}</Text>
                            </View>
                        </View>

                        <View className="flex-row items-baseline mb-4">
                            <Text className="text-xl font-bold text-red-500 mr-2">{formatCurrency(item.price)}</Text>
                            {item.oldPrice && (
                                <Text className="text-sm text-gray-400 line-through">{formatCurrency(item.oldPrice)}</Text>
                            )}
                        </View>

                        <Text className="text-base font-semibold text-gray-800 dark:text-white mb-2">DESKRIPSI :</Text>
                        <Text className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                            {item.description || 'Deskripsi makanan belum tersedia.'}
                        </Text>

                        <Text className="text-base font-semibold text-gray-800 dark:text-white mb-4">TOMBOL LOKASI</Text>

                        {/* Tombol Aksi */}
                        <View className="flex-row justify-between">
                            <TouchableOpacity
                                onPress={handleAddToCart}
                                className="flex-1 bg-gray-200 dark:bg-gray-700 py-3 rounded-xl flex-row items-center justify-center mr-2"
                            >
                                <Feather name="shopping-cart" size={20} color={isDarkMode ? 'white' : 'black'} />
                                <Text className="text-base font-semibold text-gray-800 dark:text-white ml-2">Add cart</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="flex-1 bg-green-500 dark:bg-green-600 py-3 rounded-xl flex-row items-center justify-center ml-2">
                                <Feather name="dollar-sign" size={20} color="white" />
                                <Text className="text-base font-semibold text-white ml-2">Buy Now</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default DetailMenuScreen;
