import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../assets/colors";
import { Ionicons } from "@expo/vector-icons";
import FoodCard from "../../components/FoodCard";
import { ThemeContext } from "../../context/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { fetchMenuItems } from "../../redux/slice/menuSlice";
import { useNavigation } from "@react-navigation/native";
import getDataLocation from "../../utils/getDataLocation";
import Screen from "../Screen";
import AutoHide from "../../components/common/AutoHide";
import LocationBottomSheet from "../../components/LocationBottomSheet";
import FilterBottomSheet from "../../components/FilterBottomSheet";

const dummyMenuItems = [];

const HomeScreen = () => {
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === "dark";
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  const {
    items: menuItems,
    status,
    error,
  } = useSelector((state) => state.menu);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [priceSort, setPriceSort] = useState(null);
  const [ratingSort, setRatingSort] = useState(null);
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [location, setLocation] = useState("Lokasi tidak ditemukan");
  const [locationModalVisible, setLocationModalVisible] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(fetchMenuItems());
    setRefreshing(false);
  }, [dispatch]);

  useEffect(() => {
    const fetchLocationFromUser = async () => {
      if (user?.latitude && user?.longitude) {
        const dataLocation = await getDataLocation(user.latitude, user.longitude);
        if (dataLocation) {
          setLocation(`${dataLocation.address}`);
        } else {
          setLocation("Lokasi tidak ditemukan");
        }
      } else {
        setLocation("Lokasi tidak ditemukan");
      }
    };
    fetchLocationFromUser();
  }, [user]);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchMenuItems());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (user?.longitude && user?.latitude) {
      dispatch(fetchMenuItems({ longitude: user.longitude, latitude: user.latitude }));
    }
  }, [dispatch, user]);

  const categories = useMemo(() => {
    const allCategories = menuItems
      .map((item) => item.category)
      .filter(Boolean);
    return [...new Set(allCategories)];
  }, [menuItems]);

  const filteredMenuItems = useMemo(() => {
    let items = [...menuItems];

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(lowercasedQuery) ||
          item.storeName.toLowerCase().includes(lowercasedQuery)
      );
    }

    if (activeCategory !== "All") {
      items = items.filter((item) => item.category === activeCategory);
    }

    if (priceSort === "lowest") {
      items.sort((a, b) => a.price - b.price);
    } else if (priceSort === "highest") {
      items.sort((a, b) => b.price - a.price);
    }

    if (ratingSort === "highest") {
      items.sort((a, b) => b.rating - a.rating);
    } else if (ratingSort === "lowest") {
      items.sort((a, b) => a.rating - b.rating);
    }

    return items;
  }, [menuItems, searchQuery, activeCategory, priceSort, ratingSort]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const toggleFilterModal = () => {
    setFilterModalVisible(!isFilterModalVisible);
  };

  const handleApplyFilters = () => {
    // Filters are automatically applied through useMemo
    // This function can be used for additional logic if needed
  };

  const handleClearFilters = () => {
    setActiveCategory("All");
    setPriceSort(null);
    setRatingSort(null);
  };

  const hasActiveFilters = activeCategory !== "All" || priceSort || ratingSort;

  const sortedMenuItems = filteredMenuItems.sort(
    (a, b) => a.distanceKm - b.distanceKm
  );

  if (status === "loading" && !refreshing) {
    return (
      <LinearGradient
        colors={isDarkMode ? colors.gradientDark : colors.gradientLight}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <View className="items-center">
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text
            className={`mt-4 text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            Memuat menu...
          </Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <>
      <View className={`pt-10 ${isDarkMode ? "bg-green-950" : "bg-green-50"}`}>
        <AutoHide duration={10000}>
          <View
            className={`${isSearchFocused ? "26" : "pt-6"} pb-5 px-6 ${isDarkMode ? "bg-orange-900" : "bg-orange-100"}`}
          >
            <Text
              className={`text-3xl font-bold ${isDarkMode ? "text-green-50" : "text-green-950"}`}
            >
              Selamat Datang! 👋
            </Text>
            <Text
              className={`text-md mt-1 ${isDarkMode ? "text-green-200" : "text-green-800"}`}
            >
              Temukan makanan favorit Anda
            </Text>
          </View>
        </AutoHide>
        {!isSearchFocused && (
          <TouchableOpacity
            onPress={() => setLocationModalVisible(true)}
            className={`flex-row items-center px-3 ${isDarkMode ? "bg-green-950" : "bg-green-100"}`}
          >
            <View
              className={`p-2 rounded-full ${isDarkMode ? "bg-gray-200" : "bg-white"}`}
            >
              <Ionicons
                name="location-sharp"
                size={18}
                color={isDarkMode ? "#34D399" : "#77aa77"}
              />
            </View>
            <View className="flex-1 w-full py-2 px-4">
              <Text
                className={`font-semibold text-sm ${isDarkMode ? "text-green-100" : "text-green-900"}`}
              >
                {location}
              </Text>
              <Text
                className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                Ganti lokasi
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      <View
        className={`${isDarkMode ? "bg-gray-900" : "bg-white"} flex-row items-center gap-3 p-3`}
      >
        {isSearchFocused ? (
          <View
            className={`flex-1 flex-row items-center rounded-lg py-1 px-4 shadow-sm ${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-100"}`}
          >
            <Ionicons
              name="search"
              size={20}
              color={isDarkMode ? "#9CA3AF" : "#6B7280"}
            />
            <TextInput
              placeholder="Cari makanan atau restoran..."
              className={`flex-1 ml-2 text-base ${isDarkMode ? "text-white" : "text-gray-700"}`}
              placeholderTextColor={isDarkMode ? "#9CA3AF" : "#9CA3AF"}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={true}
            />
          </View>
        ) : (
          <TouchableOpacity
            className={`flex-1 flex-row items-center rounded-2xl px-5 py-4 shadow-sm ${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-100"}`}
            onPress={() => setIsSearchFocused(true)}
          >
            <Ionicons
              name="search"
              size={20}
              color={isDarkMode ? "#9CA3AF" : "#6B7280"}
            />
            <Text
              className={`ml-3 text-base ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
            >
              Cari makanan atau restoran...
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          className={`p-4 rounded-2xl shadow-sm ${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-100"}`}
          onPress={toggleFilterModal}
        >
          <Ionicons
            name="options-outline"
            size={24}
            color={isDarkMode ? "#9CA3AF" : "#6B7280"}
          />
        </TouchableOpacity>
        {isSearchFocused && (
          <TouchableOpacity
            onPress={() => {
              setIsSearchFocused(false);
              setSearchQuery("");
            }}
          >
            <Text
              className={`text-base font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}
            >
              Batal
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <Screen>
        <View className={`h-full`}>
          {!isSearchFocused && (
            <>
              <View className="flex-row mb-2">
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category}
                      className={`py-3 px-5 rounded-2xl border-2 shadow-sm ${activeCategory === category ? "bg-[#FF6B35] border-[#FF6B35] shadow-[#FF6B35]/25" : isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
                      onPress={() => setActiveCategory(category)}
                    >
                      <Text
                        className={`font-semibold text-sm  ${activeCategory === category ? "text-white" : isDarkMode ? "text-gray-200" : "text-gray-700"}`}
                      >
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              <View className="pb-6">
                {/* <View className="flex-row items-center justify-between mb-4">
                                <Text className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>✨ Rekomendasi</Text>
                            </View> */}
                <FlatList
                  // data={recommendations}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      className={`w-40 mr-4 rounded-3xl overflow-hidden shadow-lg ${isDarkMode ? "bg-gray-800 shadow-gray-900" : "bg-white shadow-gray-200"}`}
                      onPress={() =>
                        navigation.navigate("DetailMenu", {
                          menuItemId: item.id,
                        })
                      }
                    >
                      <View className="relative">
                        <Image
                          source={{ uri: item.image }}
                          className="w-full h-28 rounded-t-3xl"
                        />
                        <View className="absolute top-3 right-3 bg-black/50 px-2 py-1 rounded-full flex-row items-center">
                          <Ionicons name="star" size={12} color="#FFD700" />
                          <Text className="text-white text-xs ml-1 font-semibold">
                            {item.rating}
                          </Text>
                        </View>
                      </View>
                      <View className="p-4">
                        <Text
                          className={`font-bold text-sm mb-1 ${isDarkMode ? "text-white" : "text-gray-800"}`}
                          numberOfLines={1}
                        >
                          {item.name}
                        </Text>
                        <Text className="text-[#FF6B35] font-bold text-base">
                          {formatPrice(item.price)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  contentContainerStyle={{ paddingHorizontal: 4 }}
                />
              </View>
            </>
          )}
          <View className="flex-row flex-wrap justify-between px-4 py-2">
            {sortedMenuItems?.length > 0 ? (
              sortedMenuItems.map((item) => (
                <View key={item.id} style={{ width: "48%", marginBottom: 2 }}>
                  <FoodCard item={item} />
                </View>
              ))
            ) : (
              <View className="flex-1 items-center justify-center mt-12">
                <Text>tidak ada data</Text>
              </View>
            )}
          </View>
        </View>
      </Screen>

      <FilterBottomSheet
        isVisible={isFilterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        priceSort={priceSort}
        setPriceSort={setPriceSort}
        ratingSort={ratingSort}
        setRatingSort={setRatingSort}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />

      <LocationBottomSheet
        isVisible={locationModalVisible}
        onClose={() => setLocationModalVisible(false)}
      />
    </>
  );
};

export default HomeScreen;