import { configureStore } from '@reduxjs/toolkit';
import reviewReducer, {
  submitMenuItemReview,
  fetchReviewsByMenuItem,
  resetSubmitStatus,
} from '../ReviewSlice';
import {
  submitReview as apiSubmitReview,
  getReviewsByMenuItem as apiGetReviewsByMenuItem,
} from '../../api/config/menuItemReviewApi';

describe('reviewSlice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        reviews: reviewReducer,
      },
    });
    jest.clearAllMocks();
  });

  // Test initial state
  it('should return the initial state', () => {
    expect(reviewReducer(undefined, {})).toEqual({
      reviews: [],
      latestReview: null,
      submitStatus: 'idle',
      fetchStatus: 'idle',
      error: null,
    });
  });

  // Test resetSubmitStatus reducer
  it('should handle resetSubmitStatus', () => {
    const initialState = {
      reviews: [{ id: '1' }],
      latestReview: { id: 'abc' },
      submitStatus: 'succeeded',
      fetchStatus: 'failed',
      error: 'some error',
    };
    const newState = reviewReducer(initialState, resetSubmitStatus());
    expect(newState).toEqual({
      reviews: [{ id: '1' }],
      latestReview: null,
      submitStatus: 'idle',
      fetchStatus: 'failed',
      error: null,
    });
  });

  // Test submitMenuItemReview async thunk
  describe('submitMenuItemReview', () => {
    it('should handle pending state', () => {
      const action = submitMenuItemReview.pending();
      const state = reviewReducer(undefined, action);
      expect(state.submitStatus).toBe('loading');
      expect(state.error).toBe(null);
    });

    it('should handle fulfilled state', async () => {
      const mockReviewData = { menuItemId: '123', rating: 5, comment: 'Great!' };
      const mockResponseData = { id: 'review1', ...mockReviewData };
      apiSubmitReview.mockResolvedValue({ data: { data: mockResponseData } });

      await store.dispatch(submitMenuItemReview(mockReviewData));

      const state = store.getState().reviews;
      expect(state.submitStatus).toBe('succeeded');
      expect(state.latestReview).toEqual(mockResponseData);
      expect(apiSubmitReview).toHaveBeenCalledWith(mockReviewData);
    });

    it('should handle rejected state', async () => {
      const mockReviewData = { menuItemId: '123', rating: 5, comment: 'Great!' };
      const errorMessage = 'Gagal anda sudah mengirim ulasan';
      apiSubmitReview.mockRejectedValue({ response: { data: { message: errorMessage } } });

      await store.dispatch(submitMenuItemReview(mockReviewData));

      const state = store.getState().reviews;
      expect(state.submitStatus).toBe('failed');
      expect(state.error).toBe(errorMessage);
    });
  });

  // Test fetchReviewsByMenuItem async thunk
  describe('fetchReviewsByMenuItem', () => {
    it('should handle pending state', () => {
      const action = fetchReviewsByMenuItem.pending();
      const state = reviewReducer(undefined, action);
      expect(state.fetchStatus).toBe('loading');
    });

    it('should handle fulfilled state', async () => {
      const menuItemId = 'menu456';
      const mockReviews = [{ id: 'r1' }, { id: 'r2' }];
      apiGetReviewsByMenuItem.mockResolvedValue({ data: { data: mockReviews } });

      await store.dispatch(fetchReviewsByMenuItem(menuItemId));

      const state = store.getState().reviews;
      expect(state.fetchStatus).toBe('succeeded');
      expect(state.reviews).toEqual(mockReviews);
      expect(apiGetReviewsByMenuItem).toHaveBeenCalledWith(menuItemId);
    });

    it('should handle rejected state', async () => {
      const menuItemId = 'menu456';
      const errorMessage = 'Gagal memuat ulasan';
      apiGetReviewsByMenuItem.mockRejectedValue({ response: { data: { message: errorMessage } } });

      await store.dispatch(fetchReviewsByMenuItem(menuItemId));

      const state = store.getState().reviews;
      expect(state.fetchStatus).toBe('failed');
      expect(state.error).toBe(errorMessage);
    });
  });
});