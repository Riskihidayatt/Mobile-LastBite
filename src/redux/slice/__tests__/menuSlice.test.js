import { configureStore } from '@reduxjs/toolkit';
import menuReducer, { fetchMenuItems } from '../menuSlice';
import APIs from '../../api';
import getCurrentLocation from '../../utils/getCurrentLocation';


// Mock getCurrentLocation
jest.mock('../../utils/getCurrentLocation', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('menuSlice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        menu: menuReducer,
      },
    });
    jest.clearAllMocks();
  });

  // Test initial state
  it('should return the initial state', () => {
    expect(menuReducer(undefined, {})).toEqual({
      items: [],
      status: 'idle',
      error: null,
    });
  });

  // Test fetchMenuItems async thunk
  describe('fetchMenuItems', () => {
    it('should handle pending state', () => {
      const action = fetchMenuItems.pending();
      const state = menuReducer(undefined, action);
      expect(state.status).toBe('loading');
    });

    it('should handle fulfilled state and transform data', async () => {
      const mockLocation = { longitude: 10, latitude: 20 };
      const mockApiData = [
        {
          id: '1',
          name: 'Nasi Goreng',
          storeName: 'Warung Enak',
          description: 'Delicious fried rice',
          imageUrl: 'nasigoreng.jpg',
          discountedPrice: 15000,
          originalPrice: 20000,
          averageRating: 4.5,
          quantityAvailable: 10,
          status: 'AVAILABLE',
          category: 'Main Course',
          distanceKm: 2.5,
          long: 10.1,
          lat: 20.1,
        },
      ];

      APIs.menuItems.get.mockResolvedValue({ data: { data: mockApiData } });

      await store.dispatch(fetchMenuItems(mockLocation));

      const state = store.getState().menu;
      expect(state.status).toBe('succeeded');
      expect(state.items).toEqual([
        {
          id: '1',
          name: 'Nasi Goreng',
          storeName: 'Warung Enak',
          description: 'Delicious fried rice',
          image: 'nasigoreng.jpg',
          price: 15000,
          oldPrice: 20000,
          rating: 4.5,
          quantity: 10,
          status: 'AVAILABLE',
          category: 'Main Course',
          distanceKm: 2.5,
          longitude: 10.1,
          latitude: 20.1,
        },
      ]);
      expect(APIs.menuItems.get).toHaveBeenCalledWith(
        `/menu-items?lon=${mockLocation.longitude}&lat=${mockLocation.latitude}`
      );
    });

    it('should handle rejected state', async () => {
      const mockLocation = { longitude: 10, latitude: 20 };
      const errorMessage = 'Network Error';
      APIs.menuItems.get.mockRejectedValue({ response: { data: { message: errorMessage } } });

      await store.dispatch(fetchMenuItems(mockLocation));

      const state = store.getState().menu;
      expect(state.status).toBe('failed');
      expect(state.error).toBe(errorMessage);
    });

    it('should handle rejected state with generic error message', async () => {
      const mockLocation = { longitude: 10, latitude: 20 };
      const errorMessage = 'Something went wrong';
      APIs.menuItems.get.mockRejectedValue(new Error(errorMessage));

      await store.dispatch(fetchMenuItems(mockLocation));

      const state = store.getState().menu;
      expect(state.status).toBe('failed');
      expect(state.error).toBe(errorMessage);
    });
  });
});