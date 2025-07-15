import React from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AddToCartModal = ({
    isVisible,
    onClose,
    item,
    isDarkMode,
    quantity,
    setQuantity,
    onConfirm,
    cartStatus,
}) => {
    if (!isVisible) return null;

    // Asumsi `item.quantity` adalah jumlah stok yang tersedia dari API
    // Beri nilai default 0 jika tidak ada
    const availableStock = item?.quantity || 0;

    const formatCurrency = (amount) => {
        return `Rp${(amount || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-end">
                {/* Backdrop untuk menutup modal saat diklik */}
                <TouchableOpacity
                    className="flex-1 bg-black/50"
                    activeOpacity={1}
                    onPress={onClose}
                />

                {/* Konten Bottom Sheet */}
                <View className={`rounded-t-3xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    {/* Handle (garis abu-abu di atas) */}
                    <View className="items-center mb-4">
                        <View className="w-12 h-1 bg-gray-300 rounded-full" />
                    </View>
                    
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                            Tambah ke Keranjang
                        </Text>
                        <TouchableOpacity
                            onPress={onClose}
                            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700"
                        >
                            <Ionicons name="close" size={20} color={isDarkMode ? '#FFF' : '#000'} />
                        </TouchableOpacity>
                    </View>

                    <View className="items-center mb-6">
                        <Image source={{ uri: item.image }} className="w-24 h-24 rounded-2xl mb-3" />
                        <Text className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} text-center`}>
                            {item.name}
                        </Text>
                        <Text className="text-xl font-bold text-[#FF6B35] mt-1">
                            {formatCurrency(item.price)}
                        </Text>
                    </View>

                    {/* Pengatur Kuantitas dengan Validasi Stok */}
                    <View className="flex-row justify-center items-center mb-6">
                        <TouchableOpacity
                            className="p-3 rounded-full bg-gray-100 dark:bg-gray-700"
                            onPress={() => setQuantity((prev) => Math.max(1, prev - 1))}
                            disabled={quantity <= 1}
                        >
                            <Ionicons name="remove" size={20} color={quantity <= 1 ? '#ccc' : isDarkMode ? '#FFF' : '#000'} />
                        </TouchableOpacity>
                        <Text className={`text-2xl font-bold mx-8 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                            {quantity}
                        </Text>
                        <TouchableOpacity
                            className="p-3 rounded-full bg-gray-100 dark:bg-gray-700"
                            // Nonaktifkan tombol jika kuantitas mencapai stok
                            onPress={() => setQuantity((prev) => Math.min(prev + 1, availableStock))}
                            disabled={quantity >= availableStock}
                        >
                            <Ionicons name="add" size={20} color={quantity >= availableStock ? '#ccc' : isDarkMode ? '#FFF' : '#000'} />
                        </TouchableOpacity>
                    </View>
                    
                    {/* Pesan info stok jika kuantitas mendekati/mencapai batas */}
                    {quantity >= availableStock && availableStock > 0 && (
                        <Text className="text-center text-red-500 mb-4">
                            Anda telah mencapai batas stok.
                        </Text>
                    )}

                    {/* Tombol Konfirmasi */}
                    <TouchableOpacity
                        className={`py-4 rounded-2xl items-center justify-center ${cartStatus === 'loading' ? 'bg-orange-300' : 'bg-[#FF6B35]'}`}
                        onPress={onConfirm}
                        disabled={cartStatus === 'loading' || availableStock === 0}
                    >
                        {cartStatus === 'loading' ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <Text className="text-white text-lg font-bold">
                                Tambahkan - {formatCurrency(item.price * quantity)}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default AddToCartModal;