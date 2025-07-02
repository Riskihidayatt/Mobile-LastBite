import React, { useContext } from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';

// Placeholder data for past orders
const pastOrders = [
    {
        id: '#12345',
        date: '20 Mei 2024',
        total: 195000,
        status: 'Selesai',
        items: 'Burger Daging Sapi, Kentang Goreng',
    },
    {
        id: '#12344',
        date: '18 Mei 2024',
        total: 85000,
        status: 'Dibatalkan',
        items: 'Ayam Goreng, Nasi Putih',
    },
    {
        id: '#12342',
        date: '15 Mei 2024',
        total: 250000,
        status: 'Selesai',
        items: 'Pizza Super Supreme, Minuman Soda',
    },
];

const OrderCard = ({ order }) => {
    const { theme } = useContext(ThemeContext);
    const isDarkMode = theme === 'dark';
    const statusColor = order.status === 'Selesai' ? 'text-green-500' : 'text-red-500';
    const formatCurrency = (amount) => {
        return `Rp${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
    };

    return (
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-5 shadow-md shadow-gray-200 dark:shadow-gray-900">
            <View className="flex-row justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3 mb-3">
                <View>
                    <Text className="text-lg font-bold text-gray-800 dark:text-white">Pesanan {order.id}</Text>
                    <Text className="text-sm text-gray-500 dark:text-gray-400">{order.date}</Text>
                </View>
                <Text className={`text-base font-bold ${statusColor}`}>{order.status}</Text>
            </View>
            <Text className="text-base text-gray-600 dark:text-gray-300 mb-4">{order.items}</Text>
            <View className="flex-row justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                <Text className="text-lg font-bold text-gray-800 dark:text-white">Total: {formatCurrency(order.total)}</Text>
                <TouchableOpacity className="bg-green-500 dark:bg-green-600 rounded-lg py-2 px-4">
                    <Text className="text-white font-semibold">Pesan Lagi</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const OrderScreen = () => {
    const { theme } = useContext(ThemeContext);

    return (
        <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <View className="py-4 border-b border-gray-200 dark:border-gray-700">
                <Text className="text-xl font-bold text-center text-gray-800 dark:text-white">Riwayat Pesanan</Text>
            </View>

            <FlatList
                data={pastOrders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <OrderCard order={item} />}
                contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20 }}
            />
        </SafeAreaView>
    );
};

export default OrderScreen;