import React from 'react';
import { View, Text, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const ConfirmationBottomSheet = ({
  isVisible,
  onClose,
  onConfirm,
  storeName,
  totalAmount,
  isDarkMode,
  isLoading,
}) => {
  if (!isVisible) return null;

  const formatCurrency = (amount) => `Rp${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        <TouchableOpacity className="flex-1" activeOpacity={1} onPress={onClose}>
          <LinearGradient
            colors={['rgba(30,50,30,0)', 'rgba(30,50,30,0.5)', 'rgba(30,50,30,0.8)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            className="flex-1 h-screen"
          />
        </TouchableOpacity>
        
        <View className={`rounded-t-3xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <View className="items-center mb-4">
            <View className="w-12 h-1 bg-gray-300 rounded-full" />
          </View>

          <Text className={`text-xl font-bold text-center mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Konfirmasi Pesanan
          </Text>

          <View className="border-y border-gray-200 dark:border-gray-700 py-4 mb-6">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-base text-gray-500 dark:text-gray-400">Toko</Text>
              <Text className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{storeName}</Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-base text-gray-500 dark:text-gray-400">Total Pembayaran</Text>
              <Text className="text-lg font-bold text-green-500">{formatCurrency(totalAmount)}</Text>
            </View>
          </View>

          <TouchableOpacity
            className="bg-green-500 py-4 rounded-2xl items-center justify-center"
            onPress={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-white text-lg font-bold">Konfirmasi & Bayar</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationBottomSheet;