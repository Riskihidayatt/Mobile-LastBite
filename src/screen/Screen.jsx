import {
  View,
  KeyboardAvoidingView,
  StatusBar,
  ScrollView,
  Platform,
} from "react-native";
import React, { useContext } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { ThemeContext } from "../context/ThemeContext";

const Screen = ({ children, scrollViewRef }) => {
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === "dark";

  const gradientColors = isDarkMode
    // ? ["#104029", "#0a2a19"]
    // : ["#ECFDF5", "#D1FAE5"];
    ? ["#1F2937", "#111827"]
    : ["#ECFDF5", "#D1FAE5"];
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <View className="flex-1 min-h-full w-full">
        <StatusBar
          barStyle={isDarkMode ? "light-content" : "dark-content"}
          backgroundColor={gradientColors[0]}
        />
        <LinearGradient colors={gradientColors} className="flex-1 min-h-full">
          <ScrollView ref={scrollViewRef} keyboardShouldPersistTaps="handled">{children}</ScrollView>
        </LinearGradient>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Screen;
