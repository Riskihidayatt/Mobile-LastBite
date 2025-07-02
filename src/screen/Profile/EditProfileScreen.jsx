import React, { useState, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, SafeAreaView, ScrollView, Alert, ActionSheetIOS, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { ThemeContext } from '../../context/ThemeContext';
import * as ImagePicker from 'expo-image-picker';

const EditProfileScreen = () => {
    const navigation = useNavigation();
    const { theme } = useContext(ThemeContext);
    const isDarkMode = theme === 'dark';

    // Placeholder state for user data
    const [fullName, setFullName] = useState('John Doe');
    const [username, setUsername] = useState('johndoe');
    const [email, setEmail] = useState('john.doe@example.com');
    const [phoneNumber, setPhoneNumber] = useState('+62 812 3456 7890');
    const [dateOfBirth, setDateOfBirth] = useState('1990-01-01');
    const [gender, setGender] = useState('-'); // Placeholder for gender
    const [profileImage, setProfileImage] = useState(null); // State untuk gambar profil

    const pickImage = async () => {
        // Meminta izin akses galeri
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Izin Diperlukan', 'Aplikasi memerlukan izin untuk mengakses galeri foto Anda.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        // Meminta izin akses kamera
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Izin Diperlukan', 'Aplikasi memerlukan izin untuk mengakses kamera Anda.');
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    const showImagePickerOptions = () => {
        if (Platform.OS === 'ios') {
            ActionSheetIOS.showActionSheetWithOptions(
                {
                    options: ['Batal', 'Pilih dari Galeri', 'Ambil Foto'],
                    cancelButtonIndex: 0,
                },
                (buttonIndex) => {
                    if (buttonIndex === 1) {
                        pickImage();
                    } else if (buttonIndex === 2) {
                        takePhoto();
                    }
                }
            );
        } else {
            Alert.alert(
                'Ubah Foto Profil',
                'Pilih sumber gambar:',
                [
                    { text: 'Batal', style: 'cancel' },
                    { text: 'Galeri', onPress: pickImage },
                    { text: 'Kamera', onPress: takePhoto },
                ],
                { cancelable: true }
            );
        }
    };

    const handleSaveChanges = () => {
        // Implementasi logika untuk menyimpan perubahan
        Alert.alert('Perubahan Disimpan', 'Profil Anda telah berhasil diperbarui.');
        // Anda bisa menambahkan logika untuk mengirim data ke backend di sini
        console.log({
            fullName,
            username,
            email,
            phoneNumber,
            dateOfBirth,
            gender,
            profileImage,
        });
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-100 dark:bg-gray-900">
            {/* Header */}
            <View className="flex-row items-center justify-center px-4 py-3 bg-white dark:bg-gray-800 shadow-sm">
                <TouchableOpacity onPress={() => navigation.goBack()} className="absolute left-4">
                    <Ionicons name="arrow-back" size={24} color={isDarkMode ? 'white' : 'black'} />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-800 dark:text-white">Profile Detail</Text>
            </View>

            <ScrollView className="flex-1 p-4">
                {/* Profile Picture Section */}
                <View className="items-center mb-6">
                    <TouchableOpacity onPress={showImagePickerOptions} className="w-32 h-32 rounded-full bg-gray-300 dark:bg-gray-700 items-center justify-center relative border-4 border-blue-400">
                        {profileImage ? (
                            <Image source={{ uri: profileImage }} className="w-full h-full rounded-full" />
                        ) : (
                            <Ionicons name="person" size={80} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
                        )}
                        <View className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2">
                            <Feather name="camera" size={20} color="white" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={showImagePickerOptions} className="mt-2">
                        <Text className="text-blue-500 font-semibold">Ubah Foto Profile</Text>
                    </TouchableOpacity>
                </View>

                {/* Informasi Pribadi Section */}
                <Text className="text-lg font-bold text-gray-800 dark:text-white mb-4">Informasi Pribadi</Text>

                {/* Nama Lengkap */}
                <Text className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Nama Lengkap</Text>
                <TextInput
                    className="bg-white dark:bg-gray-800 rounded-xl p-3 mb-4 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700"
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="John Doe"
                    placeholderTextColor={isDarkMode ? '#A0A0A0' : '#808080'}
                />

                {/* Username */}
                <Text className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Username</Text>
                <TextInput
                    className="bg-white dark:bg-gray-800 rounded-xl p-3 mb-4 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700"
                    value={username}
                    onChangeText={setUsername}
                    placeholder="johndoe"
                    placeholderTextColor={isDarkMode ? '#A0A0A0' : '#808080'}
                />

                {/* Email */}
                <Text className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Email</Text>
                <TextInput
                    className="bg-white dark:bg-gray-800 rounded-xl p-3 mb-4 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700"
                    value={email}
                    onChangeText={setEmail}
                    placeholder="john.doe@example.com"
                    placeholderTextColor={isDarkMode ? '#A0A0A0' : '#808080'}
                    keyboardType="email-address"
                />

                {/* Nomor Telepon */}
                <Text className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Nomor Telepon</Text>
                <TextInput
                    className="bg-white dark:bg-gray-800 rounded-xl p-3 mb-4 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    placeholder="+62 812 3456 7890"
                    placeholderTextColor={isDarkMode ? '#A0A0A0' : '#808080'}
                    keyboardType="phone-pad"
                />

                {/* Tanggal Lahir */}
                <Text className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Tanggal Lahir</Text>
                <TextInput
                    className="bg-white dark:bg-gray-800 rounded-xl p-3 mb-4 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700"
                    value={dateOfBirth}
                    onChangeText={setDateOfBirth}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={isDarkMode ? '#A0A0A0' : '#808080'}
                />

                {/* Jenis Kelamin */}
                <Text className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Jenis Kelamin</Text>
                <TextInput
                    className="bg-white dark:bg-gray-800 rounded-xl p-3 mb-6 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700"
                    value={gender}
                    onChangeText={setGender}
                    placeholder="-"
                    placeholderTextColor={isDarkMode ? '#A0A0A0' : '#808080'}
                />

                {/* Tombol Simpan Perubahan */}
                <TouchableOpacity
                    onPress={handleSaveChanges}
                    className="bg-green-500 dark:bg-green-600 py-4 rounded-xl items-center shadow-lg shadow-green-200"
                >
                    <Text className="text-white text-lg font-bold">Simpan Perubahan</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default EditProfileScreen;