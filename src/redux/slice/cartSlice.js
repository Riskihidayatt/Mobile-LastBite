import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    addItemToCart as apiAddItemToCart,
    getCart as apiGetCart,
    deleteCartItem as apiDeleteCartItem,
    updateItemQuantity as apiUpdateItemQuantity
} from '../../api/config/cartApi';

// --- Thunks Anda (Tidak Diubah) ---
export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiGetCart();
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Gagal memuat keranjang');
        }
    }
);

export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async ({ item, quantity }, { dispatch, rejectWithValue }) => {
        try {
            // Panggil API untuk menambah item
            const response = await apiAddItemToCart(item.id, quantity);
            // Panggil fetchCart untuk memastikan data keranjang di seluruh aplikasi sinkron
            dispatch(fetchCart());
            // Kembalikan data dari respons jika sukses
            return response.data;
        } catch (error) {
            // Jika gagal, kirim pesan error dari server untuk ditampilkan
            return rejectWithValue(error.response?.data?.message || 'Gagal menambah item');
        }
    }
);

export const removeItemFromCart = createAsyncThunk(
    'cart/removeItem',
    async ({ cartItemId, storeName }, { dispatch, rejectWithValue }) => {
        try {
            await apiDeleteCartItem(cartItemId);
            dispatch(fetchCart()); 
            return { success: true };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Gagal menghapus item');
        }
    }
);

export const increaseItemQuantity = createAsyncThunk(
    'cart/increaseQuantity',
    async ({ cartItemId, storeName }, { getState, dispatch, rejectWithValue }) => {
        const state = getState();
        const item = state.cart.items[storeName]?.find(i => i.cartItemId === cartItemId);
        if (!item) return rejectWithValue('Item tidak ditemukan di slice');
        
        const newQuantity = item.quantity + 1;
        
        apiUpdateItemQuantity(cartItemId, newQuantity).catch(err => {
            console.error("Gagal update kuantitas di server, memuat ulang keranjang:", err);
            dispatch(fetchCart());
        });

        return { cartItemId, storeName, newQuantity, price: item.price };
    }
);

export const decreaseItemQuantity = createAsyncThunk(
    'cart/decreaseQuantity',
    async ({ cartItemId, storeName }, { getState, dispatch, rejectWithValue }) => {
        const state = getState();
        const item = state.cart.items[storeName]?.find(i => i.cartItemId === cartItemId);
        if (!item) return rejectWithValue('Item tidak ditemukan di slice');

        const newQuantity = item.quantity - 1;

        if (newQuantity <= 0) {
            return dispatch(removeItemFromCart({ cartItemId, storeName }));
        }
        
        apiUpdateItemQuantity(cartItemId, newQuantity).catch(err => {
            console.error("Gagal update kuantitas di server, memuat ulang keranjang:", err);
            dispatch(fetchCart()); 
        });

        return { cartItemId, storeName, newQuantity, price: item.price };
    }
);


const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: {},
        totalQuantity: 0,
        totalAmount: 0,
        cartId: null,
        status: 'idle', // <-- status umum untuk fetchCart
        error: null,
        // --- PENAMBAHAN STATE BARU ---
        addStatus: 'idle', // <-- Status khusus untuk addToCart
        addError: null,    // <-- Error khusus untuk addToCart
    },
    reducers: {
        clearCart: (state) => {
            state.items = {};
            state.totalQuantity = 0;
            state.totalAmount = 0;
            state.cartId = null;
        },
        // --- PENAMBAHAN REDUCER BARU ---
        resetAddCartStatus: (state) => {
            state.addStatus = 'idle';
            state.addError = null;
        },
        // ---------------------------------
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchCart.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const fetchedData = action.payload;
                const newCartItems = {};
                let newTotalQuantity = 0;
                let newTotalAmount = 0;
                
                if (fetchedData?.sellers?.length > 0) {
                    fetchedData.sellers.forEach(seller => {
                        const storeName = seller.storeName || 'Toko Tidak Dikenal';
                        newCartItems[storeName] = seller.items.map(item => ({
                            ...item,
                            sellerId: seller.sellerId,
                            name: item.menuItemName || item.name,
                            image: item.imageUrl || item.image,
                        }));
                        seller.items.forEach(item => {
                            newTotalQuantity += item.quantity;
                            newTotalAmount += item.subtotal;
                        });
                    });
                }
                
                state.items = newCartItems;
                state.totalQuantity = newTotalQuantity;
                state.totalAmount = newTotalAmount; // Ini masih menggunakan perhitungan lokal Anda
                state.cartId = fetchedData?.cartId || null;
            })

            // --- PENAMBAHAN LOGIKA BARU UNTUK addToCart ---
            .addCase(addToCart.pending, (state) => {
                state.addStatus = 'loading';
                state.addError = null;
            })
            .addCase(addToCart.fulfilled, (state) => {
                state.addStatus = 'succeeded';
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.addStatus = 'failed';
                state.addError = action.payload; // Simpan pesan error spesifik
            })
            // ---------------------------------------------
            
            // --- Logika Anda yang sudah ada (tidak diubah) ---
            .addCase(increaseItemQuantity.fulfilled, (state, action) => {
                const { cartItemId, storeName, newQuantity, price } = action.payload;
                const item = state.items[storeName]?.find(i => i.cartItemId === cartItemId);
                if (item) {
                    item.quantity = newQuantity;
                    item.subtotal = newQuantity * price;
                    state.totalQuantity++;
                    state.totalAmount += price;
                }
            })
            .addCase(decreaseItemQuantity.fulfilled, (state, action) => {
                const { cartItemId, storeName, newQuantity, price } = action.payload;
                const item = state.items[storeName]?.find(i => i.cartItemId === cartItemId);
                if (item) {
                    item.quantity = newQuantity;
                    item.subtotal = newQuantity * price;
                    state.totalQuantity--;
                    state.totalAmount -= price;
                }
            });
    },
});

// Pastikan Anda mengekspor action baru ini
export const { clearCart, resetAddCartStatus } = cartSlice.actions;
export default cartSlice.reducer;