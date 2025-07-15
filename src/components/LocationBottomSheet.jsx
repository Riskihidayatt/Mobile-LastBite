import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import Modal from 'react-native-modal';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserMe } from '../redux/slice/userSlice';
import { LinearGradient } from 'expo-linear-gradient';

const LocationBottomSheet = ({ isVisible, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const initialLatitude = user?.latitude || -6.175392; // Default to Jakarta
  const initialLongitude = user?.longitude || 106.816666; // Default to Jakarta

  const [latitude, setLatitude] = useState(initialLatitude);
  const [longitude, setLongitude] = useState(initialLongitude);
  const [isLocating, setIsLocating] = useState(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: initialLatitude,
    longitude: initialLongitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  useEffect(() => {
    // Update map region if user's location changes from Redux
    if (user?.latitude !== latitude || user?.longitude !== longitude) {
      setLatitude(user?.latitude || initialLatitude);
      setLongitude(user?.longitude || initialLongitude);
      setMapRegion({
        latitude: user?.latitude || initialLatitude,
        longitude: user?.longitude || initialLongitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [user]);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      return true;
    } else {
      Alert.alert('Izin Lokasi Ditolak', 'Aplikasi ini membutuhkan izin lokasi untuk dapat bekerja dengan baik.');
      return false;
    }
  };

  const getCurrentLocation = async () => {
    setIsLocating(true);
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      setIsLocating(false);
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } catch (error) {
      Alert.alert('Gagal Mendapatkan Lokasi', 'Tidak bisa mendapatkan lokasi saat ini. Pastikan GPS anda aktif.');
    } finally {
      setIsLocating(false);
    }
  };

  const handleMapPress = (e) => {
    const { latitude: newLatitude, longitude: newLongitude } =
      e.nativeEvent.coordinate;
    setLatitude(newLatitude);
    setLongitude(newLongitude);
  };

  const handleSave = async () => {
    if (latitude && longitude) {
      await dispatch(updateUserMe({ latitude, longitude }));
      onClose();
    }
  };

  return (
    <Modal
  isVisible={isVisible}
  onBackdropPress={onClose}
  backdropOpacity={1}
  backdropColor="transparent"
  animationIn="slideInUp"
  animationOut="slideOutDown"
  style={{ justifyContent: 'flex-end', margin: 0 }}
>
  <TouchableOpacity className="flex-1" activeOpacity={1} onPress={onClose}>
            <LinearGradient
              colors={['rgba(30,50,30,0)', 'rgba(30,50,30,0.5)', 'rgba(30,50,30,0.8)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              className="flex-1 h-screen"
            />
          </TouchableOpacity>
      <View className="bg-white dark:bg-gray-800 p-6 rounded-2xl">
        <Text className="text-lg font-bold text-center text-gray-800 dark:text-white mb-4">Tentukan Lokasi</Text>
        <View className="border border-gray-200 dark:border-gray-600 rounded-xl h-64 overflow-hidden relative">
          <MapView 
            style={{ height: '100%', flex: 1 }} 
            region={mapRegion} 
            onRegionChangeComplete={setMapRegion} 
            onPress={handleMapPress}
          >
            {latitude && longitude && <Marker coordinate={{ latitude, longitude }} />}
          </MapView>
          <TouchableOpacity
            onPress={getCurrentLocation}
            disabled={isLocating}
            className="bg-orange-500/70 dark:bg-orange-600 border border-green-500 py-1 px-2 rounded-xl items-center mt-4 absolute bottom-4 right-4 left-4"
          >
            {isLocating ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white text-base font-bold">
                Gunakan Lokasi Saat Ini
              </Text>
            )}
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={handleSave}
          disabled={!latitude || !longitude}
          className="bg-green-500 py-3.5 rounded-xl items-center mt-6"
        >
          <Text className="text-white text-lg font-bold">Simpan Perubahan</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default LocationBottomSheet;
