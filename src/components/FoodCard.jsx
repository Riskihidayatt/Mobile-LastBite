import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ThemeContext } from "../context/ThemeContext";
import defaultImage from "../assets/no-image.png";

const FoodCard = ({ item }) => {
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === "dark";
  const navigation = useNavigation();
  const [imageError, setImageError] = useState(false);

  const isAvailable = item.status === "AVAILABLE";

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handlePress = () => {
    if (isAvailable) {
      navigation.navigate("DetailMenu", { menuItemId: item.id });
    }
  };

  const getStatusText = () => {
    switch (item.status) {
      case "AVAILABLE":
        return "Tersedia";
      case "SOLDOUT":
        return "Habis Terjual";
      case "NOT_AVAILABLE":
        return "Tidak Tersedia";
      default:
        return "";
    }
  };

  // Cek apakah image valid
  const imageSource = item.image
    ? { uri: item.image }
    // ? defaultImage
    : defaultImage;

  return (
    <TouchableOpacity
      className={`mb-4 rounded-xl overflow-hidden shadow-lg ${
        isDarkMode ? "bg-gray-800 shadow-gray-900" : "bg-white shadow-gray-200"
      } ${!isAvailable ? "opacity-50" : ""}`}
      onPress={handlePress}
      disabled={!isAvailable}
    >
      {/* Image Section */}
      <View className="relative">
        <Image
  source={
    imageError || !item.image
      ? defaultImage
      : { uri: item.image }
  }
  style={{ width: "100%", height: 160 }}
  className="w-full h-48"
  resizeMode="cover"
  onError={() => {
    setImageError(true);
  }}
/>
        {/* Price Badge */}
        <View className="absolute bottom-2 right-2 flex-row items-center rounded-full overflow-hidden">
          <Text className="text-white text-xs font-semibold bg-black/70 px-2 py-1">
            {item.distanceKm?.toFixed(2)} km
          </Text>
        </View>

        {/* Rating Badge */}
        <View className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded-full flex-row items-center">
          <Ionicons name="star" size={12} color="#FFD700" />
          <Text className="text-white text-xs ml-1 font-semibold">
            {item.rating || 4.8}
          </Text>
        </View>

        {/* Status Badge */}
        <View className="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded-full flex-row items-center">
          {isAvailable ? (
            <Ionicons name="checkmark-circle" size={12} color="#00FF00" />
          ) : (
            <Ionicons name="close-circle" size={12} color="#FF0000" />
          )}
          <Text className="text-white text-xs ml-1 font-semibold">
            {getStatusText()}
          </Text>
        </View>
      </View>
      <View>
        {/* Store Info */}
        <View
          className={` items-start justify-between mb-2 px-2 py-1 ${
            isDarkMode ? "bg-gray-700" : "bg-gray-100"
          }`}
        >
          <View className="flex-row items-center flex-1 py-2 w-full overflow-hidden">
            <Ionicons
              name="storefront-outline"
              size={14}
              color={isDarkMode ? "#9CA3AF" : "#6B7280"}
            />
            <Text
              className={`text-x ml-1 truncate ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
              numberOfLines={1}
            >
              {item.storeName}
            </Text>
          </View>
        </View>
          <View className="mx-4 mb-4">

            {/* Name Section */}
            <Text
              className={`font-bold text-md mb-2 ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
              numberOfLines={2}
            >
              {item.name}
            </Text>
            <Text
              className={`text-sm text-right line-through mb-2 ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
              numberOfLines={2}
            >
              {formatPrice(item.oldPrice)}
              <View className="flex-row items-center ps-2">
                <Text className="text-white bg-red-500/90 px-2 py-1 text-xs rounded-full">
                  -
                {Math.round(
                  ((item.oldPrice - item.price) / item.oldPrice) * 100
                )}
                %
                </Text>
              </View>
              <Text className="text-white  font-medium ">
              
              </Text>
            </Text>
              
            {/* Price Section */}
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-[#ffefe9] font-bold text-lg bg-green-900 rounded-md px-2 text-center">
                  {formatPrice(item.price)}
                </Text>
              </View>
            </View>
          </View>
      </View>
    </TouchableOpacity>
  );
};

export default FoodCard;
