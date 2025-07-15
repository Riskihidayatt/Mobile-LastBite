import React, { useState, useContext, useEffect, useMemo, useCallback, useRef } from "react";
import * as yup from "yup";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Keyboard,
} from "react-native";
import * as Location from "expo-location";
import { useFocusEffect } from "@react-navigation/native";

import MapView, { Marker } from "react-native-maps";
import { Feather, Entypo } from "@expo/vector-icons";
import { ThemeContext } from "../../context/ThemeContext";

import ResponseModal from "../../components/common/ResponseModal";
import ModalConfirm from "../../components/common/ModalConfirm";
import useAuth from "../../hooks/useAuth";
import Screen from "../Screen";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [longitude, setLongitude] = useState(106.816666);
  const [latitude, setLatitude] = useState(-6.175392);
  const [errors, setErrors] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [type, setType] = useState("success");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    if (type === "success") {
      navigation.replace("Auth", { screen: "LoginTab" });
    }
  }, [type, navigation]);
  const { register } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === "dark";
  const [isLocating, setIsLocating] = useState(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: -6.175392,
    longitude: 106.816666,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const scrollViewRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );

  useEffect(() => {
    getCurrentLocation();
  }, []);

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
      Alert.alert("Izin Lokasi Ditolak", "Aplikasi ini membutuhkan izin lokasi untuk dapat bekerja dengan baik.");
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
        latitudeDelta: 0.050,
        longitudeDelta: 0.050,
      });
    } catch (error) {
      Alert.alert("Gagal Mendapatkan Lokasi", "Tidak bisa mendapatkan lokasi saat ini. Pastikan GPS anda aktif.");
    } finally {
      setIsLocating(false);
    }
  };

  const registerSchema = yup.object().shape({
    email: yup
      .string()
      .email("Email tidak valid.")
      .required("Email wajib diisi."),
    username: yup
      .string()
      .min(3, "Nama pengguna minimal 3 karakter.")
      .required("Nama pengguna wajib diisi."),
    phoneNumber: yup
      .string()
      .matches(/^[0-9]+$/, "Nomor telepon hanya boleh angka.")
      .min(10, "Nomor telepon minimal 10 angka.")
      .required("Nomor telepon wajib diisi."),
    fullName: yup
      .string()
      .min(3, "Nama lengkap minimal 3 karakter.")
      .required("Nama lengkap wajib diisi."),
    password: yup
      .string()
      .min(8, "Password minimal 8 karakter.")
      .required("Password wajib diisi."),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Konfirmasi password tidak cocok.")
      .required("Konfirmasi password wajib diisi."),
    longitude: yup
      .number()
      .required("Longitude wajib diisi."),
    latitude: yup
      .number()
      .required("Latitude wajib diisi."),
  });

  const validateField = async (fieldName, value) => {
    try {
      await yup.reach(registerSchema, fieldName).validate(value);
      setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: undefined }));
    } catch (validationError) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: validationError.message,
      }));
    }
  };

  const validatePassword = async (passwordValue) => {
    try {
      await yup.reach(registerSchema, 'password').validate(passwordValue);
      setErrors((prevErrors) => ({ ...prevErrors, password: undefined }));
    } catch (validationError) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: validationError.message,
      }));
    }
  };

  const validateConfirmPassword = async (passwordValue, confirmPasswordValue) => {
    try {
      await yup.object().shape({
        password: yup.string().required(), // Dummy schema for password to allow ref
        confirmPassword: registerSchema.fields.confirmPassword,
      }).validate({ password: passwordValue, confirmPassword: confirmPasswordValue }, { abortEarly: false });
      setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: undefined }));
    } catch (validationErrors) {
      const newErrors = {};
      validationErrors.inner.forEach((error) => {
        newErrors[error.path] = error.message;
      });
      setErrors((prevErrors) => ({ ...prevErrors, ...newErrors }));
    }
  };

  const handleRegister = () => {
    Keyboard.dismiss();
    setShowConfirmModal(true);
  };

  const confirmRegister = async () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);
    try {

      await registerSchema.validate(
        { email, username, phoneNumber, fullName, password, confirmPassword, longitude, latitude },
        { abortEarly: false }
      );
      setErrors({});

      const result = await register({
        email,
        username,
        phoneNumber,
        fullName,
        password,
        longitude,
        latitude
      });
      if (result.success) {
        setModalMessage("Pendaftaran berhasil! Anda akan diarahkan ke halaman login setelah menutup pesan ini.");
        setModalVisible(true);
        setType("success");
      } else {
        setModalMessage(result.error || "Terjadi kesalahan saat pendaftaran.");
        setModalVisible(true);
        setType("failed");
      }
    } catch (validationErrors) {
      const newErrors = {};
      validationErrors.inner.forEach((error) => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
    } finally {
      setIsSubmitting(false);
    }
  };
    const handleMapPress = (e) => {
    const { latitude: newLatitude, longitude: newLongitude } =
      e.nativeEvent.coordinate;
    setLatitude(newLatitude);
    setLongitude(newLongitude);
  };

  const isActiveRegisterButton = useMemo(() => {
    return (
      !isSubmitting &&
      !errors.email &&
      !errors.username &&
      !errors.phoneNumber &&
      !errors.fullName &&
      !errors.password &&
      !errors.confirmPassword &&
      !errors.longitude &&
      !errors.latitude &&
      email &&
      username &&
      phoneNumber &&
      fullName &&
      password &&
      confirmPassword &&
      longitude &&
      latitude
    );
  }, [
    isSubmitting,
    errors,
    email,
    username,
    phoneNumber,
    fullName,
    password,
    confirmPassword,
    longitude,
    latitude,
  ]);

  const inputBgColor = isDarkMode ? "bg-gray-700" : "bg-white";
  const iconColor = isDarkMode ? "#D1D5DB" : "#6B7280";


  return (
      <Screen scrollViewRef={scrollViewRef}>
        <ResponseModal
          visible={modalVisible}
          message={modalMessage}
          onClose={handleCloseModal}
          type={type}
        />
        <ModalConfirm
          visible={showConfirmModal}
          message="Apakah Anda yakin dengan data yang diisi?"
          onYes={confirmRegister}
          onNo={() => setShowConfirmModal(false)}
        />
        <View className="flex-row px-6 pt-20 pb-20">
        <View
          className={`w-full max-w-md mx-auto rounded-xl p-8 shadow-lg ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
        <View className="w-full max-w-sm ">

          <Text className="text-2xl font-bold text-center  text-green-950 dark:text-gray-200 mb-10">
            Form Pendaftaran
          </Text>
        {/* Username */}
        <Text className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-2">
          Nama Pengguna
        </Text>
        <View
          className={`flex-row items-center ${inputBgColor} rounded-xl mb-4 px-4 border border-gray-200 dark:border-gray-600`}
        >
          <Feather name="user" size={20} color={iconColor} />
          <TextInput
            className="flex-1 h-12 text-base text-gray-800 dark:text-white ml-3"
            placeholder="Nama Pengguna Anda"
            placeholderTextColor={iconColor}
            autoCapitalize="none"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              validateField("username", text);
            }}
          />
        </View>
        {errors.username && (
          <Text className="text-red-500 text-sm mt-1 mb-2">
            {errors.username}
          </Text>
        )}

        {/* Full Name */}
        <Text className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-2">
          Nama Lengkap
        </Text>
        <View
          className={`flex-row items-center ${inputBgColor} rounded-xl mb-4 px-4 border border-gray-200 dark:border-gray-600`}
        >
          <Feather name="user" size={20} color={iconColor} />
          <TextInput
            className="flex-1 h-12 text-base text-gray-800 dark:text-white ml-3"
            placeholder="Nama Lengkap Anda"
            placeholderTextColor={iconColor}
            value={fullName}
            onChangeText={(text) => {
              setFullName(text);
              validateField("fullName", text);
            }}
          />
        </View>
        {errors.fullName && (
          <Text className="text-red-500 text-sm mt-1 mb-2">
            {errors.fullName}
          </Text>
        )}

        {/* Email */}
        <Text className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-2">
          Email
        </Text>
        <View
          className={`flex-row items-center ${inputBgColor} rounded-xl mb-4 px-4 border border-gray-200 dark:border-gray-600`}
        >
          <Feather name="mail" size={20} color={iconColor} />
          <TextInput
            className="flex-1 h-12 text-base text-gray-800 dark:text-white ml-3"
            placeholder="emailanda@contoh.com"
            placeholderTextColor={iconColor}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              validateField("email", text);
            }}
          />
        </View>
        {errors.email && (
          <Text className="text-red-500 text-sm mt-1 mb-2">{errors.email}</Text>
        )}

        {/* Phone Number */}
        <Text className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-2">
          Nomor Telepon
        </Text>
        <View
          className={`flex-row items-center ${inputBgColor} rounded-xl mb-4 px-4 border border-gray-200 dark:border-gray-600`}
        >
          <Feather name="phone" size={20} color={iconColor} />
          <TextInput
            className="flex-1 h-12 text-base text-gray-800 dark:text-white ml-3"
            placeholder="081234567890"
            placeholderTextColor={iconColor}
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={(text) => {
              setPhoneNumber(text);
              validateField("phoneNumber", text);
            }}
          />
        </View>
        {errors.phoneNumber && (
          <Text className="text-red-500 text-sm mt-1 mb-2">
            {errors.phoneNumber}
          </Text>
        )}

        {/* Password */}
        <Text className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-2">
          Kata Sandi
        </Text>
        <View
          className={`flex-row items-center ${inputBgColor} rounded-xl px-4 border border-gray-200 dark:border-gray-600`}
        >
          <Feather name="lock" size={20} color={iconColor} />
          <TextInput
            className="flex-1 h-12 text-base text-gray-800 dark:text-white ml-3"
            placeholder="••••••••"
            placeholderTextColor={iconColor}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              validatePassword(text);
              validateConfirmPassword(text, confirmPassword);
            }}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Entypo
              name={showPassword ? "eye" : "eye-with-line"}
              size={20}
              color={iconColor}
            />
          </TouchableOpacity>
        </View>
        {errors.password && (
          <Text className="text-red-500 text-sm mt-1 mb-2">
            {errors.password}
          </Text>
        )}
        

        {/* Confirm Password */}
        <Text className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-2 mt-4">
          Konfirmasi Kata Sandi
        </Text>
        <View
          className={`flex-row items-center ${inputBgColor} rounded-xl px-4 border border-gray-200 dark:border-gray-600`}
        >
          <Feather name="lock" size={20} color={iconColor} />
          <TextInput
            className="flex-1 h-12 text-base text-gray-800 dark:text-white ml-3"
            placeholder="••••••••"
            placeholderTextColor={iconColor}
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              validateConfirmPassword(password, text);
            }}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Entypo
              name={showConfirmPassword ? "eye" : "eye-with-line"}
              size={20}
              color={iconColor}
            />
          </TouchableOpacity>
        </View>
        {errors.confirmPassword && (
          <Text className="text-red-500 text-sm mt-1 mb-2">
            {errors.confirmPassword}
          </Text>
        )}
        <Text className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-2 mt-5">
          Pin lokasi
        </Text>
        <View className="border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden relative">
          <MapView
            style={{ height: 240, width: "100%" }}
            region={mapRegion}
            onPress={handleMapPress}
          >
            <Marker coordinate={{ latitude: latitude, longitude: longitude }} />
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
          onPress={handleRegister}
                    className={`py-3.5 rounded-xl items-center mt-6 ${ !isActiveRegisterButton ? "bg-gray-400 dark:bg-gray-600" : "bg-green-500 dark:bg-green-600 active:bg-green-600"}`}
          disabled={isSubmitting || !isActiveRegisterButton}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-white text-lg font-bold">Daftar</Text>
          )}
        </TouchableOpacity>

        {/* Link ke Login */}
        <View className="flex-row justify-center mt-10">
          <Text className="text-xl text-gray-600 dark:text-gray-300">
            Sudah punya akun?{" "}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("LoginTab")}>
            <Text className="text-xl font-bold text-green-500">Masuk</Text>
          </TouchableOpacity>
        </View>
      </View>
        </View>
        </View>
      </Screen>
  );
}