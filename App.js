import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, ThemeContext } from './src/context/ThemeContext';
import { StatusBar } from 'react-native';
import { Provider, useSelector, useDispatch } from 'react-redux';
import store from './src/redux/store';
import APIs from './src/api';
import { applyInterceptors } from './src/api/axiosConfig';

// Apply interceptors to all API instances
Object.values(APIs).forEach(apiInstance => {
  applyInterceptors(apiInstance, store);
});
import './global.css';

import useAuth from './src/hooks/useAuth';
import { fetchCart } from './src/redux/slice/cartSlice';
import WelcomeScreen from './src/screen/Welcomescreen/WelcomeScreen';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';
import Loading from './src/components/common/Loading';
import WebSocketHandler from './src/components/common/WebSocketHandler';
import ModalNotification from './src/components/common/ModalNotification';

const MainApp = () => {
    return (
        <>
            <WebSocketHandler/>
            <BottomTabNavigator />
            <ModalNotification />
        </>
    )
};
const Stack = createNativeStackNavigator();

const RootNavigator = () => {
    const { theme } = useContext(ThemeContext);
    const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
    const isDarkMode = theme === 'dark';
    const dispatch = useDispatch();

    const cartStatus = useSelector((state) => state.cart.status);

    useEffect(() => {

        if (isAuthenticated && cartStatus === 'idle') {
            dispatch(fetchCart());
        }
    }, [isAuthenticated, cartStatus, dispatch]);

    if (isAuthLoading) {
        return <Loading />;
    }

    return (
        <NavigationContainer>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <Stack.Navigator>
                {isAuthenticated ? (
                    <Stack.Screen
                        name="MainApp"
                        component={MainApp}
                        options={{ headerShown: false }}
                    />
                ) : (
                    <>
                        <Stack.Screen
                            name="Welcome"
                            component={WelcomeScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="Auth"
                            component={AuthNavigator}
                            options={{ headerShown: false }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default function App() {
    return (
        <Provider store={store}>
            <ThemeProvider>
                <SafeAreaProvider>
                    <RootNavigator />
                </SafeAreaProvider>
            </ThemeProvider>
        </Provider>
    );
}