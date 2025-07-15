import React, { useCallback, useContext } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    RefreshControl,
    SafeAreaView,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomerOrders } from '../../../../redux/slice/orderSlice';
import { ThemeContext } from '../../../../context/ThemeContext';

const OrderCard = ({ order, onPayNow }) => {
    const { theme } = useContext(ThemeContext);
    const isDark = theme === 'dark';
    // --- PERBAIKAN DI SINI ---
    // Ambil URL dari `order.urlMidtrans`, bukan `order.payment.redirectUrl`
    const paymentUrl = order.urlMidtrans;

    return (
        <View className={`rounded-2xl p-4 mb-4 shadow-md shadow-black/5 mx-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            {/* Info Penjual */}
            <View className="flex-row items-center mb-3">
                <Image
                    source={{ uri: order.sellerImageUrl }}
                    className="w-12 h-12 rounded-full mr-3"
                />
                <View>
                    <Text className={`text-sm font-bold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{order.storeName}</Text>
                    <Text className={`text-xs font-semibold uppercase ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                        {order.status.replace('_', ' ')}
                    </Text>
                </View>
            </View>

            {/* Informasi Order Ringkas */}
            <View className="mt-2">
                <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Total: Rp {order.totalAmount.toLocaleString()}
                </Text>
                <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Kode Verifikasi: <Text className="font-bold text-green-600">{order.verificationCode}</Text>
                </Text>
                <Text className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    Dibuat pada: {new Date(order.createdAt).toLocaleString('id-ID')}
                </Text>
            </View>

            {/* Daftar Item */}
            <View className="mt-3">
                <Text className={`text-sm font-semibold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Items:</Text>
                {order.orderItems.map((item, index) => (
                    <View key={index} className={`flex-row items-center p-3 rounded-xl mb-2 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <Image
                            source={{ uri: item.productImageUrl }}
                            className="w-16 h-16 rounded-lg"
                            resizeMode="cover"
                        />
                        <View className="ml-3 flex-1">
                            <Text className={`font-bold text-sm ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{item.menuItemName}</Text>
                            <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Jumlah: {item.quantity}</Text>
                            <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Harga: Rp {item.pricePerItem.toLocaleString()}</Text>
                        </View>
                    </View>
                ))}
            </View>

            {/* Tombol Bayar Sekarang */}
            {order.status === 'PENDING_PAYMENT' && paymentUrl && (
                <TouchableOpacity 
                    className="mt-4 bg-green-500 active:bg-green-600 py-3 rounded-lg items-center"
                    onPress={() => onPayNow(paymentUrl)}
                >
                    <Text className="text-white font-bold">Bayar Sekarang</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

// Komponen utama
const UnpaidOrder = () => {
    const dispatch = useDispatch();
    const { visible } = useSelector((state) => state.modal);
    const navigation = useNavigation();
    const { theme } = useContext(ThemeContext);
    const isDark = theme === 'dark';
    
    const { orders = [], fetchStatus = 'idle' } = useSelector((state) => state.orders) || {};

    useFocusEffect(
        useCallback(() => {
            dispatch(fetchCustomerOrders('PENDING_PAYMENT'));
        }, [dispatch])
    );

    useFocusEffect(
        useCallback(() => {
            if (visible) {
                dispatch(fetchCustomerOrders('PENDING_PAYMENT'));
            }
        }, [visible])
    );

    const onRefresh = useCallback(() => {
        dispatch(fetchCustomerOrders('PENDING_PAYMENT'));
    }, [dispatch]);

    const handlePayNow = (url) => {
        navigation.navigate('PaymentScreen', {
            paymentUrl: url,
            onPaymentFinish: onRefresh,
        });
    };

    if (fetchStatus === 'loading' && orders.length === 0) {
        return (
            <View className={`flex-1 justify-center items-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <ActivityIndicator size="large" color="#16a34a" />
            </View>
        );
    }

    return (
        <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <FlatList
                data={orders}
                keyExtractor={(item) => item.orderId}
                renderItem={({ item }) => <OrderCard order={item} onPayNow={handlePayNow} />}
                contentContainerStyle={{ paddingTop: 16 }}
                ListEmptyComponent={() => (
                    <View className="flex-1 justify-center items-center mt-40">
                        <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-center`}>
                            Tidak ada pesanan yang perlu dibayar.
                        </Text>
                    </View>
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={fetchStatus === 'loading'}
                        onRefresh={onRefresh}
                        tintColor="#16a34a"
                    />
                }
            />
        </SafeAreaView>
    );
};

export default UnpaidOrder;