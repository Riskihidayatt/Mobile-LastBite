import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import StoreListScreen from '../screen/Cart/StoreListScreen'; // Pastikan path ini benar
import CartScreen from '../screen/Cart/CartScreen';

const Stack = createStackNavigator();

const CartStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="StoreList" component={StoreListScreen} />
            <Stack.Screen name="CartMain" component={CartScreen} />
        </Stack.Navigator>
    );
};

export default CartStack;