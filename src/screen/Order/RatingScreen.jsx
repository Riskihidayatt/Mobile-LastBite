import React, { useState, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../../context/ThemeContext';

const RatingScreen = ({ route }) => {
    const navigation = useNavigation();
    const { theme } = useContext(ThemeContext);
    const isDarkMode = theme === 'dark';

    const { orderItem } = route.params; // Menerima item pesanan dari navigasi

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleStarPress = (selectedRating) => {
        setRating(selectedRating);
    };

    const handleSubmitRating = () => {
        // Logika untuk mengirim rating dan komentar
        console.log('Mengirim Rating:', rating);
        console.log('Komentar:', comment);
        console.log('Untuk Item:', orderItem);
        alert('Rating berhasil dikirim!');
        navigation.goBack();
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-100 dark:bg-gray-900">
            {/* Header */}
            <View className="flex-row items-center px-4 py-3 bg-white dark:bg-gray-800 shadow-sm">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={isDarkMode ? 'white' : 'black'} />
                </TouchableOpacity>
                <Text className="flex-1 text-xl font-bold text-center text-gray-800 dark:text-white">Rating</Text>
                <View className="w-6" />{/* Placeholder untuk menyeimbangkan header */}
            </View>

            <ScrollView className="flex-1 p-4">
                <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-4">
                    {/* Gambar Makanan */}
                    <Image
                        source={orderItem.image}
                        className="w-full h-60 resize-cover"
                    />

                    {/* Nama Makanan */}
                    <View className="p-4">
                        <Text className="text-2xl font-bold text-gray-800 dark:text-white text-center">{orderItem.name}</Text>
                    </View>
                </View>

                <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 mb-4">
                    <Text className="text-base font-semibold text-gray-800 dark:text-white mb-2">Komentar :</Text>
                    <TextInput
                        className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-800 dark:text-white h-24"
                        placeholder="Tulis Komentar......."
                        placeholderTextColor={isDarkMode ? '#A0A0A0' : '#808080'}
                        multiline
                        value={comment}
                        onChangeText={setComment}
                    />
                </View>

                {/* Star Rating */}
                <View className="flex-row justify-center mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity key={star} onPress={() => handleStarPress(star)} className="p-2">
                            <Ionicons
                                name={rating >= star ? 'star' : 'star-outline'}
                                size={40}
                                color={rating >= star ? '#FFD700' : (isDarkMode ? '#9CA3AF' : '#D1D5DB')}
                            />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Tombol Kirim */}
                <TouchableOpacity
                    onPress={handleSubmitRating}
                    className="bg-green-500 dark:bg-green-600 py-4 rounded-xl items-center shadow-lg shadow-green-200"
                >
                    <Text className="text-white text-lg font-bold">Kirim</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default RatingScreen;