import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// 1. Impor kedua fungsi dari API
import { 
    submitReview as apiSubmitReview,
    getReviewsByMenuItem as apiGetReviewsByMenuItem
} from '../../api/config/menuItemReviewApi';

/**
 * Thunk untuk MENGIRIM ulasan (POST).
 */
export const submitMenuItemReview = createAsyncThunk(
    'reviews/submitReview',
    async (reviewData, { rejectWithValue }) => {
        try {
            const response = await apiSubmitReview(reviewData);
            return response.data.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Gagal anda sudah mengirim ulasan';
            return rejectWithValue(errorMessage);
        }
    }
);

/**
 * Thunk baru untuk MENGAMBIL ulasan (GET).
 */
export const fetchReviewsByMenuItem = createAsyncThunk(
    'reviews/fetchByMenuItem',
    async (menuItemId, { rejectWithValue }) => {
        try {
            const response = await apiGetReviewsByMenuItem(menuItemId);
            return response.data.data; // Mengembalikan array ulasan
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Gagal memuat ulasan';
            return rejectWithValue(errorMessage);
        }
    }
);

// State awal yang diperbarui
const initialState = {
    reviews: [],         
    latestReview: null,
    submitStatus: 'idle', 
    fetchStatus: 'idle',  
    error: null,
};

const reviewSlice = createSlice({
    name: 'reviews',
    initialState,
    reducers: {
        // Reset status untuk pengiriman ulasan
        resetSubmitStatus: (state) => {
            state.submitStatus = 'idle';
            state.error = null;
            state.latestReview = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Kasus untuk mengirim ulasan (submitMenuItemReview)
            .addCase(submitMenuItemReview.pending, (state) => {
                state.submitStatus = 'loading';
                state.error = null;
            })
            .addCase(submitMenuItemReview.fulfilled, (state, action) => {
                state.submitStatus = 'succeeded';
                state.latestReview = action.payload;
            })
            .addCase(submitMenuItemReview.rejected, (state, action) => {
                state.submitStatus = 'failed';
                state.error = action.payload;
            })
            
            // Kasus baru untuk mengambil ulasan (fetchReviewsByMenuItem)
            .addCase(fetchReviewsByMenuItem.pending, (state) => {
                state.fetchStatus = 'loading';
            })
            .addCase(fetchReviewsByMenuItem.fulfilled, (state, action) => {
                state.fetchStatus = 'succeeded';
                state.reviews = action.payload; // Simpan daftar ulasan ke state
            })
            .addCase(fetchReviewsByMenuItem.rejected, (state, action) => {
                state.fetchStatus = 'failed';
                state.error = action.payload;
            });
    },
});

export const { resetSubmitStatus } = reviewSlice.actions;
export default reviewSlice.reducer;