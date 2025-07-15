import React, { useContext, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Switch,
  Linking,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { ThemeContext } from "../../context/ThemeContext";
import useAuth from "../../hooks/useAuth";
import Screen from "../Screen";
import { fetchUserMe } from "../../redux/slice/userSlice";
import ModalConfirm from "../../components/common/ModalConfirm";

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { logout } = useAuth();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDarkMode = theme === "dark";
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchUserMe());
    }, [dispatch])
  );

  const handleLogout = () => {
    setShowConfirmModal(true);
  };

  const confirmLogout = () => {
    setShowConfirmModal(false);
    logout();
  };

  const handleEditProfile = () => {
    navigation.navigate("EditProfile");
  };

  const handleChangePassword = () => {
    navigation.navigate("ChangePassword");
  };

  const gotoWeb = () => {
    Linking.openURL("https://fe-web-last-bite.vercel.app");
  };

  return (
    <Screen>
      <View className="flex-1 my-10">
        <View className="items-center mt-10">
          <View className="relative w-28 h-28 rounded-full">
            <Image
              source={
                user?.profileImageUrl
                  ? { uri: user.profileImageUrl }
                  : require("../../assets/logo fix.png")
              }
              className="w-full h-full rounded-full border-2 border-green-500"
            />
          </View>
          <Text
            className={`text-2xl font-bold mt-4  ${isDarkMode ? "text-green-50" : "text-green-900"}`}
          >
            {user?.username || "Unknown User"}
          </Text>
          <Text
            className={`text-base mt-1 ${isDarkMode ? "text-green-200" : "text-green-700"}`}
          >
            {user?.email || "5oU8I@example.com"}
          </Text>
        </View>
        <View
          className={`rounded-2xl shadow-md mx-5 mt-10 p-5 ${isDarkMode ? "bg-black shadow-white" : "bg-white shadow-green-900"}`}
        >
          <TouchableOpacity
            onPress={handleEditProfile}
            className={`flex-row items-center p-3 border-b mb-4 ${isDarkMode ? "border-green-100" : "border-green-800"}`}
          >
            <Feather
              name="edit-3"
              size={22}
              color={isDarkMode ? "#ECFDF5" : "#104029"}
            />
            <Text
              className={`text-base font-semibold ml-4 dark:text-gray-200 ${isDarkMode ? "text-green-100" : "text-green-900"}`}
            >
              Ubah Profil
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleChangePassword}
            className={`flex-row items-center p-3 border-b mb-4 ${isDarkMode ? "border-green-100" : "border-green-800"}`}
          >
            <Feather
              name="lock"
              size={22}
              color={isDarkMode ? "#ECFDF5" : "#104029"}
            />
            <Text
              className={`text-base font-semibold ml-4 dark:text-gray-200 ${isDarkMode ? "text-green-100" : "text-green-900"}`}
            >
              Ubah Kata Sandi
            </Text>
          </TouchableOpacity>
          <View
            className={`flex-row justify-between items-center p-3 border-b mb-4 ${isDarkMode ? "border-green-100" : "border-green-800"}`}
          >
            <View className="flex-row items-center">
              <Feather
                name="moon"
                size={22}
                color={isDarkMode ? "#ECFDF5" : "#104029"}
              />
              <Text
                className={`text-base font-semibold ml-4 dark:text-gray-200 ${isDarkMode ? "text-green-100" : "text-green-900"}`}
              >
                Tampilan
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "#34D399" }}
              thumbColor={isDarkMode ? "#F9FAFB" : "#f4f3f4"}
              onValueChange={toggleTheme}
              value={isDarkMode}
            />
          </View>

          <TouchableOpacity
            onPress={gotoWeb}
            className={`flex-row items-center p-3 border-b mb-4 ${isDarkMode ? "border-green-100" : "border-green-800"}`}
          >
            <Feather
              name="globe"
              size={22}
              color={isDarkMode ? "#ECFDF5" : "#104029"}
            />
            <Text
              className={`text-base font-semibold ml-4 dark:text-gray-200 ${isDarkMode ? "text-green-100" : "text-green-900"}`}
            >
              Tentang Kami
            </Text>
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-500 dark:bg-red-600 rounded-xl py-4 mt-8"
          >
            <Text className="text-white text-center font-bold text-lg">
              Keluar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <ModalConfirm
        visible={showConfirmModal}
        message="Apakah Anda yakin ingin keluar?"
        onYes={confirmLogout}
        onNo={() => setShowConfirmModal(false)}
      />
    </Screen>
  );
};

export default ProfileScreen;
