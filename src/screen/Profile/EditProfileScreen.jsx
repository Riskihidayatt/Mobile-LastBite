import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActionSheetIOS,
  Platform,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { ThemeContext } from "../../context/ThemeContext";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import Screen from "../Screen";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { updateUserMe } from "../../redux/slice/userSlice";
import MapView, { Marker } from "react-native-maps";
import ResponseModal from "../../components/common/ResponseModal";
import ModalConfirm from "../../components/common/ModalConfirm";
import Button from "../../components/common/Button";
import useUpload from "../../hooks/useUpload";

const EditProfileScreen = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { 
    fileUrl : profileImage, 
    showImagePickerOptions, 
    uploadImage, 
    deleteImage, 
    uploading , 
  } = useUpload();
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === "dark";

  const [fullName, setFullName] = useState(user.fullName);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
  const [longitude, setLongitude] = useState(user.longitude || 106.816666);
  const [latitude, setLatitude] = useState(user.latitude || -6.175392);
  const [errors, setErrors] = useState({});
  const [isLocating, setIsLocating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: user.latitude || -6.175392,
    longitude: user.longitude || 106.816666,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const handleMapPress = (e) => {
    const { latitude: newLatitude, longitude: newLongitude } =
      e.nativeEvent.coordinate;
    setLatitude(newLatitude);
    setLongitude(newLongitude);
  };

  useEffect(() => {
    setMapRegion({
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  }, []);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      return true;
    } else {
      Alert.alert(
        "Izin Lokasi Ditolak",
        "Aplikasi ini membutuhkan izin lokasi untuk dapat bekerja dengan baik."
      );
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
    } catch (error) {
      Alert.alert(
        "Gagal Mendapatkan Lokasi",
        "Tidak bisa mendapatkan lokasi saat ini. Pastikan GPS anda aktif."
      );
    } finally {
      setIsLocating(false);
    }
  };


  const validationSchema = yup.object().shape({
    username: yup
      .string()
      .required("Username wajib diisi")
      .min(3, "Username minimal 3 karakter"),
    email: yup
      .string()
      .email("Format email tidak valid")
      .required("Email wajib diisi"),
    phoneNumber: yup
      .string()
      .matches(/^[0-9]+$/, "Nomor telepon hanya boleh berisi angka")
      .min(10, "Nomor telepon minimal 10 angka")
      .max(15, "Nomor telepon maksimal 15 angka")
      .required("Nomor telepon wajib diisi"),
  });

  const validateField = async (fieldName, value) => {
    try {
      await yup.reach(validationSchema, fieldName).validate(value);
      setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: undefined }));
    } catch (validationError) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: validationError.message,
      }));
    }
  };

  const handleSaveChanges = () => {
    Keyboard.dismiss();
    setShowConfirmModal(true);
  };

  const confirmSaveChanges = async () => {
    setShowConfirmModal(false);
    try {
      setIsLoading(true);
      await validationSchema.validate(
        { username, email, phoneNumber },
        { abortEarly: false }
      );
      setErrors({});

      const userData = {
        fullName,
        phoneNumber,
        email,
        latitude,
        longitude,
      };

      if (profileImage) {
        userData.profileImageUrl = await uploadImage(profileImage);
      }

      const resultAction = await dispatch(updateUserMe(userData));
      if (updateUserMe.fulfilled.match(resultAction)) {
        setModalMessage("Profil berhasil diperbarui!");
        setModalType("success");
        setShowModal(true);
      } else {
        const error = resultAction.payload || resultAction.error.message;
        setModalMessage(`Gagal memperbarui profil: ${error}`);
        setModalType("error");
        setShowModal(true);
      }
    } catch (validationErrors) {
      const newErrors = {};
      validationErrors.inner.forEach((error) => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
      setModalMessage("Terdapat kesalahan validasi. Mohon periksa kembali input Anda.");
      setModalType("error");
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setHasChanges(
      fullName !== user.fullName ||
      email !== user.email ||
      phoneNumber !== user.phoneNumber ||
      latitude !== user.latitude ||
      longitude !== user.longitude ||
      profileImage !== null 
    );
  }, [fullName, email, phoneNumber, latitude, longitude, profileImage, user]);

  return (
    <>
    <Screen>
      <View className="flex-1 my-10">
        <View className="flex-1 items-center px-5">
          <View className="items-stretch">
            <TouchableOpacity
              onPress={showImagePickerOptions}
              className="w-32 h-32 rounded-full bg-gray-300 dark:bg-gray-700 items-center justify-center relative border-2 border-green-500"

            >
              {profileImage ? (
                <Image
                  className="w-full h-full rounded-full border-2 border-white"
                  source={{ uri: profileImage }}
                />
              ) : user?.profileImageUrl ? (
                <Image
                  className="w-full h-full rounded-full border-2 border-white"
                  source={{ uri: user.profileImageUrl }}
                />
              ) : (
                <Ionicons
                  name="person"
                  size={80}
                  color={isDarkMode ? "green" : "darkgreen"}
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
                  isDarkMode ? "text-green-300" : "text-green-500"
                }`}
              >
                Ubah Foto Profile
              </Text>
            </TouchableOpacity>
          </View>

          <View
            className={`rounded-2xl w-full shadow-md mx-5 my-10 p-5 ${
              isDarkMode
                ? "bg-black shadow-white"
                : "bg-white shadow-green-900"
            }`}
          >
            <Text
              className={`text-lg font-bold mb-6 mt-4 text-center ${
                isDarkMode ? "text-green-50" : "text-green-900"
              }`}
            >
              Informasi Pribadi
            </Text>

            <View className="w-full">
              <View className="flex-row items-center mb-2">
                <Text
                  className={`text-sm font-semibold ${
                    isDarkMode ? "text-green-200" : "text-green-700"
                  }`}
                >
                  Name Pengguna
                </Text>
                <Text className="text-red-500 ml-1">*</Text>
              </View>
              <TextInput
                className="bg-white dark:bg-gray-800 rounded-xl p-3 mb-4 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700"
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  validateField("username", text);
                }}
                placeholder="johndoe"
                placeholderTextColor={isDarkMode ? "#A0A0A0" : "#808080"}
                editable={false}
                style={{ opacity: 0.6 }}
              />
              {errors.username && (
                <Text className="text-red-500 text-sm mt-1 mb-2">
                  {errors.username}
                </Text>
              )}
              <View className="flex-row items-center mb-2">
                <Text
                  className={`text-sm font-semibold mb-2 ${
                    isDarkMode ? "text-green-200" : "text-green-700"
                  }`}
                >
                  Nama Lengkap 
                </Text>
                <Text className="text-red-500 ml-1">*</Text>
              </View>
              <TextInput
                className="bg-white dark:bg-gray-800 rounded-xl p-3 mb-4 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700"
                value={fullName}
                onChangeText={setFullName}
                placeholder="John Doe"
                placeholderTextColor={isDarkMode ? "#A0A0A0" : "#808080"}
              />

              <View className="flex-row items-center mb-2">
                <Text
                  className={`text-sm font-semibold ${
                    isDarkMode ? "text-green-200" : "text-green-700"
                  }`}
                >
                  Email
                </Text>
                <Text className="text-red-500 ml-1">*</Text>
              </View>
              <TextInput
                className="bg-white dark:bg-gray-800 rounded-xl p-3 mb-4 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  validateField("email", text);
                }}
                placeholder="john.doe@example.com"
                placeholderTextColor={isDarkMode ? "#A0A0A0" : "#808080"}
                keyboardType="email-address"
              />
              {errors.email && (
                <Text className="text-red-500 text-sm mt-1 mb-2">
                  {errors.email}
                </Text>
              )}

              <View className="flex-row items-center mb-2">
                <Text
                  className={`text-sm font-semibold ${
                    isDarkMode ? "text-green-200" : "text-green-700"
                  }`}
                >
                  Nomor Telepon
                </Text>
                <Text className="text-red-500 ml-1">*</Text>
              </View>
              <TextInput
                className="bg-white dark:bg-gray-800 rounded-xl p-3 mb-4 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700"
                value={phoneNumber}
                onChangeText={(text) => {
                  setPhoneNumber(text);
                  validateField("phoneNumber", text);
                }}
                placeholder="+62 812 3456 7890"
                placeholderTextColor={isDarkMode ? "#A0A0A0" : "#808080"}
                keyboardType="phone-pad"
              />
              {errors.phoneNumber && (
                <Text className="text-red-500 text-sm mt-1 mb-2">
                  {errors.phoneNumber}
                </Text>
              )}
            </View>
            <View>
              <View className="flex-row items-center mb-2">
                <Text
                  className={`text-sm font-semibold ${
                    isDarkMode ? "text-green-200" : "text-green-700"
                  }`}
                >
                  Lokasi
                </Text>
                <Text className="text-red-500 ml-1">*</Text>
              </View>
            </View>
            <View className="border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden mb-4 relative">
              <MapView
                style={{ height: 240, width: "100%" }}
                region={mapRegion}
                onPress={handleMapPress}
              >
                <Marker
                  coordinate={{ latitude: latitude, longitude: longitude }}
                />
              </MapView>
              <TouchableOpacity
                onPress={getCurrentLocation}
                disabled={isLocating}
                className="bg-orange-500/70 dark:bg-orange-600 border border-green-500 py-1 px-2 rounded-xl items-center m-2 left-0 right-0 bottom-0 absolute z-10"
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
              onPress={handleSaveChanges}
              disabled={isLoading || !hasChanges}
              className={`${ !hasChanges ? "bg-gray-500" : "bg-green-500 active:bg-green-600"} py-3.5 rounded-xl items-center mt-6 `}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-white text-lg font-bold">
                  Simpan Perubahan
                </Text>
              )}
              </TouchableOpacity>
          </View>
        </View>
      </View>
    </Screen>
      <ResponseModal
        visible={showModal}
        message={modalMessage}
        type={modalType}
        onClose={() => setShowModal(false)}
      />
      <ModalConfirm
        visible={showConfirmModal}
        message="Apakah Anda yakin ingin menyimpan perubahan?"
        onYes={confirmSaveChanges}
        onNo={() => setShowConfirmModal(false)}
      />
    </>
  );
};

export default EditProfileScreen;