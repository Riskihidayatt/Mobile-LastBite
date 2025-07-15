import React, { useState, useContext, useRef, useEffect } from 'react';
import {
    View, Text, Image, TouchableOpacity, TextInput,
    SafeAreaView, ScrollView, StatusBar, Animated,
    Alert, ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { submitMenuItemReview, resetSubmitStatus } from '../../redux/slice/ReviewSlice';
import { markOrderAsReviewed } from '../../redux/slice/orderSlice';

const RatingScreen = ({ route }) => {
    const navigation = useNavigation();
    const { theme } = useContext(ThemeContext);
    const isDarkMode = theme === 'dark';
    const dispatch = useDispatch();

    // Hubungkan ke state Redux
    const { submitStatus: reviewStatus, error: reviewError } = useSelector((state) => state.reviews);
    const { orderDetails } = route.params;

    // State lokal untuk rating dan komentar
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    // State dan refs untuk animasi
    const starAnimations = useRef([...Array(5)].map(() => new Animated.Value(1))).current;
    const submitAnimation = useRef(new Animated.Value(1)).current;
    const headerAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(headerAnimation, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleStarPress = (selectedRating) => {
        setRating(selectedRating);
        starAnimations.forEach((anim) => {
            Animated.spring(anim, { toValue: 1.2, friction: 3, useNativeDriver: true }).start(() => {
                Animated.spring(anim, { toValue: 1, friction: 3, useNativeDriver: true }).start();
            });
        });
    };

    // Fungsi untuk mengirim ulasan
    const handleSubmitRating = () => {
        if (rating === 0) {
            Alert.alert('Peringatan', 'Silakan pilih rating bintang terlebih dahulu!');
            return;
        }

        // Asumsi kita memberi rating untuk item pertama dalam pesanan
        const reviewData = {
            orderId: orderDetails.orderId,
            menuItemId: orderDetails.orderItems[0].menuItemId,
            rating: rating,
            comment: comment,
        };

        dispatch(submitMenuItemReview(reviewData));
    };

    useEffect(() => {
        if (reviewStatus === 'succeeded') {
            Alert.alert('Terima kasih!', 'Ulasan Anda berhasil dikirim.', [
                { text: 'OK', onPress: () => {
                    dispatch(resetSubmitStatus());
                    navigation.goBack();
                }}
            ]);
        } else if (reviewStatus === 'failed') {
            Alert.alert('Gagal', reviewError || 'Tidak dapat mengirim ulasan.');
            dispatch(resetSubmitStatus());
        }
    }, [reviewStatus, reviewError, dispatch, navigation]);

    
    const getRatingText = (rating) => {
        const texts = { 1: 'Sangat Buruk 😞', 2: 'Buruk 😕', 3: 'Cukup 😐', 4: 'Baik 😊', 5: 'Sangat Baik 🤩' };
        return texts[rating] || 'Pilih rating bintang';
    };

    const displayImage = orderDetails.orderItems?.[0]?.productImageUrl || orderDetails.sellerImageUrl;

    return (
        <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            
            <LinearGradient
                colors={isDarkMode ? ['#10B981', '#065F46'] : ['#10B981', '#34D399']}
                className="absolute top-0 left-0 right-0 h-80"
            />

            <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
                {/* Header Section */}
                <Animated.View 
                  style={{
                      opacity: headerAnimation,
                      transform: [{
                          translateY: headerAnimation.interpolate({
                              inputRange: [0, 1],
                              outputRange: [50, 0],
                          }),
                      }],
                  }}
                  className="items-center pt-16 px-6"
                >
                  <View className="relative">
                      <Image
                          source={{ uri: displayImage }}
                          className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                      />
                      <View className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
                          <Ionicons name="star" size={16} color="white" />
                      </View>
                  </View>
                  <Text className="text-white/80 text-sm mt-4">Beri ulasan untuk</Text>
                  <Text className="text-2xl font-bold text-center mt-1 text-white">
                      {orderDetails.storeName}
                  </Text>
                </Animated.View>

                {/* Rating Card */}
                <View className={`mx-6 mt-8 rounded-3xl p-6 shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <Text className={`text-center text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        Bagaimana pengalaman Anda?
                    </Text>
                    <Text className={`text-center text-sm mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {getRatingText(rating)}
                    </Text>

                    {/* Rating Stars */}
                    <View className="flex-row justify-center mb-6">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <TouchableOpacity key={star} onPress={() => handleStarPress(star)} className="mx-2" activeOpacity={0.7}>
                                <Animated.View style={{ transform: [{ scale: starAnimations[star - 1] }] }}>
                                    <Ionicons
                                        name={rating >= star ? 'star' : 'star-outline'}
                                        size={40}
                                        color={rating >= star ? '#FBBF24' : (isDarkMode ? '#4B5563' : '#D1D5DB')}
                                    />
                                </Animated.View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Comment Section */}
                <View className={`mx-6 mt-6 rounded-3xl p-6 shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <View className="flex-row items-center mb-4">
                        <Ionicons name="chatbubble-outline" size={20} color={isDarkMode ? '#10B981' : '#059669'} />
                        <Text className={`ml-2 text-base font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                            Bagikan pengalamanmu (opsional)
                        </Text>
                    </View>
                    <TextInput
                        className={`rounded-2xl border text-sm px-4 py-4 h-36 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-800'}`}
                        placeholder="Ceritakan pengalaman Anda dengan detail..."
                        placeholderTextColor={isDarkMode ? '#9CA3AF' : '#6B7280'}
                        multiline
                        textAlignVertical="top"
                        value={comment}
                        onChangeText={setComment}
                    />
                </View>

                {/* Submit Button */}
                <View className="px-6 mt-8">
                    <Animated.View style={{ transform: [{ scale: submitAnimation }] }}>
                        <TouchableOpacity
                            onPress={handleSubmitRating}
                            disabled={reviewStatus === 'loading'}
                            className={`rounded-full shadow-lg ${reviewStatus === 'loading' ? 'opacity-70' : ''}`}
                            activeOpacity={0.9}
                        >
                            <LinearGradient
                                colors={['#10B981', '#059669']}
                                className="py-4 rounded-full items-center"
                            >
                                <View className="flex-row items-center">
                                    {reviewStatus === 'loading' ? (
                                        <ActivityIndicator color="white" className="mr-2" />
                                    ) : (
                                        <Ionicons name="send-outline" size={18} color="white" className="mr-2" />
                                    )}
                                    <Text className="text-white text-base font-bold">
                                        {reviewStatus === 'loading' ? 'Mengirim...' : 'Kirim Ulasan'}
                                    </Text>
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>
                    </Animated.View>
                    <TouchableOpacity onPress={() => navigation.goBack()} className="mt-4 py-3 items-center">
                        <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Lewati untuk sekarang
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default RatingScreen;