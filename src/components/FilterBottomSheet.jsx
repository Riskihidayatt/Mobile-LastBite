import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Dimensions,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { ThemeContext } from "../context/ThemeContext";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const FilterBottomSheet = ({
  isVisible,
  onClose,
  categories,
  activeCategory,
  setActiveCategory,
  priceSort,
  setPriceSort,
  ratingSort,
  setRatingSort,
  onApplyFilters,
  onClearFilters,
}) => {
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === "dark";

  // Local state for temporary filter values
  const [tempActiveCategory, setTempActiveCategory] = useState(activeCategory);
  const [tempPriceSort, setTempPriceSort] = useState(priceSort);
  const [tempRatingSort, setTempRatingSort] = useState(ratingSort);

  // Update local state when modal opens or props change
  useEffect(() => {
    if (isVisible) {
      setTempActiveCategory(activeCategory);
      setTempPriceSort(priceSort);
      setTempRatingSort(ratingSort);
    }
  }, [isVisible, activeCategory, priceSort, ratingSort]);

  const handleClearAll = () => {
    setTempActiveCategory("All");
    setTempPriceSort(null);
    setTempRatingSort(null);
    
    // Apply cleared filters immediately
    setActiveCategory("All");
    setPriceSort(null);
    setRatingSort(null);
    onClearFilters();
    onClose();
  };

  const handleApply = () => {
    // Apply the temporary filters to the actual state
    setActiveCategory(tempActiveCategory);
    setPriceSort(tempPriceSort);
    setRatingSort(tempRatingSort);
    onApplyFilters();
    onClose();
  };

  const handleClose = () => {
    // Reset temporary state to current active filters when closing without applying
    setTempActiveCategory(activeCategory);
    setTempPriceSort(priceSort);
    setTempRatingSort(ratingSort);
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View className="flex-1 justify-end">
        <TouchableOpacity className="flex-1" activeOpacity={1} onPress={handleClose}>
          <LinearGradient
            colors={['rgba(30,50,30,0)', 'rgba(30,50,30,0.5)', 'rgba(30,50,30,0.8)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            className="flex-1 h-screen"
          />
        </TouchableOpacity>
        <View
          className={`rounded-t-xl max-h-[80%] ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between p-6 border-b border-gray-200">
            <Text
              className={`text-xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Filter & Urutkan
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons
                name="close"
                size={24}
                color={isDarkMode ? "#FFF" : "#000"}
              />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View className="p-6">
            {/* Category Filter */}
            <View className="mb-6">
              <Text
                className={`font-semibold mb-4 ${
                  isDarkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Kategori
              </Text>
              <View className="flex-row flex-wrap gap-2">
                <TouchableOpacity
                  className={`py-3 px-4 rounded-2xl border-2 ${
                    tempActiveCategory === "All"
                      ? "bg-[#FF6B35] border-[#FF6B35]"
                      : isDarkMode
                      ? "bg-gray-700 border-gray-600"
                      : "bg-gray-50 border-gray-200"
                  }`}
                  onPress={() => setTempActiveCategory("All")}
                >
                  <Text
                    className={`font-medium ${
                      tempActiveCategory === "All"
                        ? "text-white"
                        : isDarkMode
                        ? "text-gray-200"
                        : "text-gray-700"
                    }`}
                  >
                    Semua
                  </Text>
                </TouchableOpacity>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    className={`py-3 px-4 rounded-2xl border-2 ${
                      tempActiveCategory === category
                        ? "bg-[#FF6B35] border-[#FF6B35]"
                        : isDarkMode
                        ? "bg-gray-700 border-gray-600"
                        : "bg-gray-50 border-gray-200"
                    }`}
                    onPress={() => setTempActiveCategory(category)}
                  >
                    <Text
                      className={`font-medium ${
                        tempActiveCategory === category
                          ? "text-white"
                          : isDarkMode
                          ? "text-gray-200"
                          : "text-gray-700"
                      }`}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Price Sort */}
            <View className="mb-6">
              <Text
                className={`font-semibold mb-4 ${
                  isDarkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Urutkan Harga
              </Text>
              <View className="flex-row gap-3">
                <TouchableOpacity
                  className={`flex-row items-center py-3 px-4 rounded-2xl border-2 flex-1 ${
                    tempPriceSort === "lowest"
                      ? "bg-[#FF6B35] border-[#FF6B35]"
                      : isDarkMode
                      ? "bg-gray-700 border-gray-600"
                      : "bg-gray-50 border-gray-200"
                  }`}
                  onPress={() => {
                    setTempPriceSort(tempPriceSort === "lowest" ? null : "lowest");
                    setTempRatingSort(null);
                  }}
                >
                  <Ionicons
                    name="trending-down"
                    size={16}
                    color={
                      tempPriceSort === "lowest"
                        ? "#FFF"
                        : isDarkMode
                        ? "#9CA3AF"
                        : "#6B7280"
                    }
                  />
                  <Text
                    className={`ml-2 font-medium ${
                      tempPriceSort === "lowest"
                        ? "text-white"
                        : isDarkMode
                        ? "text-gray-200"
                        : "text-gray-700"
                    }`}
                  >
                    Termurah
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-row items-center py-3 px-4 rounded-2xl border-2 flex-1 ${
                    tempPriceSort === "highest"
                      ? "bg-[#FF6B35] border-[#FF6B35]"
                      : isDarkMode
                      ? "bg-gray-700 border-gray-600"
                      : "bg-gray-50 border-gray-200"
                  }`}
                  onPress={() => {
                    setTempPriceSort(tempPriceSort === "highest" ? null : "highest");
                    setTempRatingSort(null);
                  }}
                >
                  <Ionicons
                    name="trending-up"
                    size={16}
                    color={
                      tempPriceSort === "highest"
                        ? "#FFF"
                        : isDarkMode
                        ? "#9CA3AF"
                        : "#6B7280"
                    }
                  />
                  <Text
                    className={`ml-2 font-medium ${
                      tempPriceSort === "highest"
                        ? "text-white"
                        : isDarkMode
                        ? "text-gray-200"
                        : "text-gray-700"
                    }`}
                  >
                    Termahal
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Rating Sort */}
            <View className="mb-6">
              <Text
                className={`font-semibold mb-4 ${
                  isDarkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Urutkan Rating
              </Text>
              <View className="flex-row gap-3">
                <TouchableOpacity
                  className={`flex-row items-center py-3 px-4 rounded-2xl border-2 flex-1 ${
                    tempRatingSort === "highest"
                      ? "bg-[#FF6B35] border-[#FF6B35]"
                      : isDarkMode
                      ? "bg-gray-700 border-gray-600"
                      : "bg-gray-50 border-gray-200"
                  }`}
                  onPress={() => {
                    setTempRatingSort(tempRatingSort === "highest" ? null : "highest");
                    setTempPriceSort(null);
                  }}
                >
                  <Ionicons
                    name="star"
                    size={16}
                    color={tempRatingSort === "highest" ? "#FFF" : "#FFD700"}
                  />
                  <Text
                    className={`ml-2 font-medium ${
                      tempRatingSort === "highest"
                        ? "text-white"
                        : isDarkMode
                        ? "text-gray-200"
                        : "text-gray-700"
                    }`}
                  >
                    Tertinggi
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-row items-center py-3 px-4 rounded-2xl border-2 flex-1 ${
                    tempRatingSort === "lowest"
                      ? "bg-[#FF6B35] border-[#FF6B35]"
                      : isDarkMode
                      ? "bg-gray-700 border-gray-600"
                      : "bg-gray-50 border-gray-200"
                  }`}
                  onPress={() => {
                    setTempRatingSort(tempRatingSort === "lowest" ? null : "lowest");
                    setTempPriceSort(null);
                  }}
                >
                  <Ionicons
                    name="star-outline"
                    size={16}
                    color={
                      tempRatingSort === "lowest"
                        ? "#FFF"
                        : isDarkMode
                        ? "#9CA3AF"
                        : "#6B7280"
                    }
                  />
                  <Text
                    className={`ml-2 font-medium ${
                      tempRatingSort === "lowest"
                        ? "text-white"
                        : isDarkMode
                        ? "text-gray-200"
                        : "text-gray-700"
                    }`}
                  >
                    Terendah
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-3 mt-4">
              <TouchableOpacity
                className={`flex-1 py-4 rounded-2xl border-2 ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-gray-50 border-gray-200"
                }`}
                onPress={handleClearAll}
              >
                <Text
                  className={`text-center font-semibold ${
                    isDarkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Reset
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 py-4 rounded-2xl bg-[#FF6B35]"
                onPress={handleApply}
              >
                <Text className="text-center font-semibold text-white">
                  Terapkan
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FilterBottomSheet;