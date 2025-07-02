import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../assets/colors';
import { Ionicons } from '@expo/vector-icons';
import FoodCard from '../../components/FoodCard';
import { ThemeContext } from '../../context/ThemeContext';

const recommendations = [
    {
        id: '1',
        title: 'Ayam Bakar',
        image: 'https://images.unsplash.com/photo-1605478031248-78e5a6a9b275?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: '2',
        title: 'Nasi Goreng',
        image: 'https://images.unsplash.com/photo-1620207418302-439b387441b0?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: '3',
        title: 'Sate Ayam',
        image: 'https://images.unsplash.com/photo-1589308078056-eb7d38ac5be0?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: '4',
        title: 'Ayam Bakar',
        image: 'https://images.unsplash.com/photo-1605478031248-78e5a6a9b275?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: '5',
        title: 'Nasi Goreng',
        image: 'https://images.unsplash.com/photo-1620207418302-439b387441b0?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: '6',
        title: 'Sate Ayam',
        image: 'https://images.unsplash.com/photo-1589308078056-eb7d38ac5be0?auto=format&fit=crop&w=400&q=80',
    },
];


const restaurants = [
    { id: '1', name: 'Warung Cak Jo', storeId: '1', storeName: 'Warung Cak Jo', dish: 'Nasi ayam gulai', price: 7000, oldPrice: 20000, image: 'https://picsum.photos/seed/food1/400/200', description: 'Nasi ayam gulai dengan bumbu khas Warung Cak Jo, disajikan dengan sambal terasi dan lalapan.', rating: 4.9 },
    { id: '2', name: 'Soto Lamongan', storeId: '2', storeName: 'Soto Lamongan', dish: 'Soto Ayam', price: 12000, oldPrice: 15000, image: 'https://picsum.photos/seed/food2/400/200', description: 'Soto ayam Lamongan dengan kuah kuning kental, disajikan dengan koya dan sambal.', rating: 4.7 },
    { id: '3', name: 'Warung Cak Jo', storeId: '1', storeName: 'Warung Cak Jo', dish: 'Nasi ayam gulai', price: 7000, oldPrice: 20000, image: 'https://picsum.photos/seed/food1/400/200', description: 'Nasi ayam gulai dengan bumbu khas Warung Cak Jo, disajikan dengan sambal terasi dan lalapan.', rating: 4.9 },
    { id: '4', name: 'Soto Lamongan', storeId: '2', storeName: 'Soto Lamongan', dish: 'Soto Ayam', price: 12000, oldPrice: 15000, image: 'https://picsum.photos/seed/food2/400/200', description: 'Soto ayam Lamongan dengan kuah kuning kental, disajikan dengan koya dan sambal.', rating: 4.7 },
    { id: '5', name: 'Warung Cak Jo', storeId: '1', storeName: 'Warung Cak Jo', dish: 'Nasi ayam gulai', price: 7000, oldPrice: 20000, image: 'https://picsum.photos/seed/food1/400/200', description: 'Nasi ayam gulai dengan bumbu khas Warung Cak Jo, disajikan dengan sambal terasi dan lalapan.', rating: 4.9 },
    { id: '6', name: 'Soto Lamongan', storeId: '2', storeName: 'Soto Lamongan', dish: 'Soto Ayam', price: 12000, oldPrice: 15000, image: 'https://picsum.photos/seed/food2/400/200', description: 'Soto ayam Lamongan dengan kuah kuning kental, disajikan dengan koya dan sambal.', rating: 4.7 },
];

const HomeScreen = () => {
    const [activeFilter, setActiveFilter] = useState('All');
    const filters = ['All', 'Food', 'Drink', 'Location'];
    const { theme } = useContext(ThemeContext);
    const isDarkMode = theme === 'dark';

    const renderHeader = () => (
        <View>
            {/* Lokasi */}
            <View className="flex-row items-center mt-2.5">
                <Ionicons name="location-sharp" size={20} color={isDarkMode ? '#D1D5DB' : '#A9A9A9'} />
                <Text className={`ml-2 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-400'}`}>Malang, Jawa Timur</Text>
            </View>

            {/* Search Bar with Filter */}
            <View className="flex-row items-center mt-5 gap-3">
                <View className={`flex-1 flex-row items-center rounded-xl px-4 py-3 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <Ionicons name="search" size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
                    <TextInput
                        placeholder="Cari makanan atau restoran..."
                        className={`flex-1 ml-3 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}
                        placeholderTextColor={isDarkMode ? '#9CA3AF' : '#9CA3AF'}
                    />
                </View>
                <TouchableOpacity className="w-12 h-12 bg-[#FF6B35] rounded-xl items-center justify-center shadow-sm">
                    <Ionicons name="options-outline" size={20} color="white" />
                </TouchableOpacity>
            </View>

            {/* Filter Categories */}
            <View className="flex-row gap-2 mt-5">
                {filters.map((filter) => (
                    <TouchableOpacity
                        key={filter}
                        className={`py-2 px-4 rounded-xl border ${
                            activeFilter === filter
                                ? 'bg-[#FF6B35] border-[#FF6B35]'
                                : isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                        }`}
                        onPress={() => setActiveFilter(filter)}
                    >
                        <Text
                            className={`font-medium text-sm ${
                                activeFilter === filter
                                    ? 'text-white'
                                    : isDarkMode ? 'text-gray-200' : 'text-gray-700'
                            }`}
                        >
                            {filter}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Rekomendasi */}
            <Text className={`text-base font-bold mb-3 mt-6 ${isDarkMode ? 'text-green-400' : 'text-[#28A745]'}`}>Rekomendasi</Text>
            <FlatList
                data={recommendations}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View className={`w-36 mr-3 border rounded-xl p-2 shadow-sm ${isDarkMode ? 'bg-gray-800 border-gray-700 shadow-gray-900' : 'bg-white border-gray-200'}`}>
                        <Image source={{ uri: item.image }} className="w-full h-24 rounded-lg" />
                        <Text className={`font-semibold mt-2 text-sm ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{item.title}</Text>
                        <Text className="text-[#E74C3C] font-semibold text-sm">Rp.7000</Text>
                    </View>
                )}
            />
        </View>
    );

    return (
        <LinearGradient
            colors={isDarkMode ? colors.gradientDark : colors.gradientLight}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <FlatList
                    data={restaurants}
                    renderItem={({ item }) => <FoodCard item={item} />}
                    keyExtractor={(item) => item.id}
                    ListHeaderComponent={renderHeader}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
                />
            </SafeAreaView>
        </LinearGradient>
    );
};

export default HomeScreen;
