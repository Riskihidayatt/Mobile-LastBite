import React from 'react';
import { SafeAreaView, View, TouchableOpacity, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const PaymentScreen = ({ route }) => {
    // Ambil URL pembayaran dan fungsi callback dari parameter navigasi
    const { paymentUrl, onPaymentFinish } = route.params;
    const navigation = useNavigation();

    // Fungsi ini akan dipanggil untuk menutup layar modal
    const handleClose = () => {
        // Jalankan fungsi callback jika ada, untuk mereset state di layar sebelumnya
        if (onPaymentFinish) {
            onPaymentFinish(); 
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header Kustom untuk Modal
            <View className="py-4 px-4 border-b border-gray-200 flex-row items-center justify-center relative">
                <Text className="text-lg font-semibold text-gray-800">Pembayaran</Text>
                <TouchableOpacity onPress={handleClose} className="absolute right-4 p-1">
                    <Ionicons name="close" size={26} color="#333" />
                </TouchableOpacity>
            </View> */}
            
            <WebView
                source={{ uri: paymentUrl }}
                style={{ flex: 1 }}
                onNavigationStateChange={(navState) => {
                    if (navState.url.includes('/finish')) {
                        handleClose();
                    }
                }}
            />
        </SafeAreaView>
    );
};

export default PaymentScreen;