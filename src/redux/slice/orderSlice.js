import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
    createOrder as apiCreateOrder,
    getCustomerOrders as apiGetCustomerOrders,
    createDirectOrder as apiCreateDirectOrder
} from '../../api/config/orderApi';

export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await apiCreateOrder(orderData);
      return response.data.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Gagal membuat pesanan";
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk untuk order langsung
export const createDirectOrder = createAsyncThunk(
    'orders/createDirectOrder',
    async (directOrderData, { rejectWithValue }) => {
        try {
            const response = await apiCreateDirectOrder(directOrderData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Gagal membuat pesanan langsung');
        }
    }
);

// Thunk untuk mengambil riwayat pesanan
export const fetchCustomerOrders = createAsyncThunk(
  "orders/fetchCustomerOrders",
  async (status, { rejectWithValue }) => {
    try {
      const response = await apiGetCustomerOrders(status);
      return response.data.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Gagal memuat riwayat pesanan";
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
    orders: [],
    currentOrder: null,
    paymentUrl: null,
    // Kita gabungkan lagi statusnya untuk create dan createDirect karena alurnya sama
    submitStatus: 'idle', // Status untuk createOrder dan createDirectOrder
    fetchStatus: 'idle',  // Status untuk fetchCustomerOrders
    error: null,
};

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        resetOrderStatus: (state) => {
            state.currentOrder = null;
            state.paymentUrl = null;
            state.submitStatus = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Kasus untuk createOrder (dari keranjang)
            .addCase(createOrder.pending, (state) => { state.submitStatus = 'loading'; })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.submitStatus = 'succeeded';
                state.currentOrder = action.payload;
                state.paymentUrl = action.payload.payment?.redirectUrl;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.submitStatus = 'failed';
                state.error = action.payload;
            })
            // Kasus untuk createDirectOrder
            .addCase(createDirectOrder.pending, (state) => { state.submitStatus = 'loading'; })
            .addCase(createDirectOrder.fulfilled, (state, action) => {
                state.submitStatus = 'succeeded';
                state.currentOrder = action.payload;
                state.paymentUrl = action.payload.payment?.redirectUrl;
            })
            .addCase(createDirectOrder.rejected, (state, action) => {
                state.submitStatus = 'failed';
                state.error = action.payload;
            })
            // Kasus untuk mengambil riwayat pesanan
            .addCase(fetchCustomerOrders.pending, (state) => { state.fetchStatus = 'loading'; })
            .addCase(fetchCustomerOrders.fulfilled, (state, action) => {
                state.fetchStatus = 'succeeded';
                state.orders = action.payload;
            })
            .addCase(fetchCustomerOrders.rejected, (state, action) => {
                state.fetchStatus = 'failed';
                state.error = action.payload;
            });
    },
});

export const { resetOrderStatus } = orderSlice.actions;
export default orderSlice.reducer;