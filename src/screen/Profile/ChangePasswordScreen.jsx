import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../../redux/slice/userSlice";
import { Feather, Entypo } from "@expo/vector-icons";
import { ThemeContext } from "../../context/ThemeContext";
import Screen from "../Screen";
import ResponseModal from "../../components/common/ResponseModal";
import ModalConfirm from "../../components/common/ModalConfirm";
import Loading from "../../components/common/Loading";
import * as yup from "yup";

const ChangePasswordScreen = () => {
  const dispatch = useDispatch();
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === "dark";
  const { changePasswordStatus } = useSelector((state) => state.user);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('success');
  const [modalMessage, setModalMessage] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const passwordSchema = yup.object().shape({
    oldPassword: yup
      .string()
      .required("Password lama wajib diisi."),
    newPassword: yup
      .string()
      .min(8, "Password baru minimal 8 karakter.")
      .notOneOf([yup.ref('oldPassword'), null], 'Password baru tidak boleh sama dengan password lama.')
      .required("Password baru wajib diisi."),
    confirmNewPassword: yup
      .string()
      .oneOf([yup.ref("newPassword"), null], "Konfirmasi password baru tidak cocok.")
      .required("Konfirmasi password baru wajib diisi."),
  });

  const validateForm = async (values) => {
    try {
      await passwordSchema.validate(values, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationErrors) {
      const newErrors = {};
      validationErrors.inner.forEach((error) => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleChangePassword = () => {
    Keyboard.dismiss();
    setShowConfirmModal(true);
  };

  const confirmChangePassword = async () => {
    setShowConfirmModal(false);
    try {
      const isValid = await validateForm({ oldPassword, newPassword, confirmNewPassword });

      if (isValid) {
        const resultAction = await dispatch(changePassword({ oldPassword, newPassword, confirmNewPassword }));

        if (changePassword.fulfilled.match(resultAction)) {
          setModalType('success');
          setModalMessage('Password berhasil diubah!');
          setShowModal(true);
          setOldPassword("");
          setNewPassword("");
          setConfirmNewPassword("");
          setErrors({});
        } else {
          setModalType('error');
          setModalMessage(resultAction.payload || 'Terjadi kesalahan saat mengubah password.');
          setShowModal(true);
        }
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
  const isButtonDisabled =
    changePasswordStatus === 'loading' ||
    !oldPassword ||
    !newPassword ||
    !confirmNewPassword ||
    Object.keys(errors).some((key) => errors[key]);

  return (
    <Screen>
        <View className="flex-1 items-center px-5">
          <View
            className={`rounded-2xl w-full shadow-md mx-5 mt-10 p-5 ${
              isDarkMode ? "bg-black shadow-white" : "bg-white shadow-green-900"
            }`}
          >
          
            <View className="w-full">
              {/* Old Password */}
              <View className="flex-row items-center mb-2">
                <Text
                  className={`text-sm font-semibold ${
                    isDarkMode ? "text-green-200" : "text-green-700"
                  }`}
                >
                  Kata Sandi Lama
                </Text>
                <Text className="text-red-500 ml-1">*</Text>
              </View>
              <View
                className={`flex-row items-center ${inputBgColor} rounded-xl px-4 border border-gray-200 dark:border-gray-600`}
              >
                <Feather name="lock" size={20} color={iconColor} />
                <TextInput
                  className="flex-1 h-12 text-base ml-3"
                  style={{ color: isDarkMode ? "white" : "#1F2937" }}
                  placeholder="••••••••"
                  placeholderTextColor={iconColor}
                  secureTextEntry={!showOldPassword}
                  value={oldPassword}
                  onChangeText={(text) => {
                    setOldPassword(text);
                    validateForm({ oldPassword: text, newPassword, confirmNewPassword });
                  }}
                />
                <TouchableOpacity onPress={() => setShowOldPassword(!showOldPassword)}>
                  <Entypo
                    name={showOldPassword ? "eye" : "eye-with-line"}
                    size={20}
                    color={iconColor}
                  />
                </TouchableOpacity>
              </View>
              {errors.oldPassword && (
                <Text className="text-red-500 text-sm mt-1 mb-2">
                  {errors.oldPassword}
                </Text>
              )}

              {/* New Password */}
              <View className="flex-row items-center mb-2 mt-4">
                <Text
                  className={`text-sm font-semibold ${
                    isDarkMode ? "text-green-200" : "text-green-700"
                  }`}
                >
                  Kata Sandi Baru
                </Text>
                <Text className="text-red-500 ml-1">*</Text>
              </View>
              <View
                className={`flex-row items-center ${inputBgColor} rounded-xl px-4 border border-gray-200 dark:border-gray-600`}
              >
                <Feather name="lock" size={20} color={iconColor} />
                <TextInput
                  className="flex-1 h-12 text-base ml-3"
                  style={{ color: isDarkMode ? "white" : "#1F2937" }}
                  placeholder="••••••••"
                  placeholderTextColor={iconColor}
                  secureTextEntry={!showNewPassword}
                  value={newPassword}
                  onChangeText={(text) => {
                    setNewPassword(text);
                    validateForm({ oldPassword, newPassword: text, confirmNewPassword });
                  }}
                />
                <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                  <Entypo
                    name={showNewPassword ? "eye" : "eye-with-line"}
                    size={20}
                    color={iconColor}
                  />
                </TouchableOpacity>
              </View>
              {errors.newPassword && (
                <Text className="text-red-500 text-sm mt-1 mb-2">
                  {errors.newPassword}
                </Text>
              )}

              {/* Confirm New Password */}
              <View className="flex-row items-center mb-2 mt-4">
                <Text
                  className={`text-sm font-semibold ${
                    isDarkMode ? "text-green-200" : "text-green-700"
                  }`}
                >
                  Konfirmasi Kata Sandi Baru
                </Text>
                <Text className="text-red-500 ml-1">*</Text>
              </View>
              <View
                className={`flex-row items-center ${inputBgColor} rounded-xl px-4 border border-gray-200 dark:border-gray-600`}
              >
                <Feather name="lock" size={20} color={iconColor} />
                <TextInput
                  className="flex-1 h-12 text-base ml-3"
                  style={{ color: isDarkMode ? "white" : "#1F2937" }}
                  placeholder="••••••••"
                  placeholderTextColor={iconColor}
                  secureTextEntry={!showConfirmNewPassword}
                  value={confirmNewPassword}
                  onChangeText={(text) => {
                    setConfirmNewPassword(text);
                    validateForm({ oldPassword, newPassword, confirmNewPassword: text });
                  }}
                />
                <TouchableOpacity onPress={() => setShowConfirmNewPassword(!showConfirmNewPassword)}>
                  <Entypo
                    name={showConfirmNewPassword ? "eye" : "eye-with-line"}
                    size={20}
                    color={iconColor}
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmNewPassword && (
                <Text className="text-red-500 text-sm mt-1 mb-2">
                  {errors.confirmNewPassword}
                </Text>
              )}
            </View>

            {/* Change Password Button */}
            <TouchableOpacity
              onPress={handleChangePassword}
              disabled={isButtonDisabled}
              className={`py-4 rounded-xl items-center shadow-lg mt-5 w-full flex-row justify-center ${
                isButtonDisabled
                  ? "bg-gray-400 dark:bg-gray-600"
                  : "bg-green-500 dark:bg-green-600 active:bg-green-700"
              }`}
            >
              {changePasswordStatus === 'loading' && (
                <ActivityIndicator size="small" color="#FFFFFF" className="mr-2" />
              )}
              <Text className="text-white text-lg font-bold">Ubah Kata Sandi</Text>
            </TouchableOpacity>
          </View>
        </View>
      <ResponseModal
        visible={showModal}
        message={modalMessage}
        type={modalType}
        onClose={() => setShowModal(false)}
      />
      <ModalConfirm
        visible={showConfirmModal}
        message="Apakah Anda yakin ingin mengubah kata sandi?"
        onYes={confirmChangePassword}
        onNo={() => setShowConfirmModal(false)}
      />
    </Screen>
  );
};

export default ChangePasswordScreen;
