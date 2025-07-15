import React, { useState, useContext, useCallback } from "react";
import * as yup from "yup";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Feather, Entypo } from "@expo/vector-icons";
import { ThemeContext } from "../../context/ThemeContext";
import useAuth from "../../hooks/useAuth";
import { useFocusEffect } from "@react-navigation/native";
import ResponseModal from "../../components/common/ResponseModal";
import Screen from "../Screen";

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === "dark";
  const { login, loading } = useAuth();

  const loginSchema = yup.object().shape({
    username: yup.string().required("Username wajib diisi."),
    password: yup.string().min(8, "Password minimal 8 karakter.").required("Password wajib diisi."),
  });

  useFocusEffect(
    useCallback(() => {
      setPassword("");
      setUsername("");
    }, [setPassword, setUsername])
  );

  const validateField = async (fieldName, value) => {
    try {
      await yup.reach(loginSchema, fieldName).validate(value);
      setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: undefined }));
    } catch (validationError) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: validationError.message,
      }));
    }
  };

  const handleLogin = async () => {
    try {
      await loginSchema.validate({ username, password }, { abortEarly: false });
      setErrors({});

      const result = await login({ username, password });

      if (!result.success) {
        if(!result.error) {
          setModalMessage("Gagal masuk !!!");
        } else if (result.error.includes("Bad credentials")) {
          setModalMessage( "Username atau password yang Anda masukkan salah.");
        } else if (result.error.includes("Suspended")) {
          setModalMessage("Akun Anda telah diblokir.");
        } else {
          setModalMessage(result.error);
        }
        setModalVisible(true);
      }
    } catch (validationErrors) {
      const newErrors = {};
      validationErrors.inner.forEach((error) => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
    }
  };

  const inputBgColor = isDarkMode ? "bg-gray-700" : "bg-white";
  const iconColor = isDarkMode ? "#D1D5DB" : "#6B7280";
  const isButtonDisabled = loading || !username || !password || !!errors.username || !!errors.password;

  return (
      <Screen>
         <ResponseModal
            visible={modalVisible}
            message={modalMessage}
            onClose={() => setModalVisible(false)}
            type={"failed"}
          />
        <View className="max-w-full my-30 mx-6 h-screen justify-center">
          <View
            className={`w-full max-w-md mx-auto rounded-xl p-8 shadow-lg ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <Image
              source={require("../../assets/logo fix.png")}
              className="w-28 h-28 self-center mb-5"
              resizeMode="contain"
            />

            {/* username */}
            <Text className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Username
            </Text>
            <View
              className={`flex-row items-center ${inputBgColor} rounded-xl mb-4 px-4 border border-gray-200 dark:border-gray-600`}
            >
                <Feather name="user" size={20} color={iconColor} />
              <TextInput
                className="flex-1 h-12 text-base text-gray-800 dark:text-white ml-3"
                placeholder="yourusername@example.com"
                placeholderTextColor={iconColor}
                keyboardType="username-address"
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

            {/* Password */}
            <Text className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Password
            </Text>
            <View
              className={`flex-row items-center ${inputBgColor} rounded-xl mb-8 px-4 border border-gray-200 dark:border-gray-600`}
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
                  validateField("password", text);
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

            {/* Tombol Login */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={isButtonDisabled}
              className={`py-3.5 rounded-xl items-center shadow-lg flex-row justify-center ${
                isButtonDisabled
                  ? "bg-gray-400 dark:bg-gray-600"
                  : "bg-green-500 dark:bg-green-600 active:bg-green-600"
              }`}
            >
              {loading && (
                <ActivityIndicator size="small" color="#FFFFFF" className="mr-2" />
              )}
              <Text className="text-white text-xl font-bold">Masuk</Text>
            </TouchableOpacity>

            {/* Link ke Register */}
            <View className="flex-row justify-center my-10">
              <Text className="text-xl text-gray-600 dark:text-gray-300">
                Belum punya akun?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("RegisterTab")}>
                <Text className="text-xl font-bold text-green-500">Daftar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Screen>
  );
}