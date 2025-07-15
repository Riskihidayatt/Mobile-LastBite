import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../context/ThemeContext";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

// Impor semua layar Anda
import HomeScreen from "../screen/Home/HomeScreen";
import DetailMenuScreen from "../screen/Home/DetailMenuScreen";
import RatingScreen from "../screen/Order/RatingScreen";
import ProfileScreen from "../screen/Profile/ProfileScreen";
import EditProfileScreen from "../screen/Profile/EditProfileScreen";
import ChangePasswordScreen from "../screen/Profile/ChangePasswordScreen";
import StoreListScreen from "../screen/Cart/StoreListScreen";
import CartScreen from "../screen/Cart/CartScreen";
import OrderTab from "../screen/Order/OrderScreen";
import PaymentScreen from "../screen/Cart/PaymentScreen";
import AllReviewsScreen from "../screen/Home/AllReviewsScreen";

// --- Inisialisasi semua navigator ---
const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator(); // Stack utama untuk seluruh aplikasi
const HomeStack = createNativeStackNavigator();
const OrderStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const CartStack = createNativeStackNavigator();

// --- Definisi setiap Stack ---

const HomeStackScreen = () => (
  <HomeStack.Navigator
    screenOptions={{
      headerTitleStyle: {
        fontWeight: "bold",
        textAlign: "center",
        color: "#0d3520",
      },
      headerStatusBarHeight: 0,
    }}
  >
    <HomeStack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <HomeStack.Screen
      name="DetailMenu"
      component={DetailMenuScreen}
      options={{ headerShown: false }}
    />
    <HomeStack.Screen
      name="AllReviewsScreen"
      component={AllReviewsScreen}
      options={{ headerTitle: "Ulasan", headerTitleAlign: "center" }}
    />
  </HomeStack.Navigator>
);

const OrderStackScreen = () => (
  <OrderStack.Navigator
    screenOptions={{
      headerTitleStyle: {
        fontWeight: "bold",
        textAlign: "center",
        color: "#0d3520",
      },
      headerStatusBarHeight: 0,
    }}
  >
    <OrderStack.Screen
      name="OrderList"
      component={OrderTab}
      options={{ headerShown: false }}
    />
    <OrderStack.Screen
      name="RatingScreen"
      component={RatingScreen}
      options={{ headerTitle: "Ulasan", headerTitleAlign: "center" }}
    />
  </OrderStack.Navigator>
);

const ProfileStackScreen = () => (
  <ProfileStack.Navigator
    screenOptions={{
      headerTitleStyle: {
        fontWeight: "bold",
        textAlign: "center",
        color: "#0d3520",
      },
      headerStatusBarHeight: 0,
    }}
  >
    <ProfileStack.Screen
      name="ProfileScreen"
      component={ProfileScreen}
      options={{ headerShown: false }}
    />
    <ProfileStack.Screen
      name="EditProfile"
      component={EditProfileScreen}
      options={{ headerTitle: "Ubah Profil", headerTitleAlign: "center" }}
    />
    <ProfileStack.Screen
      name="ChangePassword"
      component={ChangePasswordScreen}
      options={{ headerTitle: "Ubah Kata Sandi", headerTitleAlign: "center" }}
    />
  </ProfileStack.Navigator>
);

const CartStackScreen = () => (
  <CartStack.Navigator
    screenOptions={{
      headerTitleStyle: {
        fontWeight: "bold",
        textAlign: "center",
        color: "#0d3520",
      },
      headerStatusBarHeight: 0,
    }}
  >
    <CartStack.Screen
      name="CartList"
      component={StoreListScreen}
      options={{ headerShown: false }}
    />
    <CartStack.Screen
      name="CartMain"
      component={CartScreen}
      options={{ headerTitle: "Keranjang", headerTitleAlign: "center" }}
    />
  </CartStack.Navigator>
);

const MainTabNavigator = () => {
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === "dark";

  const tabBarStyle = {
    paddingBottom: 5,
    paddingTop: 5,
    height: 80,
    backgroundColor: isDarkMode ? "#121212" : "white",
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: isDarkMode ? "#66996" : "#335533",
        tabBarInactiveTintColor: isDarkMode ? "#335533" : "#66996",
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontSize: 15 },
        tabBarStyle: {
          ...tabBarStyle,
          backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff",
          borderTopColor: isDarkMode ? "#333333" : "#e0e0e0",
        },
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          if (route.name === "Home")
            iconName = focused ? "home" : "home-outline";
          else if (route.name === "Order")
            iconName = focused ? "receipt" : "receipt-outline";
          else if (route.name === "Cart")
            iconName = focused ? "cart" : "cart-outline";
          else if (route.name === "Profile")
            iconName = focused ? "person-circle" : "person-circle-outline";

          const iconSize = focused ? 30 : 20;
          return <Ionicons name={iconName} size={iconSize} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route);
          if (routeName && routeName !== "HomeScreen") {
            return { tabBarStyle: { display: "none" } };
          }
          return { tabBarStyle: tabBarStyle,  tabBarLabel: "Beranda" };
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartStackScreen}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route);
          if (routeName && routeName !== "CartList") {
            return { tabBarStyle: { display: "none" } };
          }
          return { tabBarStyle: tabBarStyle, tabBarLabel: "Keranjang" };
        }}
      />
      <Tab.Screen
        name="Order"
        component={OrderStackScreen}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route);
          if (routeName && routeName !== "OrderList") {
            return { tabBarStyle: { display: "none" } };
          }
          return { tabBarStyle: tabBarStyle, tabBarLabel: "Pesanan" };
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackScreen}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route);
          if (routeName && routeName !== "ProfileScreen") {
            return { tabBarStyle: { display: "none" } };
          }
          return { tabBarStyle: tabBarStyle, tabBarLabel: "Profil" };
        }}
      />
    </Tab.Navigator>
  );
};

// --- Komponen Root Navigator (pembungkus utama) ---
const RootNavigator = () => {
  return (
    <RootStack.Navigator>
      {/* Layar utama adalah seluruh Tab Navigator Anda */}
      <RootStack.Screen
        name="Main"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      {/* Tambahkan PaymentScreen sebagai modal di level tertinggi */}
      <RootStack.Screen
        name="PaymentScreen"
        component={PaymentScreen}
        options={{
          title: "Pembayaran",
          headerTitleAlign: "center",
          presentation: "modal",
        }}
      />
    </RootStack.Navigator>
  );
};

// Ekspor RootNavigator sebagai komponen utama dari file ini
export default RootNavigator;
