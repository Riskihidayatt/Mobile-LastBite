import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';

const ResponseModal = ({ visible, message, onClose, type }) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}> 
      <LinearGradient
        colors={['rgba(30,50,30,0)', 'rgba(30,50,30,0.5)', 'rgba(30,50,30,0.8)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="flex-1 h-screen justify-center items-center"
      >
        <View
          className={`w-11/12 max-w-sm p-6 rounded-lg border shadow-xl ${
            type === 'success'
              ? 'border-green-600 bg-green-100'
              : 'border-red-600 bg-red-100'
          }`}
        >
          <Text className="text-3xl text-center mb-2">
            {type === 'success' ? '✅' : '❌'}
          </Text>
          <Text
            className={`text-center text-base mb-5 ${
              type === 'success' ? 'text-green-700' : 'text-red-700'
            }`}
          >
            {message}
          </Text>
          <TouchableOpacity
            onPress={onClose}
            className={`px-4 py-2 rounded-full shadow-md ${
              type === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            <Text className="text-white font-semibold text-center">Tutup</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Modal>
  );
};

export default ResponseModal;
