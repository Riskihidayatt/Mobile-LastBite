import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const EditUser = ({
  isDarkMode,
  username,
  setUsername,
  validateField,
  errors,
  fullName,
  setFullName,
  email,
  setEmail,
  phoneNumber,
  setPhoneNumber,
  dateOfBirth,
  setDateOfBirth,
  latitude,
  longitude,
  handleMapPress,
  handleSaveChanges,
}) => {
  return (
    <View
      className={`rounded-2xl w-full shadow-md mx-5 my-10 p-5 ${
        isDarkMode ? 'bg-green-900 shadow-white' : 'bg-green-50 shadow-green-900'
      }`}
    >
      <Text
        className={`text-lg font-bold mb-6 mt-4 text-center ${
          isDarkMode ? 'text-green-50' : 'text-green-900'
        }`}
      >
        Informasi Pribadi
      </Text>

      <View className="w-full">
        {/* Username */}
        <Text
          className={`text-sm font-semibold mb-2 ${
            isDarkMode ? 'text-green-200' : 'text-green-700'
          }`}
        >
          Name Pengguna
        </Text>
        <TextInput
          className="bg-white dark:bg-gray-800 rounded-xl p-3 mb-4 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700"
          value={username}
          onChangeText={(text) => {
            setUsername(text);
            validateField('username', text);
          }}
          placeholder="johndoe"
          placeholderTextColor={isDarkMode ? '#A0A0A0' : '#808080'}
          editable={false}
          style={{ opacity: 0.6 }}
        />
        {errors.username && (
          <Text className="text-red-500 text-sm mt-1 mb-2">
            {errors.username}
          </Text>
        )}

        {/* Nama Lengkap */}
        <Text
          className={`text-sm font-semibold mb-2 ${
            isDarkMode ? 'text-green-200' : 'text-green-700'
          }`}
        >
          Nama Lengkap
        </Text>
        <TextInput
          className="bg-white dark:bg-gray-800 rounded-xl p-3 mb-4 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700"
          value={fullName}
          onChangeText={setFullName}
          placeholder="John Doe"
          placeholderTextColor={isDarkMode ? '#A0A0A0' : '#808080'}
        />

        {/* Email */}
        <Text
          className={`text-sm font-semibold mb-2 ${
            isDarkMode ? 'text-green-200' : 'text-green-700'
          }`}
        >
          Email
        </Text>
        <TextInput
          className="bg-white dark:bg-gray-800 rounded-xl p-3 mb-4 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            validateField('email', text);
          }}
          placeholder="john.doe@example.com"
          placeholderTextColor={isDarkMode ? '#A0A0A0' : '#808080'}
          keyboardType="email-address"
        />
        {errors.email && (
          <Text className="text-red-500 text-sm mt-1 mb-2">
            {errors.email}
          </Text>
        )}

        {/* Nomor Telepon */}
        <Text
          className={`text-sm font-semibold mb-2 ${
            isDarkMode ? 'text-green-200' : 'text-green-700'
          }`}
        >
          Nomor Telepon
        </Text>
        <TextInput
          className="bg-white dark:bg-gray-800 rounded-xl p-3 mb-4 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700"
          value={phoneNumber}
          onChangeText={(text) => {
            setPhoneNumber(text);
            validateField('phoneNumber', text);
          }}
          placeholder="+62 812 3456 7890"
          placeholderTextColor={isDarkMode ? '#A0A0A0' : '#808080'}
          keyboardType="phone-pad"
        />
        {errors.phoneNumber && (
          <Text className="text-red-500 text-sm mt-1 mb-2">
            {errors.phoneNumber}
          </Text>
        )}

        {/* Tanggal Lahir */}
        <Text
          className={`text-sm font-semibold mb-2 ${
            isDarkMode ? 'text-green-200' : 'text-green-700'
          }`}
        >
          Tanggal Lahir
        </Text>
        <TextInput
          className="bg-white dark:bg-gray-800 rounded-xl p-3 mb-4 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700"
          value={dateOfBirth}
          onChangeText={setDateOfBirth}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={isDarkMode ? '#A0A0A0' : '#808080'}
          editable={false}
          style={{ opacity: 0.6 }}
        />
      </View>
      <Text
        className={`text-sm font-semibold mb-2 ${
          isDarkMode ? 'text-green-200' : 'text-green-700'
        }`}
      >
        Pin lokasi
      </Text>
      <View className="border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden mb-4">
        <MapView
          style={{ height: 240, width: '100%' }}
          initialRegion={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onPress={handleMapPress}
        >
          <Marker coordinate={{ latitude: latitude, longitude: longitude }} />
        </MapView>
      </View>

      {/* Tombol Simpan Perubahan */}
      <TouchableOpacity
        onPress={handleSaveChanges}
        className="bg-green-500 dark:bg-green-600 py-4 rounded-xl items-center shadow-lg shadow-green-200 mt-5 w-full"
      >
        <Text className="text-white text-lg font-bold">Simpan Perubahan</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditUser;
