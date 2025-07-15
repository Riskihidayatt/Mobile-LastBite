import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

const EditFotoUser = ({ profileImage, user, isDarkMode, showImagePickerOptions }) => {
  return (
    <View className="items-stretch">
      <TouchableOpacity
        onPress={showImagePickerOptions}
        className="w-32 h-32 rounded-full bg-gray-300 dark:bg-gray-700 items-center justify-center relative border-2 border-green-500"
      >
        {profileImage ? (
          <Image
            source={
              user?.avatar ? { uri: user.avatar } : { uri: profileImage }
            }
            className="w-full h-full rounded-full border-2 "
          />
        ) : (
          <Ionicons
            name="person"
            size={80}
            color={isDarkMode ? 'green' : 'darkgreen'}
          />
        )}
        <View className="absolute bottom-0 right-0 bg-green-500 rounded-full p-2">
          <Feather name="camera" size={20} color="white" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={showImagePickerOptions}
        className="mt-2 mx-auto"
      >
        <Text
          className={`font-semibold text-center ${
            isDarkMode ? 'text-green-300' : 'text-green-500'
          }`}
        >
          Ubah Foto Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditFotoUser;
