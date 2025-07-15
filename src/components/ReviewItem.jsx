import React from 'react';
import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <Ionicons
                key={i}
                name={i <= rating ? "star" : "star-outline"}
                size={16}
                color={i <= rating ? "#FACC15" : "#E5E7EB"}
                style={{ marginRight: 2 }}
            />
        );
    }
    return stars;
};

const censorName = (name) => {
    if (!name) return "Pengguna";
    return name
        .split(" ")
        .map((word) => word.charAt(0) + "*".repeat(word.length - 1))
        .join(" ");
};

const formatDate = (date) => {
    if (!date) return "Baru saja";
    
    const reviewDate = new Date(date);
    const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    
    const day = reviewDate.getDate();
    const month = months[reviewDate.getMonth()];
    const year = reviewDate.getFullYear();
    
    return `${day} ${month} ${year}`;
};

const ReviewItem = ({ review }) => {
    const rating = review.averageRating || 4;
    const totalReviews = review.totalReviews || 3;

    return (
        <View className="mb-5 mx-4">
            {/* Review Content */}
            <View 
                className="bg-white p-5 rounded-2xl border border-gray-100"
                style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 6,
                    elevation: 2,
                }}
            >
                <View className="flex-row items-start">
                    {/* Profile */}
                    <View className="relative mr-4">
                        <Image
                            source={{
                                uri: review.profileImageUrl || `https://i.pravatar.cc/40?u=${review.customerId}`,
                            }}
                            className="h-12 w-12 rounded-full bg-gray-200"
                            style={{
                                borderWidth: 2,
                                borderColor: '#FB923C',
                            }}
                        />
                        <View className="absolute -bottom-1 -right-1 bg-green-500 rounded-full w-4 h-4 border-2 border-white">
                            <Ionicons name="checkmark" size={8} color="white" />
                        </View>
                    </View>

                    {/* Review Details */}
                    <View className="flex-1">
                        <View className="flex-row justify-between mb-1">
                            <Text className="font-semibold text-gray-800 text-base">
                                {censorName(review.customerName)}
                            </Text>
                            <Text className="text-xs text-gray-400">{formatDate(review.createdAt)}</Text>
                        </View>

                        <View className="flex-row items-center mb-2">
                            {renderStars(review.rating)}
                            <Text className="text-sm text-gray-600 ml-2">{review.rating}/5</Text>
                        </View>

                        <Text className="text-gray-700 text-sm leading-relaxed italic">
                            "{review.comment}"
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default ReviewItem;