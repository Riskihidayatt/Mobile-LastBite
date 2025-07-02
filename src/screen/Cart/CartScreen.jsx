import React, { useContext, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemeContext } from '../../context/ThemeContext';
import { useCart } from '../../hooks/useCart';
import {LinearGradient} from "expo-linear-gradient";
import { colors } from '../../assets/colors';

const CartScreen = ({ route }) => {
    const { storeId, storeName } = route.params || {};
    const { theme } = useContext(ThemeContext);
    const isDarkMode = theme === 'dark';
    const { cartItems: allCartItems, increaseQuantity, decreaseQuantity } = useCart();
    const cartItems = allCartItems.filter(item => item.storeId === storeId);
    const [customerNotes, setCustomerNotes] = useState('');

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = 2000;
    const total = subtotal + deliveryFee;

    // Format currency
    const formatCurrency = (amount) => {
        return `Rp${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
    };

    return (
        <LinearGradient
            colors={isDarkMode ? colors.gradientDark : colors.gradientLight}
            style={{ flex: 1 }}
        >
        <SafeAreaView className="flex-1">
            {/* Header */}
            <View className="py-4 border-b border-gray-200 dark:border-gray-700">
                <Text className="text-xl font-bold text-center text-gray-800 dark:text-white">Keranjang Saya {storeName ? `(${storeName})` : ''}</Text>
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 20 }}>
                {/* Cart Items */}
                <View className="mt-6 mx-5">
                    {cartItems.map((item) => (
                        <View key={item.id} className="flex-row items-center bg-white dark:bg-gray-800 rounded-2xl p-4 mb-4 shadow-md shadow-gray-200 dark:shadow-gray-900">
                            <Image source={item.image} className="w-20 h-20 rounded-lg" />
                            <View className="flex-1 ml-4">
                                <Text className="text-lg font-semibold text-gray-800 dark:text-white">{item.name}</Text>
                                <Text className="text-base font-bold text-green-600 dark:text-green-400 mt-1">{formatCurrency(item.price)}</Text>
                            </View>
                            <View className="flex-row items-center">
                                <TouchableOpacity onPress={() => decreaseQuantity(item.id)} className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                                    <Feather name="minus" size={18} color={isDarkMode ? '#FFF' : '#000'} />
                                </TouchableOpacity>
                                <Text className="text-lg font-bold mx-4 text-gray-800 dark:text-white">{item.quantity}</Text>
                                <TouchableOpacity onPress={() => increaseQuantity(item.id)} className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                                    <Feather name="plus" size={18} color={isDarkMode ? '#FFF' : '#000'} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Customer Notes */}
                <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-md shadow-gray-200 mx-5 mt-6 p-5">
                    <Text className="text-xl font-bold text-gray-800 dark:text-white mb-4">Catatan untuk Penjual</Text>
                    <TextInput
                        className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-800 dark:text-white"
                        placeholder="Tambahkan catatan di sini..."
                        placeholderTextColor={isDarkMode ? '#A0A0A0' : '#808080'}
                        multiline
                        numberOfLines={4}
                        value={customerNotes}
                        onChangeText={setCustomerNotes}
                    />
                </View>

                {/* Order Summary */}
                <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-md shadow-gray-200 mx-5 mt-6 p-5">
                    <Text className="text-xl font-bold text-gray-800 dark:text-white mb-4">Ringkasan Pesanan</Text>
                    <View className="flex-row justify-between mb-3">
                        <Text className="text-base text-gray-600 dark:text-gray-300">Subtotal</Text>
                        <Text className="text-base font-semibold text-gray-800 dark:text-white">{formatCurrency(subtotal)}</Text>
                    </View>
                    <View className="flex-row justify-between mb-4">
                        <Text className="text-base text-gray-600 dark:text-gray-300">Biaya Layanan</Text>
                        <Text className="text-base font-semibold text-gray-800 dark:text-white">{formatCurrency(deliveryFee)}</Text>
                    </View>
                    <View className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <View className="flex-row justify-between">
                            <Text className="text-lg font-bold text-gray-800 dark:text-white">Total</Text>
                            <Text className="text-lg font-bold text-green-600 dark:text-green-400">{formatCurrency(total)}</Text>
                        </View>
                    </View>
                </View>


            </ScrollView>

            {/* Checkout Button */}
            <View className="px-5 py-4 border-t border-gray-200 dark:border-gray-700">
                <TouchableOpacity className="bg-green-500 dark:bg-green-600 rounded-xl py-4">
                    <Text className="text-white text-center font-bold text-lg">Lanjutkan ke Pembayaran</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
        </LinearGradient>
    );
};

export default CartScreen;
