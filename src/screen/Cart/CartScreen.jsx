import React, { useContext, useState, useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    SafeAreaView,
    TextInput,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { ThemeContext } from "../../context/ThemeContext";
import { useDispatch, useSelector } from "react-redux";

// Impor semua action yang relevan
import {
    fetchCart,
    increaseItemQuantity,
    decreaseItemQuantity,
    removeItemFromCart,
    clearCart,
} from "../../redux/slice/cartSlice";
import { createOrder, resetOrderStatus } from "../../redux/slice/orderSlice";

import ConfirmationBottomSheet from "../../components/ConfirmationBottomSheet";
import ModalConfirm from "../../components/common/ModalConfirm";
import ResponseModal from "../../components/common/ResponseModal";
import Screen from "../Screen";

const CartScreen = ({ route }) => {
    const { storeName } = route.params || {};
    const { theme } = useContext(ThemeContext);
    const isDarkMode = theme === "dark";
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const [isConfirmVisible, setIsConfirmVisible] = useState(false);
    const [customerNotes, setCustomerNotes] = useState("");
    const [confirmModal, setConfirmModal] = useState({ isVisible: false, message: '', onConfirm: null });
    const [feedback, setFeedback] = useState({ isVisible: false, message: '', type: 'success' });

    const cartState = useSelector((state) => state.cart);
    const { createStatus: orderStatus, paymentUrl, error: orderError } = useSelector((state) => state.orders);

    const cartItems = cartState.items[storeName] || [];
    const cartId = cartState.cartId;

    useFocusEffect(
        React.useCallback(() => {
            dispatch(fetchCart());
        }, [dispatch])
    );

    // --- PERBAIKAN LOGIKA KUANTITAS DI SINI ---

    const handleIncreaseQuantity = (cartItemId) => {
        const item = cartItems.find(i => i.cartItemId === cartItemId);
        if (!item) return;

        // Asumsi backend mengirim properti `availableStock` atau `stock`.
        // Jika tidak, Anda perlu memintanya. Untuk sekarang kita beri nama `availableStock`.
        const availableStock = item.availableStock || Infinity;

        if (item.quantity >= availableStock) {
            setFeedback({ isVisible: true, message: `Anda tidak bisa memesan lebih dari ${availableStock} item.`, type: 'error' });
            return; 
        }
        dispatch(increaseItemQuantity({ cartItemId, storeName }));
    };

    const handleDecreaseQuantity = (cartItemId) => {
        const item = cartItems.find(i => i.cartItemId === cartItemId);
        if (!item) return;
        if (item.quantity <= 1) {
            return;
        }
        dispatch(decreaseItemQuantity({ cartItemId, storeName }));
    };
    

    const handleRemoveItem = (cartItemId) => {
        setConfirmModal({
            isVisible: true,
            message: "Yakin ingin menghapus item ini?",
            onConfirm: () => {
                dispatch(removeItemFromCart({ cartItemId, storeName }));
                setConfirmModal({ isVisible: false, message: '', onConfirm: null });
            }
        });
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);
    const total = subtotal;

    const formatCurrency = (amount) => `Rp${(amount || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
    const handleOpenConfirmation = () => setIsConfirmVisible(true);

    const handleConfirmOrder = () => {
        // if (orderStatus === 'loading') return;
        const sellerId = cartItems.length > 0 ? cartItems[0].sellerId : null;
        if (!sellerId || !cartId) {
            setFeedback({ isVisible: true, message: "Gagal memuat data keranjang. Mohon coba lagi.", type: 'error' });
            dispatch(fetchCart());
            return;
        }
        const orderData = { cartId, sellerId, notes: customerNotes };
        dispatch(createOrder(orderData));
    };

    useEffect(() => {
        if (orderStatus === 'succeeded' && paymentUrl) {
            setIsConfirmVisible(false);
            setFeedback({ isVisible: true, message: "Pesanan berhasil dibuat!", type: 'success' });
        } else if (orderStatus === 'failed') {
            setIsConfirmVisible(false);
            setFeedback({ isVisible: true, message: orderError || "Terjadi kesalahan pada server.", type: 'error' });
            dispatch(resetOrderStatus());
        }
    }, [orderStatus, paymentUrl, navigation, dispatch, orderError]);

    return (
        <>
            <Screen>
                 <View className="mt-10 px-5 mb-10">
                    {cartItems.length === 0 ? (
                        <View className="flex-1 justify-center items-center mt-20">
                            <Text className="text-center text-gray-600 dark:text-gray-300 text-base">
                                Keranjang Anda untuk toko ini kosong.
                            </Text>
                        </View>
                    ) : (
                        cartItems.map((item) => (
                            <View key={item.cartItemId} className="flex-row items-center bg-white dark:bg-gray-800 rounded-2xl p-3 mb-4 shadow-md shadow-gray-200 dark:shadow-gray-900">
                                <Image source={{ uri: item.image }} className="w-20 h-20 rounded-lg" />
                                <View className="flex-1 ml-4">
                                    <Text className="text-base font-semibold text-gray-800 dark:text-white">{item.name}</Text>
                                    <Text className="text-sm text-green-600 dark:text-green-400 mt-1">{formatCurrency(item.price)}</Text>
                                    <View className="flex-row items-center mt-3">
                                        <TouchableOpacity onPress={() => handleDecreaseQuantity(item.cartItemId)} className="p-1.5 bg-gray-200 dark:bg-gray-700 rounded-full">
                                            <Feather name="minus" size={16} color={isDarkMode ? '#FFF' : '#000'} />
                                        </TouchableOpacity>
                                        <Text className="mx-3 text-lg font-bold text-gray-800 dark:text-white">{item.quantity}</Text>
                                        <TouchableOpacity onPress={() => handleIncreaseQuantity(item.cartItemId)} className="p-1.5 bg-gray-200 dark:bg-gray-700 rounded-full">
                                            <Feather name="plus" size={16} color={isDarkMode ? '#FFF' : '#000'} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <TouchableOpacity onPress={() => handleRemoveItem(item.cartItemId)} className="ml-2 p-1.5 bg-red-100 dark:bg-red-900/50 rounded-full">
                                    <MaterialIcons name="delete-outline" size={20} color="#DC2626" />
                                </TouchableOpacity>
                            </View>
                        ))
                    )}
                </View>

                {cartItems.length > 0 && (
                    <>
                        <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-md shadow-gray-200 mx-5 mt-6 p-5">
                            <Text className="text-xl font-bold text-gray-800 dark:text-white mb-4">Ringkasan Pesanan</Text>
                            <View className="flex-row justify-between mb-3">
                                <Text className="text-base text-gray-600 dark:text-gray-300">Subtotal</Text>
                                <Text className="text-base font-semibold text-gray-800 dark:text-white">{formatCurrency(subtotal)}</Text>
                            </View>
                            <View className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                <View className="flex-row justify-between">
                                    <Text className="text-lg font-bold text-gray-800 dark:text-white">Total</Text>
                                    <Text className="text-lg font-bold text-green-600 dark:text-green-400">{formatCurrency(total)}</Text>
                                </View>
                            </View>
                        </View>
                        
                        <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-md shadow-gray-200 mx-5 mt-6 p-5">
                            <Text className="text-xl font-bold text-gray-800 dark:text-white mb-4">Catatan untuk Penjual</Text>
                            <TextInput
                                className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-800 dark:text-white h-24"
                                placeholder="Tambahkan catatan di sini..."
                                placeholderTextColor={isDarkMode ? '#A0A0A0' : '#808080'}
                                multiline
                                textAlignVertical="top"
                                value={customerNotes}
                                onChangeText={setCustomerNotes}
                            />
                        </View>
                        
                        <TouchableOpacity
                            className="bg-green-500 rounded-full py-4 mx-5 mt-6 mb-10 items-center justify-center shadow-lg"
                            onPress={handleOpenConfirmation}
                        >
                            <Text className="text-white text-lg font-bold">Buat Pesanan</Text>
                        </TouchableOpacity>
                    </>
                )}
            </Screen>
            <ConfirmationBottomSheet
                isVisible={isConfirmVisible}
                onClose={() => setIsConfirmVisible(false)}
                onConfirm={handleConfirmOrder}
                storeName={storeName}
                totalAmount={total}
                isDarkMode={isDarkMode}
                isLoading={orderStatus === 'loading'}
            />
            <ModalConfirm
                visible={confirmModal.isVisible}
                message={confirmModal.message}
                onYes={() => {
                    if (confirmModal.onConfirm) {
                        confirmModal.onConfirm();
                    }
                }}
                onNo={() => setConfirmModal({ isVisible: false, message: '', onConfirm: null })}
            />
            <ResponseModal
                visible={feedback.isVisible}
                message={feedback.message}
                type={feedback.type}
                onClose={() => {
                    setFeedback({ ...feedback, isVisible: false });
                    if (feedback.type === 'success' && paymentUrl) {
                        navigation.navigate('PaymentScreen', {
                            paymentUrl: paymentUrl,
                            onPaymentFinish: () => {
                                dispatch(clearCart());
                                dispatch(resetOrderStatus());
                                navigation.navigate('Home');
                            }
                        });
                    }
                }}
            />
        </>
    );
};

export default CartScreen;