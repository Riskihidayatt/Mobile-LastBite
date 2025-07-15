import React, { useCallback, useMemo, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviewsByMenuItem } from "../../redux/slice/ReviewSlice";
import ReviewItem from "../../components/ReviewItem";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../../context/ThemeContext";

const AllReviewsScreen = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === "dark";
  const { menuItemId } = route.params;

  const [searchText, setSearchText] = useState("");
  const { reviews: allReviews, fetchStatus } = useSelector(
    (state) => state.reviews
  );

  React.useEffect(() => {
    if (menuItemId) {
      dispatch(fetchReviewsByMenuItem(menuItemId));
    }
  }, [dispatch, menuItemId]);

  const filteredReviews = useMemo(() => {
    if (!searchText) return allReviews;
    return allReviews.filter(
      (review) =>
        review.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [allReviews, searchText]);

  const onRefresh = useCallback(() => {
    if (menuItemId) {
      dispatch(fetchReviewsByMenuItem(menuItemId));
    }
  }, [dispatch, menuItemId]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">

      {/* Daftar Ulasan */}
      {fetchStatus === "loading" && allReviews.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FF6B35" />
        </View>
      ) : (
        <FlatList
          data={filteredReviews}
          renderItem={({ item }) => <ReviewItem review={item} />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16 }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20">
              <Ionicons name="chatbubbles-outline" size={64} color="#D1D5DB" />
              <Text className="mt-4 text-lg text-gray-500 dark:text-gray-400">
                Tidak Ada Ulasan Ditemukan
              </Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={fetchStatus === "loading"}
              onRefresh={onRefresh}
              tintColor="#FF6B35"
            />
          }
        />
      )}
    </SafeAreaView>
  );
};


export default AllReviewsScreen;
