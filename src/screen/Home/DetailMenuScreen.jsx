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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, Feather, FontAwesome5 } from "@expo/vector-icons";
import { ThemeContext } from "../../context/ThemeContext";
import { useDispatch, useSelector } from "react-redux";

// Impor semua action yang relevan
import { addToCart, resetAddCartStatus } from "../../redux/slice/cartSlice";
import {
  createDirectOrder,
  resetOrderStatus,
} from "../../redux/slice/orderSlice";
import { fetchReviewsByMenuItem } from "../../redux/slice/ReviewSlice";

// Impor semua komponen BottomSheet/Modal
import AddToCartModal from "../../components/AddToCartModal";
import MapBottomSheet from "../../components/common/MapBottomSheet";
import BuyNowBottomSheet from "../../components/BuyNowBottomSheet";
import ResponseModal from "../../components/common/ResponseModal";
import ModalConfirm from "../../components/common/ModalConfirm";
import ReviewItem from "../../components/ReviewItem"; // Impor komponen ReviewItem

const DetailMenuScreen = ({ route }) => {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === "dark";
  const dispatch = useDispatch();

  // --- State Lokal ---
  const [isCartModalVisible, setIsCartModalVisible] = useState(false);
  const [isBuyNowSheetVisible, setIsBuyNowSheetVisible] = useState(false);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(1);
  const [feedback, setFeedback] = useState({
    isVisible: false,
    isSuccess: true,
    title: "",
    message: "",
  });
  const [confirmModal, setConfirmModal] = useState({
    isVisible: false,
    message: "",
    onConfirm: null,
  });

  // --- Selector Redux ---
  const { menuItemId } = route.params;
  const {
    addStatus,
    addError,
    items: cartItemsByStore,
  } = useSelector((state) => state.cart);
  const item = useSelector((state) =>
    state.menu.items.find((menuItem) => menuItem.id === menuItemId)
  );
  const {
    submitStatus,
    paymentUrl,
    error: orderError,
  } = useSelector((state) => state.orders);
  const { reviews = [], fetchStatus: reviewFetchStatus = "idle" } =
    useSelector((state) => state.reviews) || {};

  // --- useEffect untuk Fetch Ulasan ---
  useEffect(() => {
    if (menuItemId) {
      dispatch(fetchReviewsByMenuItem(menuItemId));
    }
  }, [dispatch, menuItemId]);

  // --- Handlers ---
  const formatCurrency = (amount) =>
    `Rp${(amount || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;

  // Validasi Stok
  const itemInCart = Object.values(cartItemsByStore)
    .flat()
    .find((cartItem) => cartItem.menuItemId === item?.id);
  const quantityInCart = itemInCart?.quantity || 0;
  const availableStock = item?.quantity || 0;
  const stockLeftToAdd = availableStock - quantityInCart;

  const handleConfirmAddToCart = () => {
    if (!item?.id) {
      return alert("Informasi menu tidak ditemukan.");
    }
    if (cartQuantity > stockLeftToAdd) {
      return Alert.alert(
        "Stok Tidak Cukup",
        `Anda sudah punya ${quantityInCart} item di keranjang. Anda hanya bisa menambahkan ${stockLeftToAdd} lagi.`
      );
    }
    setConfirmModal({
      isVisible: true,
      message: "Tambahkan item ini ke keranjang?",
      onConfirm: () => {
        dispatch(addToCart({ item: item, quantity: cartQuantity }));
        setIsCartModalVisible(false);
      },
    });
  };
  const handleBuyNowPress = () => setIsBuyNowSheetVisible(true);

  const handleConfirmBuyNow = (quantity) => {
    if (!item?.id) {
      return alert("Informasi menu tidak ditemukan.");
    }
    if (quantity > availableStock) {
      return Alert.alert(
        "Stok Tidak Cukup",
        `Maaf, stok hanya tersisa ${availableStock}.`
      );
    }
    const orderData = {
      orderItems: [{ menuItemId: item.id, quantity: quantity }],
    };
    setConfirmModal({
      isVisible: true,
      message: "Anda yakin ingin langsung membeli item ini?",
      onConfirm: () => dispatch(createDirectOrder(orderData)),
    });
  };

  const handleViewAllReviews = () =>
    navigation.navigate("AllReviewsScreen", {
      menuItemId: item.id,
      reviews: reviews,
    });

  // --- useEffects untuk Feedback dan Navigasi ---
  useEffect(() => {
    if (addStatus === "succeeded") {
      setFeedback({
        isVisible: true,
        isSuccess: true,
        title: "Berhasil!",
        message: `"${item.name}" telah ditambahkan ke keranjang.`,
      });
      dispatch(resetAddCartStatus());
    } else if (addStatus === "failed") {
      setFeedback({
        isVisible: true,
        isSuccess: false,
        title: "Gagal Menambahkan",
        message: addError || "Terjadi kesalahan.",
      });
      dispatch(resetAddCartStatus());
    }
  }, [addStatus, addError, dispatch, item?.name]);

  useEffect(() => {
    if (submitStatus === "succeeded" && paymentUrl) {
      setIsBuyNowSheetVisible(false);
      navigation.navigate("PaymentScreen", {
        paymentUrl: paymentUrl,
        onPaymentFinish: () => {
          dispatch(resetOrderStatus());
          navigation.navigate("Home");
        },
      });
    } else if (submitStatus === "failed") {
      setIsBuyNowSheetVisible(false);
      setFeedback({
        isVisible: true,
        isSuccess: false,
        title: "Gagal Membuat Pesanan",
        message: orderError || "Terjadi kesalahan.",
      });
      dispatch(resetOrderStatus());
    }
  }, [submitStatus, paymentUrl, navigation, dispatch, orderError]);

  if (!item) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
        <ActivityIndicator size="large" color="#FF6B35" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      {/* ScrollView dengan contentContainerStyle dan padding bottom yang cukup */}
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 150 }} // Memberikan ruang lebih besar untuk bottom buttons
        bounces={true} // Memungkinkan bounce effect
        overScrollMode="always" // Untuk Android
        style={{ marginBottom: 100 }} // Menambahkan margin bottom pada ScrollView
      >
        <View className="relative">
          <Image
            source={{ uri: item.image }}
            className="h-72 w-full rounded-b-3xl"
            style={{ resizeMode: "cover" }}
          />
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="absolute top-14 left-4 rounded-full bg-white/70 p-2"
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Cart")}
            className="absolute top-14 right-4 rounded-full bg-white/70 p-2"
          >
            <Ionicons name="cart-outline" size={24} color="#333" />
          </TouchableOpacity>
          <View className="absolute bottom-4 left-4 rounded-full bg-white/90 px-4 py-2">
            <Text className="text-sm font-semibold text-gray-700">
              {item.storeName || "Nama Warung"}
            </Text>
          </View>
        </View>
        
        <View className="-mt-6 rounded-t-3xl bg-white p-6 dark:bg-gray-900">
          <View className="mb-4 flex-row items-start justify-between">
            <View className="flex-1">
              <Text className="mb-2 text-2xl font-bold text-gray-800 dark:text-white">
                {item.name}
              </Text>
            </View>
          </View>
          
          <View className="mb-6 flex-row items-baseline">
            <Text className="mr-2 text-3xl font-bold text-[#FF6B35]">
              {formatCurrency(item.price)}
            </Text>
            {item.oldPrice && (
              <Text className="text-lg text-gray-400 line-through">
                {formatCurrency(item.oldPrice)}
              </Text>
            )}
          </View>
          
          <View className="mb-6 flex-row justify-between">
            <View className="mr-2 flex-1 rounded-2xl bg-green-50 p-4 dark:bg-green-900/30">
              <Text className="text-sm font-semibold text-green-600 dark:text-green-400">
                Ambil Sendiri
              </Text>
              <Text className="text-xs text-green-800 dark:text-green-300">
                tersedia
              </Text>
            </View>
            <View className="ml-2 flex-1 rounded-2xl bg-orange-50 p-4 dark:bg-orange-900/30">
              <Text className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                Stok
              </Text>
              <Text className="text-xs text-orange-800 dark:text-orange-300">
                {item.quantity || "600"}
              </Text>
            </View>
          </View>
          
          <View className="mb-6">
            <Text className="mb-3 text-lg font-bold text-gray-800 dark:text-white">
              Deskripsi
            </Text>
            <Text className="text-base leading-6 text-gray-600 dark:text-gray-300">
              {item.description || "Menu lezat yang dibuat dengan bahan-bahan berkualitas tinggi dan cita rasa yang autentik. Cocok untuk dinikmati kapan saja dan dimana saja. Rasakan kelezatan yang tak terlupakan dengan setiap gigitannya."}
            </Text>
          </View>
          
          <TouchableOpacity
            onPress={() => setIsLocationModalVisible(true)}
            className="mb-6 flex-row items-center rounded-2xl bg-gray-100 p-4 dark:bg-gray-700"
          >
            <Ionicons name="location" size={20} color="#FF6B35" />
            <Text className="ml-3 flex-1 text-base font-semibold text-gray-800 dark:text-white">
              Lihat Lokasi Toko
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#FF6B35" />
          </TouchableOpacity>

          {/* Bagian Ulasan Dinamis */}
          <View className="mb-6">
            {/* Rating Summary */}
            <View className="bg-orange-50 p-4 dark:bg-orange-900/30 rounded-2xl mb-4 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons name="star" size={22} color="#F97316" className="mr-2" />
                <Text className="text-orange-600 text-xl font-bold">{item.rating.toFixed(1) || "0.0"}</Text>
              </View>
              <Text className="text-gray-600 text-sm">📊 Dari {reviews.length} Ulasan</Text>
            </View>

            {/* Reviews Header */}
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-bold text-gray-800 dark:text-white">Ulasan ({reviews.length})</Text>
              {reviews.length > 0 && (
                <TouchableOpacity onPress={handleViewAllReviews} className="flex-row items-center">
                  <Text className="text-sm font-semibold text-[#FF6B35]">Lihat Semua</Text>
                  <Ionicons name="chevron-forward" size={16} color="#FF6B35" />
                </TouchableOpacity>
              )}
            </View>

            {/* Reviews Content */}
            {reviewFetchStatus === 'loading' ? (
              <View className="py-4">
                <ActivityIndicator color="#FF6B35" />
              </View>
            ) : reviewFetchStatus === 'succeeded' && reviews.length > 0 ? (
              reviews.slice(0, 1).map((review) => (
                <View key={review.id} className="mb-4">
                  <ReviewItem review={review} />
                </View>
              ))
            ) : (
              <View className="py-8">
                <Text className="text-center text-gray-500 dark:text-gray-400">
                  Belum ada ulasan untuk menu ini.
                </Text>
              </View>
            )}
          </View>

          {/* Spacer untuk memberikan jarak dari bottom buttons */}
          <View className="h-12" />
          
          {/* Extra spacer untuk memastikan scroll bisa sampai ke ulasan terakhir */}
          <View className="h-8" />
        </View>
      </ScrollView>

      {/* Bottom Action Buttons dengan shadow dan spacing yang lebih baik */}
      <View
        className={`absolute bottom-0 w-full border-t border-gray-200 px-4 py-4 dark:border-gray-700 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        <View className="flex-row justify-between space-x-3">
          <TouchableOpacity
            onPress={() => setIsCartModalVisible(true)}
            className="flex-1 mr-1 flex-row items-center justify-center rounded-2xl bg-[#FF6B35] py-4 shadow-lg"
            disabled={addStatus === "loading"}
            style={{
              shadowColor: "#FF6B35",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            {addStatus === "loading" ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Feather name="shopping-cart" size={20} color="white" />
                <Text className="ml-2 text-base font-bold text-white">
                  Tambah Keranjang
                </Text>
              </>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleBuyNowPress}
            className="flex-1 ml-1 flex-row items-center justify-center rounded-2xl bg-green-500 py-4 shadow-lg"
            style={{
              shadowColor: "#10B981",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <FontAwesome5 name="money-bill-wave" size={20} color="white" />
            <Text className="ml-2 text-base font-bold text-white">
              Beli Sekarang
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* All Modals */}
      <AddToCartModal
        isVisible={isCartModalVisible}
        onClose={() => setIsCartModalVisible(false)}
        item={item}
        isDarkMode={isDarkMode}
        quantity={cartQuantity}
        setQuantity={setCartQuantity}
        onConfirm={handleConfirmAddToCart}
        cartStatus={addStatus}
        availableStock={stockLeftToAdd}
      />
      
      <MapBottomSheet
        isVisible={isLocationModalVisible}
        onClose={() => setIsLocationModalVisible(false)}
        item={item}
      />
      
      <BuyNowBottomSheet
        isVisible={isBuyNowSheetVisible}
        onClose={() => setIsBuyNowSheetVisible(false)}
        item={item}
        isDarkMode={isDarkMode}
        onConfirm={handleConfirmBuyNow}
        orderStatus={submitStatus}
      />
      
      <ResponseModal
        visible={feedback.isVisible}
        type={feedback.isSuccess ? 'success' : 'error'}
        message={feedback.message}
        onClose={() => setFeedback({ ...feedback, isVisible: false })}
      />

      <ModalConfirm
        visible={confirmModal.isVisible}
        message={confirmModal.message}
        onYes={() => {
          if (confirmModal.onConfirm) {
            confirmModal.onConfirm();
          }
          setConfirmModal({ isVisible: false, message: "", onConfirm: null });
        }}
        onNo={() => setConfirmModal({ isVisible: false, message: "", onConfirm: null })}
      />
    </SafeAreaView>
  );
};

export default DetailMenuScreen;