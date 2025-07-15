import React, { useCallback, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomerOrders } from "../../../../redux/slice/orderSlice";
import { ThemeContext } from "../../../../context/ThemeContext";

// Komponen untuk setiap kartu pesanan
const OrderCard = ({ order }) => {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const handleReviewPress = () => {
    navigation.navigate("RatingScreen", { orderDetails: order });
  };

  // --- PERBAIKAN DI SINI ---
  // Gunakan `order.isReviewed` sesuai dengan data dari API
  const hasAlreadyBeenReviewed = order.isReviewed;

  return (
    <View
      className={`rounded-2xl p-4 mb-4 shadow-md shadow-black/5 mx-4 ${isDark ? "bg-gray-800" : "bg-white"}`}
    >
      {/* Info Penjual */}
      <View className="flex-row items-center mb-3">
        <Image
          source={{ uri: order.sellerImageUrl }}
          className="w-12 h-12 rounded-full mr-3"
        />
        <View>
          <Text
            className={`text-base font-bold ${isDark ? "text-white" : "text-gray-800"}`}
          >
            {order.storeName}
          </Text>
          <Text
            className={`text-xs font-semibold uppercase ${isDark ? "text-green-400" : "text-green-600"}`}
          >
            {order.status}
          </Text>
        </View>
      </View>

      {/* Informasi Order */}
      <View className="mt-2">
        <Text
          className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}
        >
          Total: Rp {order.totalAmount.toLocaleString()}
        </Text>
        <Text
          className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}
        >
          Selesai pada: {new Date(order.updatedAt).toLocaleString("id-ID")}
        </Text>
      </View>

      {/* Daftar Item */}
      <View className="mt-3">
        <Text
          className={`text-sm font-semibold mb-2 ${isDark ? "text-gray-200" : "text-gray-800"}`}
        >
          Items:
        </Text>
        {order.orderItems.map((item, index) => (
          <View
            key={index}
            className={`flex-row items-center p-3 rounded-xl mb-2 ${isDark ? "bg-gray-700" : "bg-gray-100"}`}
          >
            <Image
              source={{ uri: item.productImageUrl }}
              className="w-16 h-16 rounded-lg"
              resizeMode="cover"
            />
            <View className="ml-3 flex-1">
              <Text
                className={`font-bold text-sm ${isDark ? "text-gray-100" : "text-gray-800"}`}
              >
                {item.menuItemName}
              </Text>
              <Text
                className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                Jumlah: {item.quantity}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Tombol Review */}
      {order.status === "COMPLETED" && (
        <TouchableOpacity
          className={`mt-4 py-3 rounded-lg items-center ${hasAlreadyBeenReviewed ? "bg-gray-400 dark:bg-gray-600" : "bg-blue-500 active:bg-blue-600"}`}
          onPress={handleReviewPress}
          disabled={hasAlreadyBeenReviewed}
        >
          <Text className="text-white font-bold">
            {hasAlreadyBeenReviewed ? "Ulasan Diberikan" : "Beri Ulasan"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Komponen utama
const DoneOrder = () => {
  const dispatch = useDispatch();
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const { orders = [], fetchStatus = "idle" } =
    useSelector((state) => state.orders) || {};

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchCustomerOrders("COMPLETED"));
    }, [dispatch])
  );

  const onRefresh = useCallback(() => {
    dispatch(fetchCustomerOrders("COMPLETED"));
  }, [dispatch]);

  if (fetchStatus === "loading" && orders.length === 0) {
    return (
      <View
        className={`flex-1 justify-center items-center ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
      >
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.orderId}
        renderItem={({ item }) => <OrderCard order={item} />}
        contentContainerStyle={{ paddingTop: 16 }}
        ListEmptyComponent={() => (
          <View className="flex-1 justify-center items-center mt-40">
            <Text
              className={`${isDark ? "text-gray-400" : "text-gray-500"} text-center`}
            >
              Tidak ada pesanan yang selesai.
            </Text>
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={fetchStatus === "loading"}
            onRefresh={onRefresh}
            tintColor="#16a34a"
          />
        }
      />
    </SafeAreaView>
  );
};

export default DoneOrder;
