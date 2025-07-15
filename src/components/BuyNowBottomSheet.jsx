import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const BuyNowBottomSheet = ({
  isVisible,
  onClose,
  item,
  isDarkMode,
  onConfirm,
  orderStatus,
}) => {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (isVisible) {
      setQuantity(1);
    }
  }, [isVisible]);

  const formatCurrency = (amount) => {
    return `Rp${(amount || 0)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
  };

  const handleConfirm = () => {
    onConfirm(quantity);
  };

  if (!item) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        <TouchableOpacity
          className="flex-1"
          activeOpacity={1}
          onPress={onClose}
        >
          <LinearGradient
            colors={['rgba(30,50,30,0)', 'rgba(30,50,30,0.5)', 'rgba(30,50,30,0.8)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            className="flex-1 h-screen"
          />
        </TouchableOpacity>

        {/* Konten Bottom Sheet */}
        <View
          className={`rounded-t-3xl p-6 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          {/* Handle bar */}
          <View className="items-center mb-4">
            <View className="w-12 h-1 bg-gray-300 rounded-full" />
          </View>

          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text
              className={`text-xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}
            >
              Beli Langsung
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700"
            >
              <Ionicons
                name="close"
                size={20}
                color={isDarkMode ? '#FFF' : '#000'}
              />
            </TouchableOpacity>
          </View>

          {/* Item info */}
          <View className="items-center mb-6">
            <Image
              source={{ uri: item.image }}
              className="w-24 h-24 rounded-2xl mb-3"
            />
            <Text
              className={`text-lg font-bold text-center ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}
            >
              {item.name}
            </Text>
            <Text className="text-xl font-bold text-green-500 mt-1">
              {formatCurrency(item.price)}
            </Text>
          </View>

          {/* Quantity Control */}
          <View className="flex-row justify-center items-center mb-6">
            <TouchableOpacity
              className="p-3 rounded-full bg-gray-100 dark:bg-gray-700"
              onPress={() => setQuantity((prev) => Math.max(1, prev - 1))}
              disabled={quantity <= 1}
            >
              <Ionicons
                name="remove"
                size={20}
                color={quantity <= 1 ? '#ccc' : isDarkMode ? '#FFF' : '#000'}
              />
            </TouchableOpacity>
            <Text
              className={`text-2xl font-bold mx-8 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}
            >
              {quantity}
            </Text>
            <TouchableOpacity
              className="p-3 rounded-full bg-gray-100 dark:bg-gray-700"
              onPress={() => setQuantity((prev) => prev + 1)}
            >
              <Ionicons
                name="add"
                size={20}
                color={isDarkMode ? '#FFF' : '#000'}
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Button */}
          <TouchableOpacity
            className={`py-4 rounded-2xl items-center justify-center ${
              orderStatus === 'loading' ? 'bg-green-300' : 'bg-green-500'
            }`}
            onPress={handleConfirm}
            disabled={orderStatus === 'loading'}
          >
            {orderStatus === 'loading' ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-white text-lg font-bold">
                Lanjutkan - {formatCurrency(item.price * quantity)}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default BuyNowBottomSheet;
