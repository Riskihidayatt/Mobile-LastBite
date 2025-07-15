import React, { useContext } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Text, View, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "../../../context/ThemeContext";

import UnpaidOrder from "./tab/UnpaidOrder";
import OnProgressOrder from "./tab/OnProgressOrder";
import ReadyToPickupOrder from "./tab/ReadyToPickupOrder";
import DoneOrder from "./tab/DoneOrder";
import CancelOrderScreen from "./tab/CancelOrder";
import WaitConfirmOrder from "./tab/WaitConfirmOrder";

const Tab = createMaterialTopTabNavigator();

// Label singkat untuk beberapa tab
const tabLabelMapping = {
  "Ready to Pickup": "Ready",
  "Wait Confirm": "Waiting",
  Cancelled: "Cancelled",
};

const OrderScreen = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  return (
    <>
      {/* StatusBar mengikuti tema terang/gelap */}
      <StatusBar
        backgroundColor={isDark ? "#181A1B" : "#FFFFFF"}
        barStyle={isDark ? "light-content" : "dark-content"}
      />

      {/* SafeAreaView untuk melindungi tampilan dari notch */}
      <SafeAreaView
        className={`flex-1 ${isDark ? "bg-dark-primary" : "bg-white"}`}
      >
        <Tab.Navigator
          screenOptions={{
            tabBarScrollEnabled: true,
            tabBarStyle: {
              backgroundColor: isDark ? "#181A1B" : "white",
              elevation: isDark ? 0 : 2,
              shadowColor: isDark ? "transparent" : "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: isDark ? 0 : 0.1,
              shadowRadius: isDark ? 0 : 2,
              borderBottomWidth: isDark ? 1 : 0,
              borderBottomColor: isDark ? "#282a2b" : "transparent",
            },
            tabBarItemStyle: {
              paddingHorizontal: 12,
              paddingVertical: 8,
              width: "auto",
            },
            tabBarIndicatorStyle: {
              backgroundColor: "#2ECC71",
              height: 3,
              borderRadius: 2,
            },
            tabBarLabel: ({ focused, children }) => (
              <View
                className={`px-3 py-2 rounded-full ${
                  focused ? (isDark ? "bg-green-800" : "bg-green-100") : ""
                }`}
              >
                <Text
                  className={`font-medium text-sm ${
                    focused
                      ? isDark
                        ? "text-green-300"
                        : "text-green-700"
                      : isDark
                      ? "text-gray-400"
                      : "text-gray-600"
                  }`}
                >
                  {tabLabelMapping[children] || children}
                </Text>
              </View>
            ),
          }}
        >
          <Tab.Screen name="Belum Bayar" component={UnpaidOrder} options={{ title: "Belum Bayar" }} />
          <Tab.Screen name="Menunggu Konfirmasi" component={WaitConfirmOrder} options={{ title: "Menunggu Konfirmasi" }} />
          <Tab.Screen name="Dalam Proses" component={OnProgressOrder} options={{ title: "Dalam Proses" }} />
          <Tab.Screen name="Siap Diambil" component={ReadyToPickupOrder} options={{ title: "Siap Diambil" }} />
          <Tab.Screen name="Selesai" component={DoneOrder} options={{ title: "Selesai" }} />
          <Tab.Screen name="Dibatalkan" component={CancelOrderScreen} options={{ title: "Dibatalkan" }} />
        </Tab.Navigator>
      </SafeAreaView>
    </>
  );
};

export default OrderScreen;
