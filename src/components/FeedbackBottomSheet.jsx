import React, { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal'; 
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext'; 

const FeedbackBottomSheet = ({ 
    isVisible, 
    onClose, 
    isSuccess, // true untuk sukses, false untuk gagal
    title, 
    message 
}) => {
    if (!isVisible) return null;

    const { theme } = useContext(ThemeContext);
    const isDarkMode = theme === 'dark';

    // Menentukan ikon dan warna berdasarkan status sukses atau gagal
    const iconName = isSuccess ? "checkmark-circle" : "alert-circle";
    const iconColor = isSuccess ? "text-green-500" : "text-red-500";
    const buttonColor = isSuccess ? "bg-green-500" : "bg-red-500";

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onClose} // Menutup saat area luar disentuh
            onSwipeComplete={onClose}  // Menutup saat digeser ke bawah
            swipeDirection={['down']}
            style={{ justifyContent: 'flex-end', margin: 0 }} // Kunci untuk membuatnya jadi bottom sheet
        >
            <View className={`rounded-t-3xl p-6 items-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                {/* Garis handle di atas */}
                <View className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mb-6" />
                
                {/* Ikon Sukses atau Gagal */}
                <Ionicons name={iconName} size={64} className={iconColor} />
                
                {/* Judul Pesan */}
                <Text className={`text-2xl font-bold mt-4 ${isSuccess ? 'text-gray-800 dark:text-white' : 'text-red-500 dark:text-red-400'}`}>
                    {title}
                </Text>

                {/* Isi Pesan */}
                <Text className="text-base text-gray-500 dark:text-gray-400 mt-2 text-center">
                    {message}
                </Text>

                {/* Tombol Mengerti */}
                <TouchableOpacity
                    onPress={onClose}
                    className={`w-full mt-8 py-4 rounded-xl ${buttonColor}`}
                >
                    <Text className="text-white text-center font-bold text-lg">Mengerti</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

export default FeedbackBottomSheet;