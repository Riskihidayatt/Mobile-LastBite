import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import APIs from '../../api'; // Import APIs
import getCurrentLocation from '../../utils/getCurrentLocation';

export const fetchMenuItems = createAsyncThunk(
  'menu/fetchMenuItems',
  async ({ longitude, latitude }, { rejectWithValue }) => {
    try {
      const response = await APIs.menuItems.get(`/menu-items?lon=${longitude}&lat=${latitude}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const menuSlice = createSlice({
  name: 'menu',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenuItems.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Transformasi data API agar sesuai dengan yang dibutuhkan komponen UI
        state.items = action.payload.map((item) => ({
          id: item.id,
          name: item.name,
          storeName: item.storeName,
          description: item.description,
          image: item.imageUrl, // Mapping imageUrl -> image
          price: item.discountedPrice, // Mapping discountedPrice -> price
          oldPrice: item.originalPrice, // Mapping originalPrice -> oldPrice
          rating: item.averageRating, // Mapping averageRating -> rating
          quantity: item.quantityAvailable,
          status: item.status,
          category: item.category,
          distanceKm: item.distanceKm, 
          address: item.address,
          longitude: item.longitude, 
          latitude: item.latitude, // Assuming this is provided in the API
        }));
      })
      .addCase(fetchMenuItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default menuSlice.reducer;
