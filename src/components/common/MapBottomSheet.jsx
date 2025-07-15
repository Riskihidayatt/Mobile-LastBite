import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const MapBottomSheet = ({ isVisible, onClose, item }) => {
  if (!item || typeof item.latitude === 'undefined' || typeof item.longitude === 'undefined') {
    return null; // Jangan render jika data lokasi tidak ada
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        <TouchableOpacity className="flex-1" activeOpacity={1} onPress={onClose}>
          <LinearGradient
            colors={['rgba(30,50,30,0)', 'rgba(30,50,30,0.5)', 'rgba(30,50,30,0.8)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            className="flex-1 h-screen"
          />
        </TouchableOpacity>
        <View className="bg-white dark:bg-gray-800 h-2/4 rounded-t-3xl overflow-hidden">
          <View className="p-4 border-b border-gray-200 dark:border-gray-700 flex-row justify-center items-center">
            <Text className="text-lg font-bold text-gray-800 dark:text-blue-500">Lokasi Toko</Text>
          </View>  
          <View style={{ flex: 1 }} className="flex-1 m-4 rounded-md border border-gray-300 overflow-hidden">
            <MapView 
              style={{ flex: 1 }}
              initialRegion={{
                latitude: item.latitude,
                longitude: item.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{
                  latitude: item.latitude,
                  longitude: item.longitude,
                }}
                title={item.storeName || 'Lokasi'}
              />
            </MapView>
          </View>
          <View className="pb-4 px-4 border-b mb-8 border-gray-200 dark:border-gray-700"><Text>{item.address}vhg</Text></View>
        </View>
      </View>
    </Modal>
  );
};

export default MapBottomSheet;
