import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Modal, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';

const ModalConfirm = ({ visible, message, onYes, onNo, isLoading = false }) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onNo}>
      <LinearGradient
        colors={['rgba(30,50,30,0)', 'rgba(30,50,30,0.5)', 'rgba(30,50,30,0.8)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="flex-1 h-screen justify-center items-center"
      >
        <View className="w-11/12 max-w-sm p-6 rounded-lg border border-gray-300 bg-white shadow-xl">
          <Text className="text-center text-lg font-bold text-gray-800 mb-4">{message}</Text>
          {isLoading ? (
            <ActivityIndicator size="large" color="#FF6B35" />
          ) : (
            <View className="flex-row items-center gap-10 mt-4">
              <View className="flex-1 m-2">
                <TouchableOpacity
                  onPress={onNo}
                  className="px-6 py-2 rounded-full shadow-md bg-red-600"
                  disabled={isLoading}
                >
                  <Text className="text-white font-semibold text-center">Tidak</Text>
                </TouchableOpacity>
              </View>
              <View className="flex-1 m-2">
                <TouchableOpacity
                  onPress={onYes}
                  className="px-6 py-2 rounded-full shadow-md bg-green-600"
                  disabled={isLoading}
                >
                  <Text className="text-white font-semibold text-center">Ya</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </LinearGradient>
    </Modal>
  );
};

export default ModalConfirm;
