import React, { useContext, useState } from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, Image } from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import {colors} from "../../assets/colors";
import {LinearGradient} from "expo-linear-gradient";

// Placeholder data for past orders
const pastOrders = [
    {
        id: '#12345',
        date: '20 Mei 2024',
        total: 195000,
        status: 'Done',
        items: 'Burger Daging Sapi, Kentang Goreng',
        name: 'Nasi Rendang',
        image: require('../../assets/ayam-bakar.jpg'),
        isRated: false,
    },
    {
        id: '#12344',
        date: '18 Mei 2024',
        total: 85000,
        status: 'On Progres',
        items: 'Ayam Goreng, Nasi Putih',
        name: 'Nasi Rendang',
        image: require('../../assets/ayam-bakar.jpg'),
        isRated: false,
    },
    {
        id: '#12342',
        date: '15 Mei 2024',
        total: 250000,
        status: 'Done',
        items: 'Pizza Super Supreme, Minuman Soda',
        name: 'Nasi Rendang',
        image: require('../../assets/ayam-bakar.jpg'),
        isRated: true,
    },
    {
        id: '#12341',
        date: '14 Mei 2024',
        total: 50000,
        status: 'Cancel',
        items: 'Mie Ayam',
        name: 'Nasi Rendang',
        image: require('../../assets/ayam-bakar.jpg'),
        isRated: false,
    },
];

const OrderCard = ({ order }) => {
    const { theme } = useContext(ThemeContext);
    const isDarkMode = theme === 'dark';
    const navigation = useNavigation();

    const statusColor = order.status === 'Done' ? 'text-green-500' : (order.status === 'On Progres' ? 'text-yellow-500' : 'text-red-500');
    const formatCurrency = (amount) => {
        return `Rp${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
    };

    const handleRatingPress = () => {
        navigation.navigate('RatingScreen', { orderItem: order });
    };

    return (
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-4 shadow-md shadow-gray-200 dark:shadow-gray-900 mx-5">
            <View className="flex-row items-center mb-3">
                <Image source={order.image} className="w-20 h-20 rounded-lg mr-3" />
                <View className="flex-1">
                    <Text className="text-lg font-bold text-gray-800 dark:text-white">{order.name}</Text>
                    <Text className="text-base font-bold text-red-500">{formatCurrency(order.total)}</Text>
                </View>
            </View>
            <View className="flex-row justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                <Text className={`text-base font-bold ${statusColor}`}>{order.status}</Text>
                {order.status === 'Done' && (
                    <TouchableOpacity
                        onPress={handleRatingPress}
                        className={`rounded-lg py-2 px-4 ${
                            order.isRated ? 'bg-gray-300 dark:bg-gray-700' : 'bg-green-500 dark:bg-green-600'
                        }`}
                        disabled={order.isRated}
                    >
                        <Text className="text-white font-semibold">{order.isRated ? 'Rating' : 'Beri Rating'}</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const OrderScreen = () => {
    const { theme } = useContext(ThemeContext);
    const isDarkMode = theme === 'dark';
    const [activeTab, setActiveTab] = useState('Done');

    const filteredOrders = pastOrders.filter(order => {
        if (activeTab === 'All') return true;
        return order.status === activeTab;
    });

    return (
        <LinearGradient
            colors={isDarkMode ? colors.gradientDark : colors.gradientLight}
            style={{ flex: 1 }}
        >
            <SafeAreaView className="flex-1">
            {/* Header */}
            <View className="py-4 border-b border-gray-200 dark:border-gray-700">
                <Text className="text-xl font-bold text-center text-gray-800 dark:text-white">Pesanan</Text>
            </View>

            {/* Tab Filter */}
            <View className="flex-row justify-around p-4 bg-white dark:bg-gray-800">
                <TouchableOpacity
                    className={`flex-1 py-2 rounded-full items-center mx-1 ${
                        activeTab === 'Cancel' ? 'bg-red-500' : (isDarkMode ? 'bg-gray-700' : 'bg-gray-200')
                    }`}
                    onPress={() => setActiveTab('Cancel')}
                >
                    <Text className={`font-semibold ${
                        activeTab === 'Cancel' ? 'text-white' : (isDarkMode ? 'text-gray-300' : 'text-gray-700')
                    }`}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className={`flex-1 py-2 rounded-full items-center mx-1 ${
                        activeTab === 'On Progres' ? 'bg-yellow-500' : (isDarkMode ? 'bg-gray-700' : 'bg-gray-200')
                    }`}
                    onPress={() => setActiveTab('On Progres')}
                >
                    <Text className={`font-semibold ${
                        activeTab === 'On Progres' ? 'text-white' : (isDarkMode ? 'text-gray-300' : 'text-gray-700')
                    }`}>On Progres</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className={`flex-1 py-2 rounded-full items-center mx-1 ${
                        activeTab === 'Done' ? 'bg-green-500' : (isDarkMode ? 'bg-gray-700' : 'bg-gray-200')
                    }`}
                    onPress={() => setActiveTab('Done')}
                >
                    <Text className={`font-semibold ${
                        activeTab === 'Done' ? 'text-white' : (isDarkMode ? 'text-gray-300' : 'text-gray-700')
                    }`}>Done</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={filteredOrders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <OrderCard order={item} />}
                contentContainerStyle={{ paddingVertical: 20 }}
            />
        </SafeAreaView>
            </LinearGradient>
    );
};

export default OrderScreen;
