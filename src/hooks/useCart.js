
import { useState } from 'react';

export const useCart = () => {
    const [allCartItems, setAllCartItems] = useState([
        {
            id: '1',
            name: 'Burger Daging Sapi',
            price: 10000,
            quantity: 1,
            image: require('../assets/foodearth.png'),
            storeId: '1',
        },
        {
            id: '2',
            name: 'Pizza Pepperoni',
            price: 20000,
            quantity: 2,
            image: require('../assets/foodearth.png'),
            storeId: '1',
        },
        {
            id: '3',
            name: 'Salad Sayur Segar',
            price: 15000,
            quantity: 1,
            image: require('../assets/foodearth.png'),
            storeId: '1',
        },
        {
            id: '4',
            name: 'Nasi Goreng',
            price: 12000,
            quantity: 1,
            image: require('../assets/foodearth.png'),
            storeId: '2',
        },
        {
            id: '5',
            name: 'Ayam Bakar',
            price: 25000,
            quantity: 1,
            image: require('../assets/foodearth.png'),
            storeId: '2',
        },
        {
            id: '6',
            name: 'Es Teh Manis',
            price: 5000,
            quantity: 1,
            image: require('../assets/foodearth.png'),
            storeId: '2',
        },
        {
            id: '7',
            name: 'Sate Ayam',
            price: 18000,
            quantity: 1,
            image: require('../assets/foodearth.png'),
            storeId: '3',
        },
        {
            id: '8',
            name: 'Gulai Kambing',
            price: 30000,
            quantity: 1,
            image: require('../assets/foodearth.png'),
            storeId: '3',
        },
    ]);

    const cartItems = allCartItems;

    const increaseQuantity = (itemId) => {
        setAllCartItems(currentItems =>
            currentItems.map(item =>
                item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    const decreaseQuantity = (itemId) => {
        setAllCartItems(currentItems =>
            currentItems.map(item =>
                item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
            ).filter(item => item.quantity > 0)
        );
    };

    const removeItem = (itemId) => {
        setAllCartItems(currentItems => currentItems.filter(item => item.id !== itemId));
    };

    const addItem = (itemToAdd, storeIdToAdd) => {
        setAllCartItems(currentItems => {
            const existingItemIndex = currentItems.findIndex(
                (item) => item.id === itemToAdd.id && item.storeId === storeIdToAdd
            );

            if (existingItemIndex > -1) {
                // Item already exists, increase quantity
                return currentItems.map((item, index) =>
                    index === existingItemIndex
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                // New item, add to cart with quantity 1
                return [...currentItems, { ...itemToAdd, storeId: storeIdToAdd, quantity: 1 }];
            }
        });
    };

    return {
        cartItems,
        increaseQuantity,
        decreaseQuantity,
        removeItem,
        addItem,
    };
};
