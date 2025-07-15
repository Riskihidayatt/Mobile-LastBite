import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

const Button = ({ onPress, isLoading, children, className }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isLoading}
      className={`bg-green-500 dark:bg-green-600 py-4 rounded-xl items-center shadow-lg shadow-green-200 mt-5 w-full ${
        isLoading ? 'opacity-50' : ''
      } ${className}`}
    >
      {isLoading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text className="text-white text-lg font-bold">
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
