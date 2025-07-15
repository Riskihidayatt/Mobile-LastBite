import React, { useContext } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { ThemeContext } from "../../context/ThemeContext";
import StoreCard from "../../components/StoreCard";
import Screen from "../Screen";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

const StoreListScreen = () => {
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === "dark";
  const navigation = useNavigation();

  const cartItemsByStore = useSelector((state) => state.cart.items);

  // Get unique stores from cart items with additional details
  const uniqueStoresInCart = Object.keys(cartItemsByStore).map((storeName) => {
    const storeItems = cartItemsByStore[storeName];
    const totalItems = storeItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = storeItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    return {
      name: storeName,
      image: storeItems[0]?.image || "",
      itemCount: totalItems,
      totalPrice: totalPrice,
      itemsPreview:
        storeItems
          .slice(0, 2)
          .map((item) => item.name)
          .join(", ") +
        (storeItems.length > 2 ? ` +${storeItems.length - 2} lainnya` : ""),
    };
  });


  const handleStorePress = (storeName) => {
    navigation.navigate("CartMain", { storeName });
  };

  const formatCurrency = (amount) => {
    return `Rp.${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  };

  const EmptyCartComponent = () => (
    <View className="justify-center items-center px-6">
      <View className="bg-gray-100 dark:bg-gray-800 rounded-full w-24 h-24 justify-center items-center mb-6">
        <Text className="text-4xl">🛒</Text>
      </View>
      <Text className="text-xl font-bold text-gray-800 dark:text-white mb-2 text-center">
        Keranjang Anda Kosong
      </Text>
      <Text className="text-gray-500 dark:text-gray-400 text-center leading-6">
        Belum ada item yang ditambahkan ke kera njang. Mulai belanja untuk
        melihat toko-toko di sini.
      </Text>
    </View>
  );

  const StoreCardComponent = ({ store }) => (
    <TouchableOpacity
      onPress={() => handleStorePress(store.name)}
      className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-3 mx-4 shadow-sm border border-gray-100 dark:border-gray-700"
    >
      <View className="flex-row items-center">
        <View className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-700 mr-4 overflow-hidden">
          {store.image && typeof store.image === "object" ? (
            <Image
              source={store.image}
              className={`w-full h-full ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full justify-center items-center">
              <Text className="text-2xl">🏪 </Text>
            </View>
          )}
        </View>

        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800 dark:text-white mb-1">
            {store.name}
          </Text>
          <Text
            className="text-sm text-gray-500 dark:text-gray-400 mb-2"
            numberOfLines={1}
          >
            {store.itemsPreview}
          </Text>
          <View className="flex-row items-center">
            <View className="bg-blue-100 dark:bg-blue-900 rounded-full px-3 py-1 mr-2">
              <Text className="text-blue-600 dark:text-blue-300 text-xs font-medium">
                {store.itemCount} item{store.itemCount > 1 ? "s" : ""}
              </Text>
            </View>
            <Text className="text-green-600 dark:text-green-400 font-bold text-sm">
              {formatCurrency(store.totalPrice)}
            </Text>
          </View>
        </View>

        <View className="ml-2">
          <View className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 justify-center items-center">
            <Text className="text-gray-400 dark:text-gray-500">›</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <Screen>
      {/* Header */}
      <View className={`${isDarkMode ? "bg-gray-800" : "bg-white"} pb-4`}>
        <Text className="text-xl font-bold text-gray-800 dark:text-white text-center py-4">
          Keranjang Belanja
        </Text>

        {uniqueStoresInCart.length > 0 && (
          <View className="px-4">
            <Text className="text-sm text-gray-500 dark:text-gray-400 text-center">
              {uniqueStoresInCart.length} toko •{" "}
              {uniqueStoresInCart.reduce(
                (sum, store) => sum + store.itemCount,
                0
              )}{" "}
              item
            </Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        {uniqueStoresInCart.length > 0 ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 16 }}
          >
            {uniqueStoresInCart.map((store) => (
              <StoreCardComponent key={store.name} store={store} />
            ))}

            {/* Footer info */}
            <View className="px-4 pt-4">
              <Text className="text-xs text-gray-400 dark:text-gray-500 text-center">
                Ketuk toko untuk melihat detail keranjang
              </Text>
            </View>
          </ScrollView>
        ) : (
          <View className="flex-1 justify-center items-center">
            <EmptyCartComponent />
          </View>
        )}
      </View>
    </Screen>
  );
};

export default StoreListScreen;
